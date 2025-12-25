import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import {
  LucideAngularModule,
  DollarSign,
  ShoppingBag,
  Clock,
  PackageCheck,
  TrendingUp,
} from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BaseChartDirective],
  templateUrl: './dashboard.html',
})
export class AdminDashboardComponent implements OnInit {
  adminService = inject(AdminService);

  // Icons
  readonly DollarSign = DollarSign;
  readonly ShoppingBag = ShoppingBag;
  readonly Clock = Clock;
  readonly PackageCheck = PackageCheck;
  readonly TrendingUp = TrendingUp;

  stats = signal<any>(null);

  // Charts
  public revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Revenue',
        fill: true,
        tension: 0.5,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.3)',
      },
    ],
  };

  public orderStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Delivered', 'Pending', 'Processing', 'Cancelled'],
    datasets: [
      {
        data: [300, 50, 100, 20],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      },
    ],
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public categoryChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public userGrowthChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public wishlistChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe((stats) => {
      this.stats.set(stats);
    });

    this.adminService.getOrdersByCategory().subscribe((data) => {
      this.categoryChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            label: 'Orders',
            backgroundColor: '#db2777',
          },
        ],
      };
    });

    this.adminService.getNewUsersGrowth().subscribe((data) => {
      this.userGrowthChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            label: 'Users',
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
            fill: true,
          },
        ],
      };
    });

    this.adminService.getWishlistAnalytics().subscribe((data) => {
      this.wishlistChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6'],
          },
        ],
      };
    });
  }
}
