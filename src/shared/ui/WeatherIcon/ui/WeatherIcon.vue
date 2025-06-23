<template>
  <img
    :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
    :alt="`Weather icon ${icon}`"
    :class="cls.weatherIcon"
  />
</template>

<script setup lang="ts">
import cls from "./WeatherIcon.module.scss";

interface Props {
  icon: string;
}

defineProps<Props>();
</script>

<style scoped></style>
