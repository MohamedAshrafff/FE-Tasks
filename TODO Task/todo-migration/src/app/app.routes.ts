import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { TasksListComponent } from './components/tasks/tasks-list/tasks-list.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '',
    component: TasksListComponent,
  },
];
