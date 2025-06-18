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
  variant: { type: String, default: "primary" },
  size: { type: String, default: "medium" },
  disabled: { type: Boolean, default: false },
  class: { type: String, default: "" },
});

const emit = defineEmits(["click"]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) emit("click", event);
};

const customClass = props.class;
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.button.small {
  padding: 5px;
}

.button.medium {
  padding: 10px 20px;
  font-size: 16px;
}

.button.large {
  padding: 15px 30px;
  font-size: 18px;
}

.button.styled {
  background-color: var(--primary-color);
  color: var(--text-color);
  font-weight: 400;
}
</style>
