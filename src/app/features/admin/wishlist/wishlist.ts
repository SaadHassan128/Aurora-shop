import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LucideAngularModule, Filter, Bell } from 'lucide-angular';
import { DropdownComponent } from '../../../shared/components/ui/dropdown/dropdown';
import { ModalComponent, ModalType } from '../../../shared/components/ui/modal/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-wishlist',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DropdownComponent, ModalComponent],
  templateUrl: './wishlist.html',
})
export class AdminWishlistComponent implements OnInit {
  adminService = inject(AdminService);
  toastr = inject(ToastrService);

  // Icons
  readonly Filter = Filter;
  readonly Bell = Bell;

  wishlistItems = signal<any[]>([]);
  allWishlistItems: any[] = [];

  // Filter Dropdown
  filterOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Jewelery', value: 'jewelery' },
    { label: "Men's Clothing", value: "men's clothing" },
    { label: "Women's Clothing", value: "women's clothing" },
  ];
  currentFilter = 'all';

  // Modal State
  isModalOpen = signal(false);
  modalType = signal<ModalType>('confirmation');
  modalTitle = signal('');
  modalMessage = signal('');
  pendingNotification: any | null = null;

  ngOnInit() {
    this.adminService.getWishlistItems().subscribe((data) => {
      this.allWishlistItems = data;
      this.filterWishlist(this.currentFilter);
    });
  }

  filterWishlist(category: string) {
    this.currentFilter = category;
    if (category === 'all') {
      this.wishlistItems.set(this.allWishlistItems);
    } else {
      this.wishlistItems.set(this.allWishlistItems.filter((item) => item.category === category));
    }
  }

  initiateNotify(item: any) {
    this.pendingNotification = item;
    this.modalType.set('confirmation');
    this.modalTitle.set('Notify User');
    this.modalMessage.set(
      `Are you sure you want to notify ${item.userName} about "${item.productTitle}" availability?`
    );
    this.isModalOpen.set(true);
  }

  confirmNotify() {
    if (this.modalType() === 'confirmation' && this.pendingNotification) {
      // Simulate API call
      setTimeout(() => {
        this.modalType.set('success');
        this.modalTitle.set('Notification Sent');
        this.modalMessage.set(
          `Successfully sent notification to ${this.pendingNotification.userEmail}.`
        );
        this.toastr.success('Notification sent successfully', 'Success');
      }, 500);
    } else {
      this.closeModal();
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.pendingNotification = null;
  }
}
