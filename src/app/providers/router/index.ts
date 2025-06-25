import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "./ui/AppLayout/AppLayout.vue";
import { TodoHistoryPage, WeatherPage } from "../../../pages/index";

export const ROUTE_NAMES = {
  WEATHER: "weather",
  HISTORY: "history",
};

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", name: ROUTE_NAMES.WEATHER, component: WeatherPage },
      {
        path: "todos-history",
        name: ROUTE_NAMES.HISTORY,
        component: TodoHistoryPage,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
