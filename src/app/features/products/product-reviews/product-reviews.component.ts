import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review, ReviewService } from '../../../core/services/review.service';
import { LucideAngularModule, Star, ThumbsUp, CheckCircle2, User } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-product-reviews',
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    template: `
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Customer Reviews</h2>
          <div class="flex items-center gap-2">
            <div class="flex text-yellow-400">
              <lucide-icon
                [img]="Star"
                [size]="20"
                [class.fill-current]="avgRating() >= 1"
              ></lucide-icon>
              <lucide-icon
                [img]="Star"
                [size]="20"
                [class.fill-current]="avgRating() >= 2"
              ></lucide-icon>
              <lucide-icon
                [img]="Star"
                [size]="20"
                [class.fill-current]="avgRating() >= 3"
              ></lucide-icon>
              <lucide-icon
                [img]="Star"
                [size]="20"
                [class.fill-current]="avgRating() >= 4"
              ></lucide-icon>
              <lucide-icon
                [img]="Star"
                [size]="20"
                [class.fill-current]="avgRating() >= 5"
              ></lucide-icon>
            </div>
            <span class="text-slate-600 dark:text-slate-400 font-medium">
              {{ avgRating() | number : '1.1-1' }} out of 5
            </span>
            <span class="text-slate-400 dark:text-slate-600">•</span>
            <span class="text-slate-600 dark:text-slate-400"
              >{{ productReviews().length }} reviews</span
            >
          </div>
        </div>

        <button
          (click)="showForm.set(!showForm())"
          class="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
        >
          {{ showForm() ? 'Cancel Review' : 'Write a Review' }}
        </button>
      </div>

      <!-- Write Review Form -->
      <div
        *ngIf="showForm()"
        class="mb-10 bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300"
      >
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Write your review</h3>
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >Rating</label
            >
            <div class="flex gap-2">
              <button
                type="button"
                *ngFor="let star of [1, 2, 3, 4, 5]"
                (click)="setRating(star)"
                class="transition-transform hover:scale-110 focus:outline-none"
                [class.text-yellow-400]="(reviewForm.get('rating')?.value || 0) >= star"
                [class.text-gray-300]="(reviewForm.get('rating')?.value || 0) < star"
              >
                <lucide-icon [img]="Star" [size]="28" fill="currentColor"></lucide-icon>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >Name</label
              >
              <input
                type="text"
                formControlName="userName"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >Review</label
            >
            <textarea
              formControlName="comment"
              rows="4"
              class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              placeholder="Tell us what you liked or didn't like..."
            ></textarea>
          </div>

          <button
            type="submit"
            [disabled]="reviewForm.invalid"
            class="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            Submit Review
          </button>
        </form>
      </div>

      <!-- Reviews List -->
      <div class="space-y-6">
        <div
          *ngFor="let review of productReviews()"
          class="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-6 last:pb-0"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <lucide-icon [img]="User" [size]="20"></lucide-icon>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {{ review.userName }}
                  <span *ngIf="review.verified" class="text-emerald-500" title="Verified Purchase">
                    <lucide-icon [img]="CheckCircle2" [size]="14"></lucide-icon>
                  </span>
                </h4>
                <div class="flex text-yellow-400 text-xs">
                  <lucide-icon
                    *ngFor="let s of [1, 2, 3, 4, 5]"
                    [img]="Star"
                    [size]="12"
                    [class.fill-current]="review.rating >= s"
                    [class.text-gray-200]="review.rating < s"
                  ></lucide-icon>
                </div>
              </div>
            </div>
            <span class="text-sm text-slate-500 dark:text-slate-400">{{
              review.date | date : 'mediumDate'
            }}</span>
          </div>

          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {{ review.comment }}
          </p>

          <div class="flex items-center gap-4">
            <button
              (click)="markHelpful(review.id)"
              class="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors group"
            >
              <lucide-icon
                [img]="ThumbsUp"
                [size]="16"
                class="group-hover:scale-110 transition-transform"
              ></lucide-icon>
              Helpful ({{ review.helpfulCount }})
            </button>
          </div>
        </div>

        <div *ngIf="productReviews().length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"
          >
            <lucide-icon [img]="Star" [size]="32"></lucide-icon>
          </div>
          <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No reviews yet</h3>
          <p class="text-slate-500 dark:text-slate-400">
            Be the first to share your thoughts on this product.
          </p>
        </div>
      </div>
    </div>
  `
})
export class ProductReviewsComponent {
  @Input() productId!: number;

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private toastr = inject(ToastrService);

  // Icons
  readonly Star = Star;
  readonly ThumbsUp = ThumbsUp;
  readonly CheckCircle2 = CheckCircle2;
  readonly User = User;

  showForm = signal(false);

  // Get reviews from service
  productReviews = computed(() => {
    return this.reviewService.getReviewsByProductId(this.productId);
  });

  avgRating = computed(() => {
    const reviews = this.productReviews();
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  });

  reviewForm = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(2)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.reviewService.addReview({
        productId: this.productId,
        userName: this.reviewForm.value.userName!,
        rating: this.reviewForm.value.rating!,
        comment: this.reviewForm.value.comment!,
        verified: true, // Simulating verified purchase
      });

      this.toastr.success('Review submitted successfully!');
      this.showForm.set(false);
      this.reviewForm.reset({ rating: 0 });
    }
  }

  markHelpful(id: string) {
    this.reviewService.markHelpful(id);
  }
}
