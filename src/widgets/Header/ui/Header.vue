<template>
  <header :class="cls.header">
    <div :class="cls.logo">WEATHER APP</div>

    <button :class="cls.burger" @click="toggleMenu" aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav :class="[cls.header_nav, { [cls.open]: isOpen }]">
      <ul :class="cls.header_ul">
        <li :class="cls.header_li">
          <RouterLink :to="{ name: ROUTE_NAMES.WEATHER }" :class="cls.header_li_router">Weather</RouterLink>
        </li>
        <li :class="cls.header_li">
          <RouterLink :to="{ name: ROUTE_NAMES.HISTORY }" :class="cls.header_li_router">ToDo's</RouterLink>
        </li>
      </ul>
      <ToggleTheme />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { ToggleTheme } from "../../../features/ToggleTheme";
import cls from "./Header.module.scss";
import { ROUTE_NAMES } from "../../../shared/config/routes";

const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped lang="scss"></style>
