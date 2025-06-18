import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "./ui/AppLayout/AppLayout.vue";
import { TodayWeatherPage, TodoPage, WeatherPage } from "../../../pages/index";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", component: WeatherPage },
      { path: "todos", component: TodoPage },
      // { path: 'week', component: WeekPage},
      { path: "today-weather", component: TodayWeatherPage },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
