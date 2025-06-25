<template>
  <div :class="cls.weatherPage">
    <div :class="cls.weatherPage_mainPart">
      <AsyncContent :is-loading="isLoading" :error="error">
        <template v-if="weather && selectedCity">
          <div :class="cls.weatherPage_content">
            <div :class="[cls.col, cls['col-6'], cls.leftPart]">
              <div :class="cls.weatherPage_search">
                <CityInput
                  v-model="cityInput"
                  placeholder="Enter city name"
                  @select-city="handleCitySelect"
                />
                <Button
                  variant="primary"
                  size="small"
                  @click="fetchWeatherWithCheck"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Loading..." : "Search" }}
                </Button>
              </div>
              <div :class="cls['forecast__currentTime']">
                <div :class="cls['forecast__daily']">
                  <DailyCard
                    v-for="day in dailyData"
                    :key="day.date"
                    :date="day.date"
                    :temp="day.temp"
                    :description="day.description"
                    :icon="day.icon"
                    :city="selectedCity"
                  />
                </div>
              </div>
            </div>
            <div :class="[cls.col, cls['col-6'], cls.rightPart]">
              <CurrentTimeWeather
                v-if="hourlyData.length"
                v-bind="mapToCurrentProps(hourlyData[0])"
                :city="selectedCity"
              />
              <div :class="cls['forecast__hourly']">
                <HourCard
                  v-for="hour in hourlyData.slice(0, 9)"
                  :key="hour.dt"
                  :time="hour.dt"
                  :temp="hour.main.temp"
                  :description="hour.weather[0].description"
                  :icon="hour.weather[0].icon"
                />
              </div>
            </div>
          </div>
          <div :class="cls.todoList">
            <TodoList :weather="weather" :city="selectedCity.name" />
          </div>
        </template>
      </AsyncContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import cls from "./WeatherMain.module.scss";
import { onMounted, ref } from "vue";
import { useWeather } from "../../../shared/lib";
import type { CityData } from "../../../shared/api/openWeatherApi";
import { getCoordinatesByCity } from "../../../shared/api/openWeatherApi";
import { TodoList } from "../../TodoList";
import { HourCard } from "../../../shared/ui/HourCard";
import { CurrentTimeWeather } from "../../../shared/ui/CurrentTimeWeather";
import { DailyCard } from "../../../shared/ui/DailyCard";
import { Button } from "../../../shared/ui/Button";
import { CityInput } from "../../../shared/ui/CityInput";
import { loadCity, saveCity } from "../../../shared/lib/browser/storage";
import { AsyncContent } from "../../../shared/ui/AsyncContent";

const { weather, hourlyData, dailyData, isLoading, error, fetchWeather } =
  useWeather();
const cityInput = ref("");
const selectedCity = ref<CityData | null>(null);

const STORAGE_KEY = "weatherAppCity";

const loadSavedCity = async () => {
  const savedCity = loadCity();
  if (savedCity) {
    try {
      selectedCity.value = savedCity;
      cityInput.value = savedCity.name;
      await fetchWeather(savedCity);
    } catch (e) {
      console.error("Error loading saved city:", e);
      await loadDefaultCity();
    }
  } else {
    await loadDefaultCity();
  }
};

const loadDefaultCity = async () => {
  const defaultCity: CityData = {
    name: "Bishkek",
    country: "KG",
    lat: 42.8746,
    lon: 74.5698,
  };
  selectedCity.value = defaultCity;
  cityInput.value = defaultCity.name;
  await fetchWeather(defaultCity);
  saveCity(defaultCity);
};

const handleCitySelect = async (cityData: CityData) => {
  selectedCity.value = cityData;
  cityInput.value = cityData.name;
  await fetchWeather(cityData);
  saveCity(cityData);
};

function mapToCurrentProps(item: any) {
  return {
    temp: item.main.temp,
    feelsLike: item.main.feels_like,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    pressure: item.main.pressure,
    humidity: item.main.humidity,
    clouds: item.clouds.all,
    visibility: item.visibility,
    windSpeed: item.wind.speed,
    windDeg: item.wind.deg,
    rain: item.rain?.["1h"] || 0,
  };
}

const fetchWeatherWithCheck = async () => {
  if (!cityInput.value.trim()) {
    error.value = "Please enter a city name";
    return;
  }
  try {
    const coordsData = await getCoordinatesByCity(cityInput.value, 1);
    if (coordsData.length) {
      await handleCitySelect(coordsData[0]);
    } else {
      error.value = "City not found";
    }
  } catch (e) {
    error.value =
      "Error searching for city: " +
      (e instanceof Error ? e.message : String(e));
  }
};

onMounted(() => {
  loadSavedCity();
});
</script>

<style scoped lang="scss"></style>
