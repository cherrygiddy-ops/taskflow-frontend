import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskApiResponse
} from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5000/api/tasks';

  // GET all tasks
  getTasks(): Observable<TaskApiResponse<Task[]>> {
    return this.http.get<TaskApiResponse<Task[]>>(this.apiUrl);
  }

  // GET task by ID
  getTaskById(id: string): Observable<TaskApiResponse<Task>> {
    return this.http.get<TaskApiResponse<Task>>(`${this.apiUrl}/${id}`);
  }

  // CREATE task
  createTask(task: CreateTaskRequest): Observable<TaskApiResponse<Task>> {
    return this.http.post<TaskApiResponse<Task>>(this.apiUrl, task);
  }

  // UPDATE task
  updateTask(
    id: string,
    task: UpdateTaskRequest
  ): Observable<TaskApiResponse<Task>> {
    return this.http.put<TaskApiResponse<Task>>(`${this.apiUrl}/${id}`, task);
  }

  // DELETE task
  deleteTask(id: string): Observable<TaskApiResponse<never>> {
    return this.http.delete<TaskApiResponse<never>>(`${this.apiUrl}/${id}`);
  }
}