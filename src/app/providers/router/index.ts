import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "./ui/AppLayout/AppLayout.vue";
import { TodoHistoryPage, WeatherPage } from "../../../pages/index";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", component: WeatherPage },
      { path: "todos-history", component: TodoHistoryPage },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
