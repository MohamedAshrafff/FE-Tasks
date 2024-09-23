import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mult-step-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatFormField,
    MatLabel,
    MatStepperModule,
    CommonModule,
  ],
  templateUrl: './mult-step-form.component.html',
  styleUrl: './mult-step-form.component.css',
})
export class MultStepFormComponent {
  tasks: any[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.firstFormGroup = this.formBuilder.group({
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
      taskPriority: [
        '',
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });

    this.secondFormGroup = this.formBuilder.group({
      emails: this.formBuilder.array([this.createEmailGroup()]),
    });
  }

  createEmailGroup(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emails(): FormArray {
    return this.secondFormGroup.get('emails') as FormArray;
  }

  addEmail(): void {
    this.emails.push(this.createEmailGroup());
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  onSubmit(): void {
    this.tasks.push({
      ...this.firstFormGroup.value,
      emails: this.secondFormGroup.value.emails.map(
        (emailGroup: { email: string }) => emailGroup.email
      ),
    });
    console.log('Tasks:', this.tasks);
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      console.log('First Step:', this.firstFormGroup.value);
      console.log('Second Step:', this.secondFormGroup.value);
    }
  }
}
