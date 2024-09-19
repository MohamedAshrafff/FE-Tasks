import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (mod) => mod.AuthComponent
      ),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./components/tasks/tasks-list/tasks-list.component').then(
        (mod) => mod.TasksListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'add-task',
    loadComponent: () =>
      import('./components/tasks/add-task/add-task.component').then(
        (mod) => mod.AddTaskComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
