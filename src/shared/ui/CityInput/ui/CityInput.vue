<template>
  <div :class="cls['input-container']">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      ref="inputRef"
      :class="cls.input"
    />
    <ul v-if="showSuggestions && suggestions.length" :class="cls.suggestions">
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
import cls from "./CityInput.module.scss";

defineProps<{
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

<style scoped lang="scss"></style>
