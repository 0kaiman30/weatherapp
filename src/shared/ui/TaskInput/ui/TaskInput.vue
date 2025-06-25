<template>
  <div :class="cls['input-container']">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      ref="inputRef"
      :class="cls.input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import cls from "./TaskInput.module.scss";

defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};
</script>

<style scoped lang="scss"></style>
