<template>
  <div>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="todayWeather_cityAndButton">
        <h2 class="city-title">{{ cityName }} ({{ country }})</h2>
        <Button
          variant="styled"
          size="medium"
          class="back-button"
          @click="goBack"
        >
          ← Назад
        </Button>
      </div>
      <CurrentTimeWeather
        v-if="hourlyData.length"
        v-bind="mapToCurrentProps(hourlyData[0])"
      />
      <div class="forecast__list">
        <HourCard
          v-for="(hour, index) in hourlyData"
          :key="hour.dt"
          :time="hour.dt"
          :temp="hour.main.temp"
          :feelsLike="isCurrentHour(hour.dt) ? hour.main.feels_like : null"
          :pressure="isCurrentHour(hour.dt) ? hour.main.pressure : null"
          :humidity="isCurrentHour(hour.dt) ? hour.main.humidity : null"
          :windSpeed="isCurrentHour(hour.dt) ? hour.wind.speed : null"
          :windDeg="isCurrentHour(hour.dt) ? hour.wind.deg : null"
          :visibility="isCurrentHour(hour.dt) ? hour.visibility : null"
          :clouds="isCurrentHour(hour.dt) ? hour.clouds.all : null"
          :rain="isCurrentHour(hour.dt) ? hour.rain?.['1h'] || 0 : null"
          :description="hour.weather[0].description"
          :icon="hour.weather[0].icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getHourlyForecast } from "../../../shared/api/openWeatherApi";
import { HourCard } from "../../../shared/ui";
import { CurrentTimeWeather } from "../../index";
import { Button } from "../../../shared/ui/index";

type HourlyWeatherItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  rain?: {
    "1h": number;
  };
};

const route = useRoute();
const router = useRouter();

const lat = Number(route.query.lat);
const lon = Number(route.query.lon);

const hourlyData = ref<HourlyWeatherItem[]>([]);
const cityName = ref("");
const country = ref("");
const loading = ref(true);
const error = ref("");

const isCurrentHour = (dt: number) => {
  const now = new Date();
  const target = new Date(dt * 1000);
  return now.getHours() === target.getHours();
};

onMounted(async () => {
  try {
    const data = await getHourlyForecast(lat, lon);
    hourlyData.value = data.list.slice(0, 9);
    cityName.value = data.city?.name || "Неизвестно";
    country.value = data.city?.country || "";
  } catch (e) {
    error.value = "Ошибка загрузки данных";
  } finally {
    loading.value = false;
  }
});

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

function goBack() {
  router.push("/");
}
</script>

<style scoped>
.todayWeather_cityAndButton {
  display: flex;
  justify-content: space-between;
  padding: 20px 0 5px;
}

.forecast__list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.city-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}
.back-button {
  margin-bottom: 16px;
}
</style>
