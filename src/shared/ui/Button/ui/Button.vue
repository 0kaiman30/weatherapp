<template>
  <button
    :class="[cls.button, cls[variant], cls[size], customClass]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import cls from "./Button.module.scss";

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

<style scoped lang="scss"></style>
