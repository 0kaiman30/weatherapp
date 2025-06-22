<template>
  <div class="weatherPage">
    <div class="weatherPage_mainPart">
      <div v-if="isLoading" class="loading-message">
        <p>Загрузка данных о погоде...</p>
      </div>
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <Button @click="error = ''">Очистить</Button>
      </div>
      <div v-else-if="weather && selectedCity">
        <div class="weatherPage_content">
          <div class="leftPart">
            <div class="weatherPage_search">
              <CityInput
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
            <div class="forecast__currentTime">
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
            </div>
          </div>
          <div class="rightPart">
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
          </div>
        </div>
        <div class="todoList">
          <TodoList :weather="weather" :city="selectedCity.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Button,
  CityInput,
  CurrentTimeWeather,
  DailyCard,
  HourCard,
} from "../../../shared/ui";
import { useWeather } from "../../../shared/lib";
import type { CityData } from "../../../shared/api/openWeatherApi";
import { getCoordinatesByCity } from "../../../shared/api/openWeatherApi";
import { TodoList } from "../../index";

const { weather, hourlyData, dailyData, isLoading, error, fetchWeather } =
  useWeather();
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
    error.value =
      "Ошибка при поиске города: " +
      (e instanceof Error ? e.message : String(e));
  }
};

onMounted(() => {
  loadSavedCity();
});
</script>

<style scoped lang="scss">
.weatherPage {
  background-color: var(--primary-color);
  color: var(--text-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  &_mainPart {
    display: flex;
    flex-direction: column;
    padding: 32px 5px;
    background-color: var(--primary-color);
    width: 100%;
  }

  &_search {
    display: flex;
    justify-content: space-between;
    padding: 3px 20px;
    background-color: var(--back-color);
    border-radius: 12px;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
  }

  &_content {
    display: flex;
  }
}

.leftPart {
  padding: 5px;
  width: 40%;
  display: flex;
  flex-direction: column;
}

.rightPart {
  padding: 5px;
  width: 60%;
  display: flex;
  flex-direction: column;
}

.todoList {
  width: 100%;
  padding-top: 16px;
}

.forecast {
  &__hourly {
    display: flex;
    gap: 16px;
    padding: 24px 0;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--green-color) var(--secondary-color);

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-color);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--green-color);
      border-radius: 4px;
    }
  }

  &__daily {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    gap: 12px;
  }

  &__currentTime {
    padding: 24px 0;
  }
}

.error-message {
  color: var(--red-color);
  padding: 16px 20px;
  background-color: rgba(239, 68, 68, 0.08);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid var(--red-color);
  width: 100%;
}

.loading-message {
  padding: 32px;
  text-align: center;
  color: var(--green-color);
  font-size: 18px;
  background-color: rgba(45, 153, 91, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(45, 153, 91, 0.2);
}
</style>
