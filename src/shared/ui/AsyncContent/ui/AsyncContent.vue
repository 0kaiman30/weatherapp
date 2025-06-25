<template>
  <div :class="cls.asyncContent">
    <template v-if="isLoading">
      <slot name="loading" :is-loading="isLoading">
        <div :class="cls.loading">Loading...</div>
      </slot>
    </template>
    <template v-else-if="error">
      <slot name="error" :error="error">
        <div :class="cls.error">{{ error }}</div>
      </slot>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean;
  error: string | null;
}>();
import cls from "./AsyncContent.module.scss";
</script>

<style module lang="scss">
</style>
