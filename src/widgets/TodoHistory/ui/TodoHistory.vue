<template>
  <div class="todoList__history">
    <h3>История завершенных задач</h3>
    <div v-if="!groupedTasks.length" class="no-tasks">
      Нет завершенных задач
    </div>
    <div v-for="[date, tasks] in groupedTasks" :key="date" class="day-group">
      <h4>{{ date }}</h4>
      <div v-for="task in tasks" :key="task.id" class="completed-task">
        <p>Задача: {{ task.text }}</p>
        <p>Завершена: {{ formatDate(task.completedAt) }}</p>
        <p>
          Погода в {{ task.weather.city }}: {{ task.weather.description }} ({{ task.weather.temp }} °C)
        </p>
        <Button variant="styled" size="small" @click="deleteCompletedTask(task.id)">
          Удалить
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Button } from '../../../shared/ui';

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

// Загрузка завершенных задач из localStorage
onMounted(() => {
  const savedCompletedTasks = localStorage.getItem(STORAGE_COMPLETED_KEY);
  if (savedCompletedTasks) {
    completedTasks.value = JSON.parse(savedCompletedTasks);
  }
});

// Форматирование даты для отображения
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Форматирование даты только для дня (для группировки)
const formatDay = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Группировка задач по дням
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
    const dateA = new Date(completedTasks.value.find(t => formatDay(t.completedAt) === a[0])!.completedAt * 1000);
    const dateB = new Date(completedTasks.value.find(t => formatDay(t.completedAt) === b[0])!.completedAt * 1000);
    return dateB.getTime() - dateA.getTime();
  });
});

// Удаление завершенной задачи
const deleteCompletedTask = (taskId: string) => {
  completedTasks.value = completedTasks.value.filter((t) => t.id !== taskId);
  localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(completedTasks.value));
};
</script>

<style scoped>
.todoList__history {
  margin-top: 20px;
}

.day-group {
  margin-bottom: 20px;
}

.day-group h4 {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: #333;
}

.completed-task {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.completed-task button {
  align-self: flex-end;
}

.no-tasks {
  padding: 10px;
  text-align: center;
  color: #666;
}
</style>