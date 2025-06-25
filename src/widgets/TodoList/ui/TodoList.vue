<template>
  <div :class="cls.todoList">
    <h2>Todo List</h2>
    <div :class="cls['todoList__input']">
      <TaskInput
        v-model="newTask"
        placeholder="Enter a new task"
        @keyup.enter="handleAddTask"
        :class="cls['todoList__task-input']"
      />
      <Button
        variant="add"
        size="small"
        @click="handleAddTask"
        :disabled="!newTask.trim()"
        :class="cls['todoList__add-button']"
      >
        Add
      </Button>
    </div>
    <div :class="cls['todoList__tasks']">
      <div v-if="!tasks.length" :class="cls['no-tasks']">No active tasks</div>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-editing="editingTaskId === task.id"
        :editing-text="editingTaskText"
        @start-editing="startEditing"
        @cancel-editing="cancelEditing"
        @save="saveTask"
        @complete="(taskId) => completeTask(taskId, weather, city)"
        @delete="deleteTask"
        @update:editing-text="(newText) => (editingTaskText = newText)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { WeatherData } from "../../../shared/api/openWeatherApi";
import cls from "./TodoList.module.scss";
import { TaskInput } from "../../../shared/ui/TaskInput";
import { Button } from "../../../shared/ui/Button";
import { useTodo } from "../../../shared/lib/hooks/useTodo";
import { TaskItem } from "../../../entities/Todo/ui/TaskItem";

defineProps<{
  weather: WeatherData | null;
  city: string;
}>();

const {
  tasks,
  editingTaskId,
  editingTaskText,
  addTask,
  startEditing,
  cancelEditing,
  saveTask,
  completeTask,
  deleteTask,
} = useTodo();

const newTask = ref("");

const handleAddTask = () => {
  addTask(newTask.value);
  newTask.value = "";
};
</script>

<style scoped lang="scss"></style>
