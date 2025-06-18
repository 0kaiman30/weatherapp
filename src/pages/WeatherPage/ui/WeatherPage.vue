<template>
  <div>
    <p>WEATHER PAGE</p>

    <Input
      v-model="city"
      placeholder="Enter city name"
      @select-city="handleCitySelect"
    />
    <Button
      variant="styled"
      size="medium"
      @click="fetchWeather"
      :disabled="isLoading"
    >
      {{ isLoading ? "Loading..." : "PRESS ME" }}
    </Button>

    <div v-if="isLoading">
      <p>Loading weather data...</p>
    </div>
    <div v-else-if="weather">
      <p>
        <strong>City:</strong> {{ selectedCity?.name || weather.name }},
        {{ selectedCity?.country }}
      </p>
      <p><strong>Temperature:</strong> {{ weather.main.temp }} °C</p>
      <p><strong>Description:</strong> {{ weather.weather[0].description }}</p>
    </div>
    <div v-else-if="error">
      <p style="color: red">{{ error }}</p>
    </div>
    <div v-if="cityMismatch">
      <p style="color: orange">
        Warning: Showing weather data for "{{ weather?.name }}" as "{{
          selectedCity?.name
        }}" is not available in the weather database.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getWeatherByCoordinates,
  type WeatherData,
  type CityData,
} from "../../../shared/api/openWeatherApi";
import { Button, Input } from "../../../shared/ui";

const city = ref("Bishkek");
const selectedCity = ref<CityData>({
  name: "Bishkek",
  country: "KG",
  lat: 42.8746,
  lon: 74.5698,
});
const weather = ref<WeatherData | null>(null);
const error = ref("");
const isLoading = ref(false);
const cityMismatch = ref(false);

const handleCitySelect = (cityData: CityData) => {
  console.log("Received city selection:", cityData); // Отладка
  selectedCity.value = cityData;
  city.value = cityData.name;
  cityMismatch.value = false;
};

const fetchWeather = async () => {
  if (!selectedCity.value) {
    error.value = "Please select a city.";
    return;
  }

  isLoading.value = true;
  error.value = "";
  weather.value = null;
  cityMismatch.value = false;

  try {
    const data = await getWeatherByCoordinates(
      selectedCity.value.lat,
      selectedCity.value.lon,
      selectedCity.value.name
    );
    console.log("Fetched weather for:", selectedCity.value, "Result:", data); // Отладка
    weather.value = data;
    if (data.name.toLowerCase() !== selectedCity.value.name.toLowerCase()) {
      cityMismatch.value = true;
    }
  } catch (e) {
    error.value = "Error fetching weather data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchWeather();
});
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}
</style>
