import { Component, signal } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../interfaces/todo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  filteredTodos: Todo[] = [];
  enteredText = '';
  todos = this.todoService.todos;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.fetchTasks().subscribe();
  }

  completeTask(id: string) {
    this.todoService.completeTask(id).subscribe({
      next: () => {
        const updatedTodos = this.todos()?.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: true };
          }
          return todo;
        });

        this.todos.set(updatedTodos);
      },
    });
  }

  filterTasks(): void {
    const searchTermLower = this.enteredText.toLowerCase();

    const currentTodos = this.todos() || [];
    const filtered = currentTodos.filter((task) =>
      task.name.toLowerCase().includes(searchTermLower)
    );

    this.filteredTodos = filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return parseInt(b.priority) - parseInt(a.priority);
    });
    console.log(this.filteredTodos);
    // this.todos.set(this.filteredTodos);
  }
}
