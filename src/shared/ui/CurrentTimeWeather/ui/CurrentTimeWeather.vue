<template>
  <div class="current-weather">
    <div class="current-weather__main">
      <div class="current-weather__info">
        <h2>Weather now in {{ city.name }}</h2>
        <p class="description">
          <strong>{{ description }}</strong>
        </p>
        <div class="weather-details">
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
        class="weather-icon"
      />
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

<style scoped lang="scss">
.current-weather {
  background-color: var(--secondary-color);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: var(--text-color-secondary);
  border: 1px solid rgba(var(--green-color), 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  &__main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-color);
      text-transform: capitalize;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .description {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      text-transform: capitalize;
      background: rgba(var(--green-color), 0.15);
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-block;
    }

    .weather-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-color-secondary);

      p {
        display: flex;
        align-items: center;
        gap: 4px;

        &::before {
          content: "•";
          color: var(--green-color);
          font-size: 10px;
        }
      }
    }
  }

  .weather-icon {
    width: 200px;
    height: 200px;
    object-fit: contain;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
