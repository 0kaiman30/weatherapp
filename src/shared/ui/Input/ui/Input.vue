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
import { getCoordinatesByCity, type CityData } from "../../../api/openWeatherApi";

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
  console.log("Selected city:", city); // Отладка
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

<style scoped>
.input-container {
  position: relative;
  width: 100%;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background: #f0f0f0;
}
</style>