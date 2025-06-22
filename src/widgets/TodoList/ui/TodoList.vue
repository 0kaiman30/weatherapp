<template>
  <div class="todoList">
    <h2>Список задач</h2>
    <div class="todoList__input">
      <TaskInput
        v-model="newTask"
        placeholder="Введите новую задачу"
        @keyup.enter="addTask"
        class="todoList__task-input"
      />
      <Button
        variant="styled"
        size="small"
        @click="addTask"
        :disabled="!newTask.trim()"
        class="todoList__add-button"
      >
        Добавить
      </Button>
    </div>
    <div class="todoList__tasks">
      <div v-if="!tasks.length" class="no-tasks">Нет активных задач</div>
      <div v-for="task in tasks" :key="task.id" class="task">
        <div v-if="editingTaskId !== task.id" class="task-content">
          <span class="task-text">{{ task.text }}</span>
          <span class="task-date"
            >(Создано: {{ formatDate(task.createdAt) }})</span
          >
          <div class="task-actions">
            <Button variant="styled" size="small" @click="startEditing(task)">
              Редактировать
            </Button>
            <Button
              variant="styled"
              size="small"
              @click="completeTask(task.id)"
            >
              Завершить
            </Button>
            <Button variant="styled" size="small" @click="deleteTask(task.id)">
              Удалить
            </Button>
          </div>
        </div>
        <div v-else class="task-edit">
          <TaskInput
            v-model="editingTaskText"
            @keyup.enter="saveTask(task.id)"
            class="todoList__task-input"
          />
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
import { Button, TaskInput } from "../../../shared/ui";
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

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const startEditing = (task: Task) => {
  editingTaskId.value = task.id;
  editingTaskText.value = task.text;
};

const saveTask = (taskId: string) => {
  const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1 && editingTaskText.value.trim()) {
    tasks.value[taskIndex].text = editingTaskText.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
  }
  editingTaskId.value = null;
  editingTaskText.value = "";
};

const cancelEditing = () => {
  editingTaskId.value = null;
  editingTaskText.value = "";
};

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

const deleteTask = (taskId: string) => {
  tasks.value = tasks.value.filter((t) => t.id !== taskId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
};
</script>
<style scoped lang="scss">
.todoList {
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

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-color);
    text-align: center;
    padding: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__input {
    display: flex;
    gap: 8px;
    padding: 8px 0;
    align-items: center;

    .todoList__task-input {
      flex-grow: 1;
      padding: 8px 12px;
      border: 1px solid rgba(var(--green-color), 0.3);
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: var(--green-color);
        outline: none;
      }
    }

    .todoList__add-button {
      background: var(--green-color);
      color: var(--text-color);
      padding: 8px 12px;
      border-radius: 6px;
      transition: transform 0.3s ease, background 0.3s ease;

      &:hover:not(:disabled) {
        transform: scale(1.05);
        background: rgba(
          24,
          237,
          116,
          0.9
        ); /* Slightly darker green using rgba */
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 0;
  }

  .task {
    padding: 12px;
    background: var(--primary-color);
    border-radius: 8px;
    border: 1px solid rgba(var(--green-color), 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .task-content {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    align-items: center;
    gap: 8px;

    .task-text {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-color);
      text-transform: capitalize;
    }

    .task-date {
      font-size: 12px;
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
  }

  .task-actions {
    display: flex;
    gap: 6px;

    button {
      padding: 6px 10px;
      font-size: 12px;
      border-radius: 4px;
      transition: transform 0.3s ease, background 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      &:first-child {
        background: var(--blue-color);
        color: var(--text-color);
      }

      &:nth-child(2) {
        background: var(--green-color);
        color: var(--text-color);
      }

      &:last-child {
        background: var(--red-color);
        color: var(--text-color);
      }
    }
  }

  .task-edit {
    display: flex;
    gap: 8px;
    align-items: center;

    .todoList__task-input {
      flex-grow: 1;
      padding: 8px 12px;
      border: 1px solid rgba(var(--green-color), 0.3);
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: var(--green-color);
        outline: none;
      }
    }

    button {
      padding: 6px 10px;
      font-size: 12px;
      border-radius: 4px;
      transition: transform 0.3s ease, background 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      &:first-child {
        background: var(--green-color);
        color: var(--text-color);
      }

      &:last-child {
        background: var(--red-color);
        color: var(--text-color);
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
}
</style>
