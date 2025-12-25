import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, Check } from 'lucide-angular';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative" (click)="$event.stopPropagation()">
      <button
        (click)="toggle()"
        [class]="buttonClass"
        class="flex items-center justify-between gap-2 px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
        [ngClass]="
          isOpen()
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
        "
      >
        <span class="truncate">{{ selectedLabel() }}</span>
        <lucide-icon
          [img]="ChevronDown"
          [size]="16"
          class="transition-transform duration-200"
          [class.rotate-180]="isOpen()"
        ></lucide-icon>
      </button>

      <div
        *ngIf="isOpen()"
        class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <button
          *ngFor="let option of options"
          (click)="select(option.value)"
          class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
          [class.text-primary]="value === option.value"
          [class.font-medium]="value === option.value"
          [class.text-gray-700]="value !== option.value"
          [class.dark:text-gray-300]="value !== option.value"
        >
          {{ option.label }}
          <lucide-icon
            *ngIf="value === option.value"
            [img]="Check"
            [size]="14"
            class="text-primary"
          ></lucide-icon>
        </button>
      </div>
    </div>
  `,
})
export class DropdownComponent {
  @Input() options: { label: string; value: any }[] = [];
  @Input() value: any;
  @Input() placeholder: string = 'Select...';
  @Input() buttonClass: string = 'w-48 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  @Output() valueChange = new EventEmitter<any>();

  // Icons
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  select(val: any) {
    this.value = val;
    this.valueChange.emit(val);
    this.isOpen.set(false);
  }

  selectedLabel() {
    const selected = this.options.find((o) => o.value === this.value);
    return selected ? selected.label : this.placeholder;
  }

  // Close when clicking outside
  constructor() {
    // In a real app, use a directive or HostListener to handle click outside
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {
        this.isOpen.set(false);
      });
    }
  }
}
