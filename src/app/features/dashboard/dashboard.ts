import { Component } from '@angular/core';
import { TaskList } from '../tasks/task-list/task-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {}