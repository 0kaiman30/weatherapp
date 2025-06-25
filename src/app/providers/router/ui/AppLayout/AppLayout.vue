<template>
  <Header></Header>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { Header } from '../../../../../widgets/Header';
</script>