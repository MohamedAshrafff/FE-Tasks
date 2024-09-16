import { Component } from '@angular/core';
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
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  enteredText = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getAllTodos().subscribe((todos) => {
      this.todos = todos;
      this.filterTasks();
    });
  }

  completeTask(id: string) {
    this.todoService.completeTask(id);
  }

  filterTasks(): void {
    const searchTermLower = this.enteredText.toLowerCase();

    const filtered = this.todos.filter((task) =>
      task.name.toLowerCase().includes(searchTermLower)
    );

    this.filteredTodos = filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return parseInt(b.priority) - parseInt(a.priority);
    });
  }
}
