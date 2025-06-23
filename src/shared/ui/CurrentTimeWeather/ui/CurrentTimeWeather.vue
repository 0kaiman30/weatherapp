<template>
  <div :class="cls['current-weather']">
    <div :class="cls['current-weather__main']">
      <div :class="cls['current-weather__info']">
        <h2>Weather now in {{ city.name }}</h2>
        <p :class="cls.description">
          <strong>{{ description }}</strong>
        </p>
        <div :class="cls['weather-details']">
          <p>Temperature: {{ temp }} °C</p>
          <p>Feels like: {{ feelsLike }} °C</p>
          <p>Pressure: {{ pressure }} hPa</p>
          <p>Humidity: {{ humidity }}%</p>
          <p>Clouds: {{ clouds }}%</p>
          <p>Visibility: {{ visibility / 1000 }} km</p>
          <p>Wind: {{ windSpeed }} m/s, {{ windDeg }}°</p>
          <p>Rain per hour: {{ rain }} mm</p>
        </div>
      </div>
      <img
        :src="`https://openweathermap.org/img/wn/${icon}@4x.png`"
        :alt="description"
        :class="cls['weather-icon']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CityData } from "../../../api/openWeatherApi";
import cls from "./CurrentTimeWeather.module.scss";

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

<style scoped lang="scss"></style>
