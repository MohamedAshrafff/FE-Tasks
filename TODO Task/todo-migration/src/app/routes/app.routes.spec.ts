import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
import { AuthComponent } from '../components/auth/auth.component';
import { TasksListComponent } from '../components/tasks/tasks-list/tasks-list.component';
import { AddTaskComponent } from '../components/tasks/add-task/add-task.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { AuthService } from '../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/app.routes';
import { User } from '../interfaces/user.model';

class MockAuthService {
  user = new BehaviorSubject<User | null>(null);

  autoLogin() {
    this.user.next(
      new User(
        'test@gmail.com',
        'test-id',
        'test-token',
        new Date(new Date().getTime() + 3600000)
      )
    ); // 1 hour expiration
  }

  logOut() {
    this.user.next(null);
  }
}

describe('AppComponent', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let location: Location;
  let authService: MockAuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AppComponent,
        AuthComponent,
        TasksListComponent,
        AddTaskComponent,
        NotFoundComponent,
      ],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it('should navigate to auth route when user is not logged in auth guard handled', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      router.navigate(['/auth']).then(() => {
        expect(location.path()).toBe('/auth');
      });
    });
  }));

  it('should navigate to todos route when user is logged in (authenticated)', waitForAsync(() => {
    authService.autoLogin();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      router.navigate(['/todos']).then(() => {
        expect(location.path()).toBe('/todos');
      });
    });
  }));

  it('should navigate to add-task route when user is logged in and pressed on hyperLink', waitForAsync(() => {
    authService.autoLogin();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      router.navigate(['/add-task']).then(() => {
        expect(location.path()).toBe('/add-task'); // Check navigation to /add-task
      });
    });
  }));

  it('should navigate to NotFoundComponent for unknown routes', waitForAsync(() => {
    router.navigate(['/unknown-route']).then(() => {
      expect(location.path()).toBe('/unknown-route');
    });
  }));
});
