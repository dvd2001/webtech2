import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly storageKey = 'currentUser';
  private apiBase = this.resolveApiBase();
  private urlBase = `${this.apiBase}/users`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private currentUser: User | null = null;
  constructor(private http: HttpClient) {
    this.currentUser = this.readStoredUser();
  }
  createUser(data: any): Observable<any> {
    return this.http.post(this.urlBase, data).pipe(catchError(this.errorMgmt));
  }

  getUsers(): Observable<any> {
    return this.http.get(this.urlBase);
  }

  getUser(id: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  updateUser(id: any, data: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(catchError(this.errorMgmt));
  }

  deleteUser(id: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(catchError(this.errorMgmt));
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
    if (typeof window === 'undefined') {
      return;
    }

    if (user) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private resolveApiBase(): string {
    if (typeof window === 'undefined') {
      return 'http://localhost:4000/api';
    }

    return window.location.port === '4000'
      ? '/api'
      : `${window.location.protocol}//${window.location.hostname}:4000/api`;
  }

  private readStoredUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem(this.storageKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      window.localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
