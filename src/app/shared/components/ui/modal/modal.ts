import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, CheckCircle2, X } from 'lucide-angular';

export type ModalType = 'confirmation' | 'success';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform scale-100 transition-all animate-in zoom-in-95 duration-200"
        (click)="$event.stopPropagation()"
      >
        <!-- Header / Icon -->
        <div class="pt-8 px-8 flex justify-center">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            [ngClass]="
              type === 'confirmation'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
            "
          >
            <lucide-icon
              [img]="type === 'confirmation' ? AlertTriangle : CheckCircle2"
              [size]="32"
            ></lucide-icon>
          </div>
        </div>

        <!-- Content -->
        <div class="px-8 pb-8 text-center">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{{ message }}</p>

          <div class="flex gap-3 justify-center">
            <ng-container *ngIf="type === 'confirmation'; else successActions">
              <button
                (click)="onCancel.emit()"
                class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                (click)="onConfirm.emit()"
                class="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                Confirm
              </button>
            </ng-container>
            <ng-template #successActions>
              <button
                (click)="onConfirm.emit()"
                class="w-full px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all"
              >
                Continue
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() type: ModalType = 'confirmation';
  @Input() title: string = '';
  @Input() message: string = '';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  // Icons
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle2 = CheckCircle2;
  readonly X = X;
}
