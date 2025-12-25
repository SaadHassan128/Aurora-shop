import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';
import { LucideAngularModule, X, Mail, Phone, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './user-profile-modal.html',
})
export class UserProfileModalComponent {
  @Input({ required: true }) user!: User;
  @Output() closeEvent = new EventEmitter<void>();

  // Icons
  readonly X = X;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;

  close() {
    this.closeEvent.emit();
  }
}
