import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FakeStoreService, Product } from '../../../core/services/fake-store.service';
import { LucideAngularModule, Plus, Edit2, Star, Trash2 } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { ProductEditModalComponent } from './product-edit-modal/product-edit-modal';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductEditModalComponent],
  templateUrl: './products.html',
})
export class AdminProductsComponent implements OnInit {
  fakeStore = inject(FakeStoreService);
  toastr = inject(ToastrService);

  // Icons
  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Star = Star;
  readonly Trash2 = Trash2;

  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);

  ngOnInit() {
    this.fakeStore.getProducts().subscribe((data) => {
      this.products.set(data);
    });
  }

  editProduct(product: Product) {
    this.selectedProduct.set(product);
  }

  closeEditModal() {
    this.selectedProduct.set(null);
  }

  saveProduct(updatedProduct: Product) {
    // In a real app, call API to update
    this.products.update((products) =>
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    this.toastr.success('Product updated successfully', 'Success');
    this.closeEditModal();
  }
}
