<template>
  <div class="dailyCard">
    <div class="dailyCard__header">
      <span class="dailyCard__date">{{ formattedDate }}</span>
      <img
        class="dailyCard__icon"
        :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
        :alt="description"
      />
    </div>
    <div class="dailyCard__info">
      <p>Температура: {{ temp }} °C</p>
      <p v-if="description">Описание: {{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CityData } from "../../../api/openWeatherApi";

interface Props {
  date: number;
  temp: number;
  description: string;
  icon: string;
  city: CityData;
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
  const date = new Date(props.date * 1000);
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
});
</script>

<style scoped>
.dailyCard {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 150px;
  height: 120px;
  border: 2px solid black;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.2s;
}

.dailyCard:hover {
  transform: scale(1.05);
}

.dailyCard__icon {
  width: 50px;
  height: 50px;
}

.dailyCard__info {
  font-size: 12px;
}

.dailyCard__date {
  font-weight: bold;
}
</style>