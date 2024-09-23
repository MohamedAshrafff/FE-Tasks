import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../auth/auth.service';
import { User } from '../../interfaces/user.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpController: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(TodoService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks by user successful', () => {
    const mockEmail = 'test-user@example.com';

    const responseData = {
      '1': {
        name: 'Test',
        description: 'Test',
        user: mockEmail,
        priority: '2',
        completed: false,
      },
    };

    const mockUser = new User(mockEmail, '1', 'token', new Date());

    authService.user.next(mockUser);

    service.fetchTasksByUser().subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0]).toEqual({ id: '1', ...responseData['1'] });
    });

    const mockReq = httpController.expectOne(
      'https://todo-851a8-default-rtdb.firebaseio.com/todos.json'
    );

    mockReq.flush(responseData);
  });

  it('should fetch task not successful', () => {
    const error = new ErrorEvent('error fetching tasks');

    service.fetchTasksByUser().subscribe(
      () => {},
      (err) => {
        expect(err).toEqual(error);
      }
    );

    const mockReq = httpController.expectOne(
      'https://todo-851a8-default-rtdb.firebaseio.com/todos.json'
    );

    mockReq.flush(error);
  });
});
