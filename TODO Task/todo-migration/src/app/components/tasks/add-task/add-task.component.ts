import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../interfaces/todo';

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

  constructor(private todoService: TodoService) {}

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
    };

    this.todoService.addTask(newTodo).subscribe({
      next: (id) => {
        const addedTodo = { ...newTodo, id };
        const prevTasks = this.todoService.todos() || [];
        this.todoService.todos.set([...prevTasks, addedTodo] as Todo[]);
      },
      error: (error) => {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
      },
    });
  }
}
