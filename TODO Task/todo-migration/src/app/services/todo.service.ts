import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosCollection = this.firestore.collection('todos');
  public todos$: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.todos$ = this.todosCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          return {
            id: a.payload.doc.id,
            ...(a.payload.doc.data() as Omit<Todo, 'id'>),
          } as Todo;
        })
      )
    );
  }

  getAllTodos(): Observable<any[]> {
    return this.todos$;
  }

  completeTask(id: string): void {
    try {
      this.todosCollection.doc(id).update({ completed: true });
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  addTask(todo: Omit<Todo, 'id'>): void {
    try {
      this.todosCollection.add(todo);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
}
