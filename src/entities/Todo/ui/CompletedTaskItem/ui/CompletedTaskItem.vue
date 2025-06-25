<template>
  <div :class="cls.completedTask">
    <div :class="cls['completedTask__content']">
      <p :class="cls['completedTask__text']">Task: {{ task.text }}</p>
      <p :class="cls['completedTask__date']">
        Completed: {{ formatDate(task.completedAt) }}
      </p>
      <p :class="cls['completedTask__weather']">
        Weather in {{ task.weather.city }}: {{ task.weather.description }} ({{
          task.weather.temp
        }}
        °C)
      </p>
    </div>
    <Button
      variant="delete"
      size="small"
      @click="emit('delete', task.id)"
      :class="cls['completedTask__delete']"
    >
      Delete
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "../../../../../shared/ui/Button";
import type { CompletedTask } from "../../../model/types";
import { formatDate } from "../../../../../shared/lib/date/format";
import cls from "./CompletedTaskItem.module.scss";

defineProps<{ task: CompletedTask }>();
const emit = defineEmits<{ (e: "delete", taskId: string): void }>();
</script>

<style module lang="scss"></style>
