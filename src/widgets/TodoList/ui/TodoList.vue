<template>
  <div :class="cls.todoList">
    <h2>Todo List</h2>
    <div :class="cls['todoList__input']">
      <TaskInput
        v-model="newTask"
        placeholder="Enter a new task"
        @keyup.enter="addTask"
        :class="cls['todoList__task-input']"
      />
      <Button
        variant="add"
        size="small"
        @click="addTask"
        :disabled="!newTask.trim()"
        :class="cls['todoList__add-button']"
      >
        Add
      </Button>
    </div>
    <div :class="cls['todoList__tasks']">
      <div v-if="!tasks.length" :class="cls['no-tasks']">No active tasks</div>
      <div v-for="task in tasks" :key="task.id" :class="cls.task">
        <div v-if="editingTaskId !== task.id" :class="cls['task-content']">
          <span :class="cls['task-text']">{{ task.text }}</span>
          <span :class="cls['task-date']"
            >(Created: {{ formatDate(task.createdAt) }})</span
          >
          <div :class="cls['task-actions']">
            <Button variant="edit" size="small" @click="startEditing(task)">
              Edit
            </Button>
            <Button
              variant="complete"
              size="small"
              @click="completeTask(task.id)"
            >
              Complete
            </Button>
            <Button variant="delete" size="small" @click="deleteTask(task.id)">
              Delete
            </Button>
          </div>
        </div>
        <div v-else :class="cls['task-edit']">
          <TaskInput
            v-model="editingTaskText"
            @keyup.enter="saveTask(task.id)"
            :class="cls['todoList__task-input']"
          />
          <Button variant="save" size="small" @click="saveTask(task.id)">
            Save
          </Button>
          <Button variant="cancel" size="small" @click="cancelEditing">
            Cancel
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
import cls from "./TodoList.module.scss";

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
  return new Date(timestamp * 1000).toLocaleString("en-US", {
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
</style>
