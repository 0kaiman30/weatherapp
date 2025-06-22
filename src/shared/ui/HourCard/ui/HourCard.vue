<template>
  <div class="hourCard">
    <div class="hourCard__header">
      <span class="hourCard__time">{{ formattedTime }}</span>
    </div>
    <div class="hourCard__main">
      <img
        class="hourCard__icon"
        :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
        :alt="description"
      />
      <div class="hourCard__info">
        <p class="hourCard__temp">{{ temp }} °C</p>
        <p v-if="description" class="hourCard__description">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  time: number;
  temp: number;
  description: string;
  icon: string;
}

const props = defineProps<Props>();

const formattedTime = computed(() => {
  const date = new Date(props.time * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
});
</script>

<style scoped lang="scss">
.hourCard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 140px;
  padding: 12px;
  background: linear-gradient(
    135deg,
    var(--secondary-color) 60%,
    rgba(var(--green-color), 0.08)
  );
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  color: var(--text-color-secondary);
  border: 1px solid rgba(var(--green-color), 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  &__header {
    display: flex;
    justify-content: center;
    padding: 4px 0;

    .hourCard__time {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(var(--green-color), 0.15);
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
  }

  &__icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.15);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .hourCard__temp {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
      line-height: 1.1;
    }

    .hourCard__description {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-color-secondary);
      text-transform: capitalize;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: "•";
        color: var(--green-color);
        font-size: 8px;
      }
    }
  }
}
</style>
