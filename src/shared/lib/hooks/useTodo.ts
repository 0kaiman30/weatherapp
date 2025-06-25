import { ref, onMounted, readonly } from "vue";
import type { Task, CompletedTask } from "../../../entities/Todo/model/types";
import type { WeatherData } from "../../api/openWeatherApi";
import {
  loadTasks,
  saveTasks,
  loadCompletedTasks,
  saveCompletedTasks,
} from "../browser/storage";

export function useTodo() {
  const tasks = ref<Task[]>([]);
  const completedTasks = ref<CompletedTask[]>([]);

  const editingTaskId = ref<string | null>(null);
  const editingTaskText = ref("");

  onMounted(() => {
    tasks.value = loadTasks();
    completedTasks.value = loadCompletedTasks();
  });

  const addTask = (text: string) => {
    if (!text.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: text,
      createdAt: Math.floor(Date.now() / 1000),
    };
    tasks.value.push(task);
    saveTasks(tasks.value);
  };

  const startEditing = (task: Task) => {
    editingTaskId.value = task.id;
    editingTaskText.value = task.text;
  };

  const cancelEditing = () => {
    editingTaskId.value = null;
    editingTaskText.value = "";
  };

  const saveTask = (taskId: string) => {
    const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1 && editingTaskText.value.trim()) {
      tasks.value[taskIndex].text = editingTaskText.value;
      saveTasks(tasks.value);
    }
    cancelEditing();
  };

  const completeTask = (
    taskId: string,
    weather: WeatherData | null,
    city: string
  ) => {
    const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks.value[taskIndex];
    if (weather && city) {
      const completedTask: CompletedTask = {
        ...task,
        completedAt: Math.floor(Date.now() / 1000),
        weather: {
          city: city,
          description: weather.weather[0].description,
          temp: weather.main.temp,
        },
      };
      completedTasks.value.push(completedTask);
      saveCompletedTasks(completedTasks.value);
    }
    tasks.value.splice(taskIndex, 1);
    saveTasks(tasks.value);
  };

  const deleteTask = (taskId: string) => {
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
    saveTasks(tasks.value);
  };

  const deleteCompletedTask = (taskId: string) => {
    completedTasks.value = completedTasks.value.filter((t) => t.id !== taskId);
    saveCompletedTasks(completedTasks.value);
  };

  return {
    tasks: readonly(tasks),
    completedTasks: readonly(completedTasks),
    editingTaskId: readonly(editingTaskId),
    editingTaskText, // This needs to be mutable for v-model
    addTask,
    startEditing,
    cancelEditing,
    saveTask,
    completeTask,
    deleteTask,
    deleteCompletedTask,
  };
}
