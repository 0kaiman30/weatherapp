import type { CityData } from "../../api/openWeatherApi";
import type { Task, CompletedTask } from "../../../entities/Todo/model/types";

const CITY_STORAGE_KEY = "weatherAppCity";
const TASKS_STORAGE_KEY = "todoListTasks";
const COMPLETED_TASKS_STORAGE_KEY = "todoListCompletedTasks";

function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving data for key "${key}":`, e);
  }
}

function loadData<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      return null;
    }
    return JSON.parse(data) as T;
  } catch (e) {
    console.error(`Error loading data for key "${key}":`, e);
    localStorage.removeItem(key);
    return null;
  }
}

export const saveCity = (city: CityData): void => {
  saveData(CITY_STORAGE_KEY, city);
};

export const loadCity = (): CityData | null => {
  return loadData<CityData>(CITY_STORAGE_KEY);
};

export const saveTasks = (tasks: Task[]): void => {
  saveData(TASKS_STORAGE_KEY, tasks);
};

export const loadTasks = (): Task[] => {
  return loadData<Task[]>(TASKS_STORAGE_KEY) || [];
};

export const saveCompletedTasks = (tasks: CompletedTask[]): void => {
  saveData(COMPLETED_TASKS_STORAGE_KEY, tasks);
};

export const loadCompletedTasks = (): CompletedTask[] => {
  return loadData<CompletedTask[]>(COMPLETED_TASKS_STORAGE_KEY) || [];
};
