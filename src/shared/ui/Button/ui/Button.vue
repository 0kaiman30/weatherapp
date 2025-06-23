<template>
  <button
    :class="['button', variant, size, customClass]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value: string) =>
      [
        "primary",
        "icon",
        "add",
        "edit",
        "complete",
        "save",
        "cancel",
        "delete",
      ].includes(value),
  },
  size: {
    type: String,
    default: "medium",
    validator: (value: string) => ["small", "medium", "large"].includes(value),
  },
  disabled: { type: Boolean, default: false },
  class: { type: String, default: "" },
});

const emit = defineEmits(["click"]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) emit("click", event);
};

const customClass = props.class;
</script>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: 400;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.small {
    padding: 6px 10px;
    font-size: 12px;
  }

  &.icon {
    background-color: transparent;
  }

  &.medium {
    padding: 10px 20px;
    font-size: 16px;
  }

  &.large {
    padding: 15px 30px;
    font-size: 18px;
  }

  &.primary {
    background-color: var(--primary-color);
    color: var(--text-color);
  }

  &.add {
    background-color: var(--green-color);
    color: var(--text-color);
  }

  &.edit {
    background-color: var(--blue-color);
    color: var(--text-color);
  }

  &.complete {
    background-color: var(--green-color);
    color: var(--text-color);
  }

  &.save {
    background-color: var(--green-color);
    color: var(--text-color);
  }

  &.cancel {
    background-color: var(--red-color);
    color: var(--text-color);
  }

  &.delete {
    background-color: var(--red-color);
    color: var(--text-color);
  }
}
</style>
