import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Order, OrderStatus } from '../../../core/services/admin.service';
import { LucideAngularModule, Filter, MoreHorizontal } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { DropdownComponent } from '../../../shared/components/ui/dropdown/dropdown';
import { ModalComponent, ModalType } from '../../../shared/components/ui/modal/modal';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DropdownComponent, ModalComponent],
  templateUrl: './orders.html',
})
export class AdminOrdersComponent implements OnInit {
  adminService = inject(AdminService);
  toastr = inject(ToastrService);

  // Icons
  readonly Filter = Filter;
  readonly MoreHorizontal = MoreHorizontal;

  orders = signal<Order[]>([]);
  allOrders: Order[] = [];

  // Filter Dropdown
  filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];
  currentFilter = 'all';

  // Status Actions Dropdown
  statusOptions = [
    { label: 'Mark as Pending', value: 'pending' },
    { label: 'Mark as Processing', value: 'processing' },
    { label: 'Mark as Shipped', value: 'shipped' },
    { label: 'Mark as Delivered', value: 'delivered' },
    { label: 'Cancel Order', value: 'cancelled' },
  ];

  // Modal State
  isModalOpen = signal(false);
  modalType = signal<ModalType>('confirmation');
  modalTitle = signal('');
  modalMessage = signal('');
  pendingStatusChange: { orderId: string; status: OrderStatus } | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders().subscribe((data) => {
      this.allOrders = data;
      this.filterOrders(this.currentFilter);
    });
  }

  filterOrders(status: string) {
    this.currentFilter = status;
    if (status === 'all') {
      this.orders.set(this.allOrders);
    } else {
      this.orders.set(this.allOrders.filter((o) => o.status === status));
    }
  }

  initiateStatusUpdate(orderId: string, status: OrderStatus) {
    this.pendingStatusChange = { orderId, status };
    this.modalType.set('confirmation');
    this.modalTitle.set('Confirm Status Change');
    this.modalMessage.set(
      `Are you sure you want to change the status of order #${orderId} to ${status}?`
    );
    this.isModalOpen.set(true);
  }

  confirmModal() {
    if (this.modalType() === 'confirmation' && this.pendingStatusChange) {
      const { orderId, status } = this.pendingStatusChange;
      this.adminService.updateOrderStatus(orderId, status).subscribe((success) => {
        if (success) {
          // Show success modal
          this.modalType.set('success');
          this.modalTitle.set('Status Updated');
          this.modalMessage.set(`Order #${orderId} has been successfully updated to ${status}.`);
          this.loadOrders();
        } else {
          this.toastr.error('Failed to update order status', 'Error');
          this.closeModal();
        }
      });
    } else {
      // Success modal confirmed
      this.closeModal();
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.pendingStatusChange = null;
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
