<template>
  <div class="todoList">
    <h2>Список задач</h2>
    <div class="todoList__input">
      <Input
        v-model="newTask"
        placeholder="Введите новую задачу"
        @keyup.enter="addTask"
      />
      <Button
        variant="styled"
        size="small"
        @click="addTask"
        :disabled="!newTask.trim()"
      >
        Добавить
      </Button>
    </div>
    <div class="todoList__tasks">
      <div v-if="!tasks.length" class="no-tasks">Нет активных задач</div>
      <div v-for="task in tasks" :key="task.id" class="task">
        <div v-if="editingTaskId !== task.id" class="task-content">
          <span>{{ task.text }} (Создано: {{ formatDate(task.createdAt) }})</span>
          <div class="task-actions">
            <Button variant="styled" size="small" @click="startEditing(task)">
              Редактировать
            </Button>
            <Button variant="styled" size="small" @click="completeTask(task.id)">
              Завершить
            </Button>
            <Button variant="styled" size="small" @click="deleteTask(task.id)">
              Удалить
            </Button>
          </div>
        </div>
        <div v-else class="task-edit">
          <Input v-model="editingTaskText" @keyup.enter="saveTask(task.id)" />
          <Button variant="styled" size="small" @click="saveTask(task.id)">
            Сохранить
          </Button>
          <Button variant="styled" size="small" @click="cancelEditing">
            Отмена
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button, Input } from "../../../shared/ui";
import type { WeatherData } from "../../../shared/api/openWeatherApi";

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

const props = defineProps<{
  weather: WeatherData | null;
  city: string;
}>();

const newTask = ref("");
const tasks = ref<Task[]>([]);
const completedTasks = ref<CompletedTask[]>([]);
const editingTaskId = ref<string | null>(null);
const editingTaskText = ref("");
const STORAGE_KEY = "todoListTasks";
const STORAGE_COMPLETED_KEY = "todoListCompletedTasks";

// Форматирование даты
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Загрузка задач из localStorage
onMounted(() => {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  const savedCompletedTasks = localStorage.getItem(STORAGE_COMPLETED_KEY);
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
  if (savedCompletedTasks) {
    completedTasks.value = JSON.parse(savedCompletedTasks);
  }
});

// Добавление новой задачи
const addTask = () => {
  if (!newTask.value.trim()) return;
  const task: Task = {
    id: crypto.randomUUID(),
    text: newTask.value,
    createdAt: Math.floor(Date.now() / 1000),
  };
  tasks.value.push(task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
  newTask.value = "";
};

// Начало редактирования задачи
const startEditing = (task: Task) => {
  editingTaskId.value = task.id;
  editingTaskText.value = task.text;
};

// Сохранение отредактированной задачи
const saveTask = (taskId: string) => {
  const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1 && editingTaskText.value.trim()) {
    tasks.value[taskIndex].text = editingTaskText.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
  }
  editingTaskId.value = null;
  editingTaskText.value = "";
};

// Отмена редактирования
const cancelEditing = () => {
  editingTaskId.value = null;
  editingTaskText.value = "";
};

// Завершение задачи
const completeTask = (taskId: string) => {
  const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  const task = tasks.value[taskIndex];
  if (props.weather && props.city) {
    const completedTask: CompletedTask = {
      ...task,
      completedAt: Math.floor(Date.now() / 1000),
      weather: {
        city: props.city,
        description: props.weather.weather[0].description,
        temp: props.weather.main.temp,
      },
    };
    completedTasks.value.push(completedTask);
    localStorage.setItem(
      STORAGE_COMPLETED_KEY,
      JSON.stringify(completedTasks.value)
    );
  }
  tasks.value.splice(taskIndex, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
};

// Удаление активной задачи
const deleteTask = (taskId: string) => {
  tasks.value = tasks.value.filter((t) => t.id !== taskId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
};
</script>

<style scoped>
.todoList {
  background: var(--card-bg, #f5f5f5);
  padding: 16px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todoList__input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todoList__tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-actions {
  display: flex;
  gap: 5px;
}

.task-edit {
  display: flex;
  gap: 10px;
  align-items: center;
}

.no-tasks {
  padding: 10px;
  text-align: center;
  color: #666;
}
</style>