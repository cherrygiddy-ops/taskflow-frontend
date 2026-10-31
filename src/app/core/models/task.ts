export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
}

export interface TaskApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}
