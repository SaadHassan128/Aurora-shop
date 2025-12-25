import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: number;
  userName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // Mock Data
  private mockOrders: Order[] = [
    {
      id: 'ORD-001',
      userId: 1,
      userName: 'John Doe',
      date: '2024-03-01',
      total: 125.5,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'ORD-002',
      userId: 2,
      userName: 'Jane Smith',
      date: '2024-03-02',
      total: 450.0,
      status: 'processing',
      items: 1,
    },
    {
      id: 'ORD-003',
      userId: 3,
      userName: 'Alice Johnson',
      date: '2024-03-03',
      total: 89.99,
      status: 'pending',
      items: 2,
    },
    {
      id: 'ORD-004',
      userId: 4,
      userName: 'Bob Brown',
      date: '2024-03-04',
      total: 210.0,
      status: 'shipped',
      items: 4,
    },
    {
      id: 'ORD-005',
      userId: 1,
      userName: 'John Doe',
      date: '2024-03-05',
      total: 55.0,
      status: 'delivered',
      items: 1,
    },
  ];

  private mockUsers: User[] = [
    {
      id: 1,
      email: 'john@example.com',
      username: 'johndoe',
      name: { firstname: 'John', lastname: 'Doe' },
      address: {
        city: 'New York',
        street: '5th Ave',
        number: 1,
        zipcode: '10001',
        geolocation: { lat: '0', long: '0' },
      },
      phone: '123-456-7890',
      role: 'user',
    },
    {
      id: 2,
      email: 'jane@example.com',
      username: 'janesmith',
      name: { firstname: 'Jane', lastname: 'Smith' },
      address: {
        city: 'Los Angeles',
        street: 'Sunset Blvd',
        number: 2,
        zipcode: '90001',
        geolocation: { lat: '0', long: '0' },
      },
      phone: '987-654-3210',
      role: 'user',
    },
  ];

  getOrders(): Observable<Order[]> {
    return of(this.mockOrders);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<boolean> {
    const order = this.mockOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      return of(true);
    }
    return of(false);
  }

  getUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  getDashboardStats(): Observable<any> {
    const totalRevenue = this.mockOrders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = this.mockOrders.length;
    const pendingOrders = this.mockOrders.filter((o) => o.status === 'pending').length;
    const deliveredOrders = this.mockOrders.filter((o) => o.status === 'delivered').length;

    return of({
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
    });
  }

  // New methods for enhanced charts
  getRevenueAnalytics(): Observable<any> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      data: [6500, 5900, 8000, 8100, 5600, 5500, 4000],
    });
  }

  getOrderStatusDistribution(): Observable<any> {
    const statusCounts = {
      pending: this.mockOrders.filter((o) => o.status === 'pending').length,
      processing: this.mockOrders.filter((o) => o.status === 'processing').length,
      shipped: this.mockOrders.filter((o) => o.status === 'shipped').length,
      delivered: this.mockOrders.filter((o) => o.status === 'delivered').length,
      cancelled: this.mockOrders.filter((o) => o.status === 'cancelled').length,
    };
    return of(statusCounts);
  }

  getOrdersByCategory(): Observable<any> {
    return of({
      labels: ['Electronics', 'Jewelery', "Men's Clothing", "Women's Clothing"],
      data: [35, 25, 20, 20],
    });
  }

  getNewUsersGrowth(): Observable<any> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      data: [10, 25, 45, 80, 120, 150, 200],
    });
  }

  getWishlistItems(): Observable<any[]> {
    return of([
      {
        id: 1,
        userId: 2,
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        productId: 1,
        productTitle: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
        productImage: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
        category: "men's clothing",
        price: 109.95,
        addedOn: '2024-03-10T10:30:00',
      },
      {
        id: 2,
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john@example.com',
        productId: 5,
        productTitle: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        productImage: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
        category: 'jewelery',
        price: 695,
        addedOn: '2024-03-12T14:20:00',
      },
      {
        id: 3,
        userId: 2,
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        productId: 9,
        productTitle: 'WD 2TB Elements Portable External Hard Drive - USB 3.0 ',
        productImage: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
        category: 'electronics',
        price: 64,
        addedOn: '2024-03-15T09:15:00',
      },
    ]);
  }

  getWishlistAnalytics(): Observable<any> {
    return of({
      labels: ['Electronics', 'Jewelery', "Men's Clothing", "Women's Clothing"],
      data: [15, 30, 10, 20],
    });
  }
}
