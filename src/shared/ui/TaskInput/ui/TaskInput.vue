<template>
  <div class="input-container">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      ref="inputRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
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

<style scoped lang="scss">
.input-container {
  width: 100%;
  padding: 8px 0;
}

input {
  padding: 12px 16px;
  border: 1px solid rgba(var(--green-color), 0.3);
  border-radius: 10px;
  width: 100%;
  background-color: var(--secondary-color);
  font-size: 15px;
  color: var(--text-color-secondary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &::placeholder {
    color: rgba(var(--text-color-secondary), 0.5);
  }

  &:focus {
    outline: none;
    border-color: var(--green-color);
    box-shadow: 0 1px 6px rgba(var(--green-color), 0.2);
  }
}
</style>
