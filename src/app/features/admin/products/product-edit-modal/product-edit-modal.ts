import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../core/services/fake-store.service';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-product-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './product-edit-modal.html',
})
export class ProductEditModalComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<Product>();

  fb = inject(FormBuilder);
  productForm!: FormGroup;

  // Icons
  readonly X = X;

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [this.product.id],
      title: [this.product.title, Validators.required],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
      description: [this.product.description, Validators.required],
      category: [this.product.category, Validators.required],
      image: [this.product.image, Validators.required],
      rating: [this.product.rating],
    });
  }

  close() {
    this.closeEvent.emit();
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.saveEvent.emit(this.productForm.value);
    }
  }
}
