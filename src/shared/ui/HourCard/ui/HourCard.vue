<template>
  <div class="hourCard">
    <div class="hourCard__header">
      <span class="hourCard__time">{{ formattedTime }}</span>
      <img
        class="hourCard__icon"
        :src="`https://openweathermap.org/img/wn/${icon}@2x.png`"
        :alt="description"
      />
    </div>
    <div class="hourCard__info">
      <p>Температура: {{ temp }} °C</p>
      <p v-if="description">Описание: {{ description }}</p>
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

<style scoped>
.hourCard {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  width: 10%;
  height: 100px;
  border: 2px solid black;
  padding: 5px;
}

.hourCard__icon {
  width: 45px;
  height: 45px;
}

.hourCard__info {
  font-size: 7px;
}
</style>
