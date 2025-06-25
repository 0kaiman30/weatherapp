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
      <CompletedTaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete="deleteCompletedTask"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import cls from "./TodoHistory.module.scss";
import type { CompletedTask } from "../../../entities/Todo/model/types";
import { useTodo } from "../../../shared/lib/hooks/useTodo";
import { CompletedTaskItem } from "../../../entities/Todo/ui/CompletedTaskItem";

const { completedTasks, deleteCompletedTask } = useTodo();

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
</script>

<style scoped lang="scss"></style>
