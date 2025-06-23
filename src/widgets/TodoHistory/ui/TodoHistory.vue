<template>
  <div :class="cls.todoList__history">
    <h3>History of completed tasks</h3>
    <div v-if="!groupedTasks.length" :class="cls['no-tasks']">
      No completed tasks
    </div>
    <div
      v-for="[date, tasks] in groupedTasks"
      :key="date"
      :class="cls['day-group']"
    >
      <h4 :class="cls['day-group__title']">{{ date }}</h4>
      <div v-for="task in tasks" :key="task.id" :class="cls['completed-task']">
        <div :class="cls['completed-task__content']">
          <p :class="cls['completed-task__text']">Task: {{ task.text }}</p>
          <p :class="cls['completed-task__date']">
            Completed: {{ formatDate(task.completedAt) }}
          </p>
          <p :class="cls['completed-task__weather']">
            Weather in {{ task.weather.city }}:
            {{ task.weather.description }} ({{ task.weather.temp }} °C)
          </p>
        </div>
        <Button
          variant="styled"
          size="small"
          @click="deleteCompletedTask(task.id)"
          :class="cls['completed-task__delete']"
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Button } from "../../../shared/ui";
import cls from "./TodoHistory.module.scss";

interface Task {
  id: string;
  text: string;
  createdAt: number;
}

interface CompletedTask extends Task {
  completedAt: number;
  weather: {
    city: string;
    description: string;
    temp: number;
  };
}

const completedTasks = ref<CompletedTask[]>([]);
const STORAGE_COMPLETED_KEY = "todoListCompletedTasks";

onMounted(() => {
  const savedCompletedTasks = localStorage.getItem(STORAGE_COMPLETED_KEY);
  if (savedCompletedTasks) {
    completedTasks.value = JSON.parse(savedCompletedTasks);
  }
});

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDay = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const groupedTasks = computed(() => {
  const groups = new Map<string, CompletedTask[]>();
  completedTasks.value.forEach((task) => {
    const day = formatDay(task.completedAt);
    if (!groups.has(day)) {
      groups.set(day, []);
    }
    groups.get(day)!.push(task);
  });
  return Array.from(groups.entries()).sort((a, b) => {
    const dateA = new Date(
      completedTasks.value.find((t) => formatDay(t.completedAt) === a[0])!
        .completedAt * 1000
    );
    const dateB = new Date(
      completedTasks.value.find((t) => formatDay(t.completedAt) === b[0])!
        .completedAt * 1000
    );
    return dateB.getTime() - dateA.getTime();
  });
});

const deleteCompletedTask = (taskId: string) => {
  completedTasks.value = completedTasks.value.filter((t) => t.id !== taskId);
  localStorage.setItem(
    STORAGE_COMPLETED_KEY,
    JSON.stringify(completedTasks.value)
  );
};
</script>

<style scoped lang="scss"></style>
