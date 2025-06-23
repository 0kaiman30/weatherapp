<template>
  <div :class="cls.dailyCard">
    <div :class="cls.dailyCard__header">
      <span :class="cls.dailyCard__date">{{ formattedDate }}</span>
    </div>
    <div :class="cls.dailyCard__main">
      <img
        :class="cls.dailyCard__icon"
        :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
        :alt="description"
      />
      <div :class="cls.dailyCard__info">
        <p :class="cls.dailyCard__temp">{{ temp }} °C</p>
        <p v-if="description" :class="cls.dailyCard__description">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { CityData } from "../../../api/openWeatherApi";
import cls from "./DailyCard.module.scss";

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
  return date.toLocaleDateString("en-EN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
});
</script>
<style scoped lang="scss"></style>
