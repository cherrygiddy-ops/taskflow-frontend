
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../../core/services/task';
import {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest
} from '../../../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  statusFilter = 'all';

  showForm = false;
  editingTaskId: string | null = null;

  title = '';
  description = '';
  status: TaskStatus = 'pending';

  ngOnInit(): void {
    this.loadTasks();
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => task.status === 'pending').length;
  }

  get inProgressTasks(): number {
    return this.tasks.filter(task => task.status === 'in-progress').length;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.status === 'completed').length;
  }

  get filteredTasks(): Task[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        (task.description ?? '').toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'all' ||
        task.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.taskService.getTasks().subscribe({
      next: response => {
        this.tasks = response.data;
        this.loading = false;
      },
      error: error => {
        console.error('Failed to load tasks:', error);
        this.errorMessage = 'Unable to load tasks. Check that the backend is running.';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.showForm = true;
  }

  openEditForm(task: Task): void {
    this.editingTaskId = task._id;
    this.title = task.title;
    this.description = task.description ?? '';
    this.status = task.status;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  saveTask(): void {
    if (!this.title.trim() || this.title.trim().length < 3) {
      this.errorMessage = 'Task title must contain at least 3 characters.';
      return;
    }

    const taskData: CreateTaskRequest = {
      title: this.title.trim(),
      description: this.description.trim(),
      status: this.status,
      completed: this.status === 'completed'
    };

    this.saving = true;
    this.errorMessage = '';

    if (this.editingTaskId) {
      const updateData: UpdateTaskRequest = taskData;

      this.taskService.updateTask(this.editingTaskId, updateData).subscribe({
        next: response => {
          this.tasks = this.tasks.map(task =>
            task._id === this.editingTaskId ? response.data : task
          );

          this.successMessage = 'Task updated successfully.';
          this.saving = false;
          this.closeForm();
        },
        error: error => {
          console.error('Failed to update task:', error);
          this.errorMessage = 'Unable to update task.';
          this.saving = false;
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: response => {
          this.tasks = [response.data, ...this.tasks];
          this.successMessage = 'Task created successfully.';
          this.saving = false;
          this.closeForm();
        },
        error: error => {
          console.error('Failed to create task:', error);
          this.errorMessage = 'Unable to create task.';
          this.saving = false;
        }
      });
    }
  }

  deleteTask(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this task?');

    if (!confirmed) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== id);
        this.successMessage = 'Task deleted successfully.';
        this.errorMessage = '';
      },
      error: error => {
        console.error('Failed to delete task:', error);
        this.errorMessage = 'Unable to delete task.';
      }
    });
  }

  private resetForm(): void {
    this.editingTaskId = null;
    this.title = '';
    this.description = '';
    this.status = 'pending';
    this.errorMessage = '';
  }
}
