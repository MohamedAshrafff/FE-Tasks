import { Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Todo } from '../interfaces/todo';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://todo-851a8-default-rtdb.firebaseio.com/todos';
  todos = signal<Todo[] | undefined>(undefined);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  completeTask(id: string) {
    return this.httpClient.patch(this.apiUrl + '/' + id + '.json', {
      completed: true,
    });
  }

  fetchTasksByUser() {
    return this.httpClient.get<Todo[]>(this.apiUrl + '.json').pipe(
      map((responseData) => {
        const todosArray: Todo[] = [];
        for (const key in responseData) {
          if (
            responseData.hasOwnProperty(key) &&
            responseData[key].user === this.authService.user.value?.email
          ) {
            todosArray.push({ ...responseData[key], id: key });
          }
        }
        return todosArray;
      }),
      tap({
        next: (todos) => {
          this.todos.set(todos);
        },
      })
    );
  }

  fetchTasks() {
    return this.httpClient.get<Todo[]>(this.apiUrl + '.json').pipe(
      map((responseData) => {
        const todosArray: Todo[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            todosArray.push({ ...responseData[key], id: key });
          }
        }
        return todosArray;
      }),
      tap({
        next: (todos) => {
          this.todos.set(todos);
        },
      })
    );
  }

  addTask(todo: Omit<Todo, 'id'>) {
    return this.httpClient.post(this.apiUrl + '.json', todo);
  }
}
