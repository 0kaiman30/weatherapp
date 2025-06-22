<template>
  <div class="input-container">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      ref="inputRef"
    />
    <ul v-if="showSuggestions && suggestions.length" class="suggestions">
      <li
        v-for="city in suggestions"
        :key="`${city.name}-${city.country}-${city.lat}-${city.lon}`"
        @mousedown="selectCity(city)"
      >
        {{ city.name }}, {{ city.country }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  getCoordinatesByCity,
  type CityData,
} from "../../../api/openWeatherApi";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "selectCity", city: CityData): void;
}>();

const suggestions = ref<CityData[]>([]);
const showSuggestions = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = async (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);

  if (value.length >= 2) {
    suggestions.value = await getCoordinatesByCity(value, 3);
    console.log("Suggestions for", value, ":", suggestions.value);
  } else {
    suggestions.value = [];
  }
};

const selectCity = (city: CityData) => {
  console.log("Selected city:", city);
  emit("update:modelValue", city.name);
  emit("selectCity", city);
  suggestions.value = [];
  showSuggestions.value = false;
  inputRef.value?.focus();
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>

<style scoped lang="scss">
.input-container {
  position: relative;
  width: 100%;
  padding: 8px 0;
}

input {
  padding: 12px 16px;
  border: 1px solid rgba(var(--green-color), 0.3);
  border-radius: 10px;
  width: 90%;
  font-size: 15px;
  background-color: var(--secondary-color);
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

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--secondary-color);
  border: 1px solid rgba(var(--green-color), 0.15);
  border-radius: 10px;
  list-style: none;
  padding: 8px 0;
  max-height: 160px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  scrollbar-width: thin;
  scrollbar-color: var(--green-color) var(--secondary-color);

  li {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color-secondary);
  }
}
</style>
