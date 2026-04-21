import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiBase = this.resolveApiBase();
  private urlBase = `${this.apiBase}/products`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  createProduct(data: any): Observable<any> {
    return this.http.post(this.urlBase, data).pipe(catchError(this.errorMgmt));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<any>(this.urlBase).pipe(
      map((res: any) => {
        if (Array.isArray(res)) {
          return res;
        }

        if (Array.isArray(res?.value)) {
          return res.value;
        }

        const nestedArray = Object.values(res ?? {}).find(Array.isArray);
        return Array.isArray(nestedArray) ? (nestedArray as Product[]) : [];
      }),
      catchError(this.errorMgmt)
    );
  }

  getProduct(id: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  updateProduct(id: any, data: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(catchError(this.errorMgmt));
  }

  deleteProduct(id: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(catchError(this.errorMgmt));
  }

  private resolveApiBase(): string {
    if (typeof window === 'undefined') {
      return 'http://localhost:4000/api';
    }

    return window.location.port === '4000'
      ? '/api'
      : `${window.location.protocol}//${window.location.hostname}:4000/api`;
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
