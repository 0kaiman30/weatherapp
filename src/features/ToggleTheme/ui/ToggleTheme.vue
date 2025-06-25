<template>
  <Button size="small" variant="icon" @click="toggleTheme">
    <img
      :src="
        theme === 'dark'
          ? 'https://cdn-icons-png.flaticon.com/256/4445/4445942.png'
          : 'https://cdn-icons-png.flaticon.com/512/3258/3258157.png'
      "
      alt="Theme Icon"
    />
  </Button>
</template>

<script setup lang="ts">
import { Button } from "../../../shared/ui/Button";
import { useTheme } from "../model/useTheme";
const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
button img {
  width: 25px;
  height: 25px;
}
</style>
