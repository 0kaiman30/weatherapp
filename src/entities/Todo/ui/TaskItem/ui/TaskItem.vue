<template>
  <div :class="cls.task">
    <div v-if="!isEditing" :class="cls['task-content']">
      <span :class="cls['task-text']">{{ task.text }}</span>
      <span :class="cls['task-date']">
        (Created: {{ formatDate(task.createdAt) }})
      </span>
      <div :class="cls['task-actions']">
        <Button
          variant="edit"
          size="small"
          @click="emit('start-editing', task)"
        >
          Edit
        </Button>
        <Button
          variant="complete"
          size="small"
          @click="emit('complete', task.id)"
        >
          Complete
        </Button>
        <Button variant="delete" size="small" @click="emit('delete', task.id)">
          Delete
        </Button>
      </div>
    </div>
    <div v-else :class="cls['task-edit']">
      <TaskInput
        :model-value="editingText"
        @update:model-value="emit('update:editing-text', $event)"
        @keyup.enter="emit('save', task.id)"
        :class="cls['todoList__task-input']"
      />
      <Button variant="save" size="small" @click="emit('save', task.id)">
        Save
      </Button>
      <Button variant="cancel" size="small" @click="emit('cancel-editing')">
        Cancel
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "../../../../../shared/ui/Button";
import { TaskInput } from "../../../../../shared/ui/TaskInput";
import type { Task } from "../../../model/types";
import cls from "./TaskItem.module.scss";
import { formatDate } from "../../../../../shared/lib/date/format";

defineProps<{
  task: Task;
  isEditing: boolean;
  editingText: string;
}>();

const emit = defineEmits<{
  (e: "start-editing", task: Task): void;
  (e: "cancel-editing"): void;
  (e: "save", taskId: string): void;
  (e: "complete", taskId: string): void;
  (e: "delete", taskId: string): void;
  (e: "update:editing-text", value: string): void;
}>();
</script>

<style scoped lang="scss"></style>
