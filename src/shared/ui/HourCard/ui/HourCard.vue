<template>
  <div :class="cls.hourCard">
    <div :class="cls.hourCard__header">
      <span :class="cls.hourCard__time">{{ formattedTime }}</span>
    </div>
    <div :class="cls.hourCard__main">
      <img
        :class="cls.hourCard__icon"
        :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
        :alt="description"
      />
      <div :class="cls.hourCard__info">
        <p :class="cls.hourCard__temp">{{ temp }} °C</p>
        <p v-if="description" :class="cls.hourCard__description">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import cls from "./HourCard.module.scss";

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

<style scoped lang="scss"></style>
