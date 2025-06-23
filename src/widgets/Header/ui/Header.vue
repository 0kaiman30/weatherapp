<template>
  <header :class="cls.header">
    WEATHER APP
    <nav :class="cls.header_nav">
      <ul :class="cls.header_ul">
        <li :class="cls.header_li">
          <RouterLink to="/" :class="cls.header_li_router">Weather</RouterLink>
        </li>
        <li :class="cls.header_li">
          <RouterLink to="/todos-history" :class="cls.header_li_router"
            >ToDo's</RouterLink
          >
        </li>
      </ul>
      <ToggleTheme />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ToggleTheme } from "../../../features/ToggleTheme";
import cls from "./Header.module.scss";
</script>

<style scoped lang="scss"></style>
