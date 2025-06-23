<template>
  <header>
    WEATHER APP
    <nav class="header_nav">
      <ul class="header_ul">
        <li class="header_li">
          <RouterLink to="/" class="header_li_router">Weather</RouterLink>
        </li>
        <li class="header_li">
          <RouterLink to="/todos-history" class="header_li_router"
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
</script>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--back-color);
  color: var(--text-color);
  height: 64px;
  padding: 0 32px;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 1500;
}

.header_nav {
  display: flex;
  gap: 16px;
}

.header_ul {
  display: flex;
  gap: 12px;
  list-style: none;
  padding: 0;
}

.header_li {
  padding: 0 12px;
}

.header_li_router {
  text-decoration: none;
  color: var(--text-color-secondary);
  font-size: 15px;
  font-weight: 400;

  &:hover {
    color: var(--green-color);
  }
}
</style>
