import { ref } from "vue";
import {
  getWeatherByCoordinates,
  getHourlyForecast,
  type WeatherData,
  type CityData,
} from "../../api/openWeatherApi";

export type HourlyWeatherItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  rain?: {
    "1h": number;
  };
};

export type DailyWeatherItem = {
  date: number;
  temp: number;
  description: string;
  icon: string;
};

export const useWeather = () => {
  const weather = ref<WeatherData | null>(null);
  const hourlyData = ref<HourlyWeatherItem[]>([]);
  const dailyData = ref<DailyWeatherItem[]>([]);
  const isLoading = ref(false);
  const error = ref("");
  const cityMismatch = ref(false);

  const fetchWeather = async (city: CityData) => {
    if (isNaN(city.lat) || isNaN(city.lon)) {
      error.value = "Некорректные координаты города";
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = "";
    weather.value = null;
    cityMismatch.value = false;
    dailyData.value = [];

    try {
      const currentWeather = await getWeatherByCoordinates(
        city.lat,
        city.lon,
        city.name
      );
      weather.value = {
        ...currentWeather,
        name: city.name || currentWeather.name,
      };

      const hourly = await getHourlyForecast(city.lat, city.lon);
      hourlyData.value = hourly.list.slice(0, 9);

      const dailyMap: {
        [key: string]: {
          temps: number[];
          weather: { description: string; icon: string }[];
        };
      } = {};
      hourly.list.slice(0, 40).forEach((item: HourlyWeatherItem) => {
        const date = new Date(item.dt * 1000);
        if (isNaN(date.getTime())) return; // Пропускаем невалидные даты
        const dayKey = date.toISOString().split("T")[0];
        if (!dailyMap[dayKey]) {
          dailyMap[dayKey] = { temps: [], weather: [] };
        }
        dailyMap[dayKey].temps.push(item.main.temp);
        dailyMap[dayKey].weather.push(item.weather[0]);
      });

      dailyData.value = Object.entries(dailyMap)
        .slice(0, 7)
        .map(([dateStr, data]) => {
          const avgTemp =
            data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length;
          const mostFrequentWeather = data.weather.reduce((acc, curr) => {
            acc[curr.description] = (acc[curr.description] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const description = Object.keys(mostFrequentWeather).reduce((a, b) =>
            mostFrequentWeather[a] > mostFrequentWeather[b] ? a : b
          );
          const icon =
            data.weather.find((w) => w.description === description)?.icon ||
            data.weather[0].icon;

          const dateTimestamp = new Date(dateStr).getTime() / 1000;
          if (isNaN(dateTimestamp)) {
            console.warn(`Invalid date for ${dateStr}`);
            return null;
          }

          return {
            date: dateTimestamp,
            temp: Math.round(avgTemp),
            description,
            icon,
          };
        })
        .filter((item): item is DailyWeatherItem => item !== null);

      if (
        currentWeather.name.toLowerCase() !== city.name.toLowerCase() &&
        city.name
      ) {
        cityMismatch.value = true;
      }
    } catch (e) {
      error.value =
        "Ошибка загрузки погоды: " +
        (e instanceof Error ? e.message : String(e));
      console.error("Fetch weather error:", e);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    weather,
    hourlyData,
    dailyData,
    isLoading,
    error,
    cityMismatch,
    fetchWeather,
  };
};
