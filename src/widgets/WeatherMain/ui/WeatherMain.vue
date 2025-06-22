<template>
  <div class="weatherPage">
    <div class="weatherPage_search">
      <Input
        v-model="cityInput"
        placeholder="Введите название города"
        @select-city="handleCitySelect"
      />
      <Button
        variant="styled"
        size="small"
        @click="fetchWeatherWithCheck"
        :disabled="isLoading"
      >
        {{ isLoading ? "Загрузка..." : "Поиск" }}
      </Button>
    </div>

    <div class="weatherPage_mainPart">
      <div v-if="isLoading">
        <p>Загрузка данных о погоде...</p>
      </div>
      <div v-else-if="error">
        <p style="color: red">{{ error }}</p>
        <Button @click="error = ''">Очистить</Button>
      </div>
      <div v-else-if="weather && selectedCity">
        <CurrentTimeWeather
          v-if="hourlyData.length"
          v-bind="mapToCurrentProps(hourlyData[0])"
          :city="selectedCity"
        />
        <div class="forecast__hourly">
          <HourCard
            v-for="hour in hourlyData.slice(0, 9)"
            :key="hour.dt"
            :time="hour.dt"
            :temp="hour.main.temp"
            :description="hour.weather[0].description"
            :icon="hour.weather[0].icon"
          />
        </div>
        <div class="forecast__daily">
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
        <TodoList :weather="weather" :city="selectedCity.name" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button, Input, CurrentTimeWeather, DailyCard, HourCard } from "../../../shared/ui";
import { useWeather } from "../../../shared/lib";
import type { CityData } from "../../../shared/api/openWeatherApi";
import { getCoordinatesByCity } from "../../../shared/api/openWeatherApi";
import { TodoList } from "../../index";

const { weather, hourlyData, dailyData, isLoading, error, fetchWeather } = useWeather();
const cityInput = ref("");
const selectedCity = ref<CityData | null>(null);

const STORAGE_KEY = "weatherAppCity";

const loadSavedCity = async () => {
  const savedCity = localStorage.getItem(STORAGE_KEY);
  if (savedCity) {
    try {
      const cityData = JSON.parse(savedCity) as CityData;
      selectedCity.value = cityData;
      cityInput.value = cityData.name;
      await fetchWeather(cityData);
    } catch (e) {
      console.error("Ошибка при загрузке сохраненного города:", e);
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCity));
};

const handleCitySelect = async (cityData: CityData) => {
  selectedCity.value = cityData;
  cityInput.value = cityData.name;
  await fetchWeather(cityData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cityData));
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
    error.value = "Введите название города";
    return;
  }
  try {
    const coordsData = await getCoordinatesByCity(cityInput.value, 1);
    if (coordsData.length) {
      await handleCitySelect(coordsData[0]);
    } else {
      error.value = "Город не найден";
    }
  } catch (e) {
    error.value = "Ошибка при поиске города: " + (e instanceof Error ? e.message : String(e));
  }
};

onMounted(() => {
  loadSavedCity();
});
</script>

<style scoped>
.weatherPage_search {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.weatherPage_mainPart {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.forecast__hourly,
.forecast__daily {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>