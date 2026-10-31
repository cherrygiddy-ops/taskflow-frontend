import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/task-list/task-list')
        .then(m => m.TaskList)
  },
  {
    path: '**',
    redirectTo: ''
  }
];