import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../interfaces/todo';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  enteredName = '';
  enteredDescription = '';
  enteredPriority = '';

  constructor(
    private todoService: TodoService,
    private router: Router,
    private authService: AuthService
  ) {}

  addTask() {
    if (
      this.enteredName === '' ||
      this.enteredDescription === '' ||
      this.enteredPriority === ''
    ) {
      alert('Please fill out all fields');
      return;
    }

    const newTodo = {
      name: this.enteredName,
      description: this.enteredDescription,
      priority: this.enteredPriority,
      completed: false,
      user: this.authService.user.value?.email || '',
    };

    this.todoService.addTask(newTodo).subscribe({
      next: (id) => {
        const addedTodo = { ...newTodo, id };
        const prevTasks = this.todoService.todos() || [];
        this.todoService.todos.set([...prevTasks, addedTodo] as Todo[]);
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
      },
    });
  }
}
