const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export type Coordinates = {
  lat: number;
  lon: number;
};

export type CityData = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export type WeatherData = {
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number };
  name: string;
  sys: {
    country: string;
  };
};

export async function getCoordinatesByCity(city: string, limit = 1): Promise<CityData[]> {
  const query = city.includes(",") ? city : `${city}`;
  const response = await fetch(`${GEO_BASE_URL}?q=${query}&limit=${limit}&appid=${API_KEY}`);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`Geocoding API response for "${query}":`, data);
  if (!Array.isArray(data) || !data.length) {
    throw new Error("Ггород не найден");
  }
  return data.map((item: any) => ({
    name: query.split(",")[0].trim(),
    country: item.country || "",
    lat: item.lat || 0,
    lon: item.lon || 0,
  }));
}

export async function getWeatherByCoordinates(lat: number, lon: number, expectedCity?: string): Promise<WeatherData> {
  console.log(`Requesting weather for lat: ${lat}, lon: ${lon}`);
  const response = await fetch(`${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  console.log("Weather API response:", data);
  if (expectedCity && data.name.toLowerCase() !== expectedCity.toLowerCase()) {
    console.warn(
      `Warning: Expected city "${expectedCity}", but received "${data.name}" for coordinates lat: ${lat}, lon: ${lon}`
    );
  }
  return data;
}

export async function getWeatherByCity(city: string): Promise<WeatherData | null> {
  const coordsData = await getCoordinatesByCity(city, 1);
  if (!coordsData.length) return null;
  return getWeatherByCoordinates(coordsData[0].lat, coordsData[0].lon, coordsData[0].name);
}

export async function getHourlyForecast(lat: number, lon: number) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const data = await response.json();
  return data;
}