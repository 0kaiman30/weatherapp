<template>
  <header>
    WEATHER APP
    <nav class="header_nav">
      <ul class="header_ul">
        <li class="header_li">
          <RouterLink to="/" class="header_li_router">Weather</RouterLink>
        </li>
        <li class="header_li">
          <RouterLink to="/todos-history" class="header_li_router">ToDo's</RouterLink>
        </li>
      </ul>
      <ToggleTheme/>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ToggleTheme } from "../../../features/ToggleTheme";
</script>

<style scoped>
header {
  display: flex;
  background-color: var(--primary-color);
  color: var(--text-color);
  height: 65px;
  font-size: 25px;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.header_nav {
  display: flex;
  align-items: center;
}

.header_ul {
  display: flex;
  margin-right: 20px;
}

.header_li {
  list-style: none;
  padding: 0 15px;
}

.header_li_router {
  display: flex;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 450;
  font-size: 15px;
}
</style>
