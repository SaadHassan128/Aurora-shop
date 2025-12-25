import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, retry, shareReplay, throwError } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FakeStoreService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com';

  // Cache for categories
  private categoriesCache$: Observable<string[]> | null = null;

  constructor() {}

  /**
   * Get all products with optional sorting and limit
   */
  getProducts(sort: 'asc' | 'desc' = 'asc', limit?: number): Observable<Product[]> {
    let params = new HttpParams().set('sort', sort);
    if (limit) {
      params = params.set('limit', limit);
    }

    return this.http
      .get<Product[]>(`${this.apiUrl}/products`, { params })
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Get all categories (cached)
   */
  getCategories(): Observable<string[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.http
        .get<string[]>(`${this.apiUrl}/products/categories`)
        .pipe(shareReplay(1), retry(2), catchError(this.handleError));
    }
    return this.categoriesCache$;
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string, sort: 'asc' | 'desc' = 'asc'): Observable<Product[]> {
    const params = new HttpParams().set('sort', sort);
    return this.http
      .get<Product[]>(`${this.apiUrl}/products/category/${category}`, { params })
      .pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.status === 0) {
      // A client-side or network error occurred.
      errorMessage = `Error: ${error.error?.message || 'Network error'}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
