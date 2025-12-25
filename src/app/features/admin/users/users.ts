import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';
import { LucideAngularModule, Filter, Trash2 } from 'lucide-angular';
import { UserProfileModalComponent } from './user-profile-modal/user-profile-modal';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserProfileModalComponent],
  templateUrl: './users.html',
})
export class AdminUsersComponent implements OnInit {
  adminService = inject(AdminService);

  // Icons
  readonly Filter = Filter;
  readonly Trash2 = Trash2;

  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);

  ngOnInit() {
    this.adminService.getUsers().subscribe((data) => {
      this.users.set(data);
    });
  }

  viewProfile(user: User) {
    this.selectedUser.set(user);
  }

  closeProfile() {
    this.selectedUser.set(null);
  }
}
