<template>
  <div class="todoList__history">
    <h3>История завершенных задач</h3>
    <div v-if="!groupedTasks.length" class="no-tasks">
      Нет завершенных задач
    </div>
    <div v-for="[date, tasks] in groupedTasks" :key="date" class="day-group">
      <h4 class="day-group__title">{{ date }}</h4>
      <div v-for="task in tasks" :key="task.id" class="completed-task">
        <div class="completed-task__content">
          <p class="completed-task__text">Задача: {{ task.text }}</p>
          <p class="completed-task__date">Завершена: {{ formatDate(task.completedAt) }}</p>
          <p class="completed-task__weather">
            Погода в {{ task.weather.city }}: {{ task.weather.description }} ({{ task.weather.temp }} °C)
          </p>
        </div>
        <Button
          variant="styled"
          size="small"
          @click="deleteCompletedTask(task.id)"
          class="completed-task__delete"
        >
          Удалить
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Button } from "../../../shared/ui";

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
  return new Date(timestamp * 1000).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDay = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("ru-RU", {
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
<style scoped lang="scss">
.todoList__history {
  background: linear-gradient(
    135deg,
    var(--secondary-color) 60%,
    rgba(var(--green-color), 0.08)
  );
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: var(--text-color-secondary);
  border: 1px solid rgba(var(--green-color), 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-color);
    text-align: center;
    padding: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.day-group {
  padding: 12px 0;

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    text-transform: capitalize;
    padding: 6px 8px;
    background: rgba(var(--green-color), 0.15);
    border-radius: 6px;
    display: inline-block;
  }
}

.completed-task {
  padding: 12px;
  background: var(--primary-color);
  border-radius: 8px;
  border: 1px solid rgba(var(--green-color), 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__text {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-color);
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
      content: "•";
      color: var(--green-color);
      font-size: 8px;
    }
  }

  &__date,
  &__weather {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color-secondary);
    opacity: 0.85;
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
      content: "•";
      color: var(--green-color);
      font-size: 8px;
    }
  }

  &__delete {
    align-self: flex-end;
    padding: 6px 12px;
    font-size: 12px;
    background: var(--red-color);
    color: var(--text-color);
    border-radius: 4px;
    transition: transform 0.3s ease, background 0.3s ease;

    &:hover {
      transform: scale(1.05);
      background: rgba(239, 68, 68, 0.9); /* Slightly darker red using rgba */
    }
  }
}

.no-tasks {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary);
  background: rgba(var(--green-color), 0.1);
  border-radius: 8px;
  border: 1px solid rgba(var(--green-color), 0.2);
}
</style>