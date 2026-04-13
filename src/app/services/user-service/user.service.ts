import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBase = 'http://localhost:4000/api/users';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private currentUser = new User();
  constructor(private http: HttpClient) { }
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

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User {
    return this.currentUser;
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
    return throwError(errorMessage);
  }
}
