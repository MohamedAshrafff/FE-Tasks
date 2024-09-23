import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthResponseData, AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user successful', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'testPassword';

    const mockResponse: AuthResponseData = {
      kind: 'identitytoolkit#VerifyPasswordResponse',
      idToken: 'mockIdToken',
      email: mockEmail,
      refreshToken: 'mockRefreshToken',
      expiresIn: '3600',
      localId: 'mockLocalId',
      registered: true,
    };

    service.logIn(mockEmail, mockPassword).subscribe((res) => {
      expect(res.email).toBe(mockEmail);
      expect(res.localId).toBe(mockResponse.localId);
      expect(res.idToken).toBe(mockResponse.idToken);
    });

    const mockReq = httpController.expectOne(service.loginApiUrl);
    expect(mockReq.request.method).toBe('POST');

    mockReq.flush(mockResponse);
  });

  it('should handle login error', () => {
    const mockEmail = 'test@email.com';
    const mockPassword = 'test';

    service.logIn(mockEmail, mockPassword).subscribe(
      () => fail('Expected an error, not user data'),
      (error) => {
        expect(error).toBe('An unknown error occurred!');
      }
    );

    const mockReq = httpController.expectOne(service.loginApiUrl);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush(
      { error: { error: { message: 'INVALID_LOGIN_CREDENTIALS' } } },
      { status: 401, statusText: 'Unauthorized' }
    );
  });
});
