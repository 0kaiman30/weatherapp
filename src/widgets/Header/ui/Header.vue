<template>
  <header>
    WEATHER APP
    <nav class="header_nav">
      <ul class="header_ul">
        <li class="header_li">
          <RouterLink to="/" class="header_li_router">Weather</RouterLink>
        </li>
        <li class="header_li">
          <RouterLink to="/todos" class="header_li_router">ToDo's</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
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
}

.header_ul {
  display: flex;
}

.header_li {
  font-size: 15px;
  list-style: none;
  padding: 0 15px;
  font-weight: 300;
}

.header_li_router {
  text-decoration: none;
  color: white;
}
</style>
