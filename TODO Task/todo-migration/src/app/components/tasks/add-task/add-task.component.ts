import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';

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

    this.todoService.addTask({
      name: this.enteredName,
      description: this.enteredDescription,
      priority: this.enteredPriority,
      completed: false,
    });
  }
}
