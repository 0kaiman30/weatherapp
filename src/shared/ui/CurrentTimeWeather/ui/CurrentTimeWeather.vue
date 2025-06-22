<!-- src/components/weather/CurrentTimeWeather.vue -->
<template>
  <div class="current-weather">
    <h2>Погода сейчас в {{ city.name }}</h2>
    <div class="current-weather__main">
      <img :src="`https://openweathermap.org/img/wn/${icon}@4x.png`" :alt="description" />
      <div class="current-weather__info">
        <p><strong>{{ description }}</strong></p>
        <p>Температура: {{ temp }} °C</p>
        <p>Ощущается как: {{ feelsLike }} °C</p>
        <p>Давление: {{ pressure }} hPa</p>
        <p>Влажность: {{ humidity }}%</p>
        <p>Облачность: {{ clouds }}%</p>
        <p>Видимость: {{ visibility / 1000 }} км</p>
        <p>Ветер: {{ windSpeed }} м/с, {{ windDeg }}°</p>
        <p>Дождь за час: {{ rain }} мм</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CityData } from "../../../api/openWeatherApi";

interface Props {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  pressure: number;
  humidity: number;
  clouds: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  rain: number;
  city: CityData;
}

defineProps<Props>();
</script>

<style scoped>
.current-weather {
  background: var(--card-bg, #f5f5f5);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.current-weather__main {
  display: flex;
  align-items: center;
}
.current-weather__info {
  margin-left: 20px;
}
.current-weather__info p {
  margin: 4px 0;
}
</style>