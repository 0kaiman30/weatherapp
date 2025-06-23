<template>
  <div class="dailyCard">
    <div class="dailyCard__header">
      <span class="dailyCard__date">{{ formattedDate }}</span>
    </div>
    <div class="dailyCard__main">
      <img
        class="dailyCard__icon"
        :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
        :alt="description"
      />
      <div class="dailyCard__info">
        <p class="dailyCard__temp">{{ temp }} °C</p>
        <p v-if="description" class="dailyCard__description">
          {{ description }}
        </p>
      </div>
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
  return date.toLocaleDateString("en-EN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
});
</script>
<style scoped lang="scss">
.dailyCard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background-color: var(--secondary-color);

  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  color: var(--text-color-secondary);
  border: 1px solid rgba(var(--green-color), 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
  }

  &__header {
    display: flex;
    justify-content: center;
    padding: 4px 0;

    .dailyCard__date {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(var(--green-color), 0.15);
      padding: 2px 8px 0 8px;
      border-radius: 4px;
    }
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 7px;
  }

  &__icon {
    width: 50px;
    height: 50px;
    object-fit: contain;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.15);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .dailyCard__temp {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-color);
      line-height: 1.2;
    }

    .dailyCard__description {
      font-size: 10px;
      font-weight: 500;
      color: var(--text-color-secondary);
      text-transform: capitalize;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: "•";
        font-size: 10px;
        color: var(--green-color);
      }
    }
  }
}
</style>
