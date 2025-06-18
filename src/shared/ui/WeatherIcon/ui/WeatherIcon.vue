<template>
  <img
    :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
    :alt="`Weather icon ${icon}`"
    class="weatherIcon"
  />
</template>

<script setup lang="ts">
interface Props {
  icon: string;
}

defineProps<Props>();
</script>

<style scoped>
.weatherIcon {
  width: 10px;
  height: 10px;
}
</style>
