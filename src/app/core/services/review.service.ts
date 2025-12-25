import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Review {
  id: string;
  productId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: Date;
  comment: string;
  helpfulCount: number;
  verified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private storageKey = 'aurora_reviews';
  private platformId = inject(PLATFORM_ID);

  // Mock initial reviews
  private initialReviews: Review[] = [
    {
      id: '1',
      productId: 1,
      userName: 'Sarah Jenkins',
      rating: 5,
      date: new Date('2024-02-15'),
      comment:
        'Absolutely love this backpack! The laptop compartment is well padded and fits my 15" MacBook Pro perfectly. The material feels premium and durable.',
      helpfulCount: 12,
      verified: true,
    },
    {
      id: '2',
      productId: 1,
      userName: 'Mike Chen',
      rating: 4,
      date: new Date('2024-02-10'),
      comment:
        'Great bag for the price. zippers are smooth. Wish it had a dedicated water bottle holder on the outside, but otherwise perfect for daily commute.',
      helpfulCount: 5,
      verified: true,
    },
    {
      id: '3',
      productId: 2,
      userName: 'Alex Thompson',
      rating: 5,
      date: new Date('2024-03-01'),
      comment:
        'Slim fit is actually slim fit! Texture is nice and breathable. Will buy in other colors.',
      helpfulCount: 8,
      verified: true,
    },
  ];

  reviews = signal<Review[]>([]);

  constructor() {
    this.reviews.set(this.loadReviews());
  }

  private loadReviews(): Review[] {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Restore Date objects
        return parsed.map((r: any) => ({
          ...r,
          date: new Date(r.date),
        }));
      }
    }
    return this.initialReviews;
  }

  private saveReviews(reviews: Review[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
    }
    this.reviews.set(reviews);
  }

  getReviewsByProductId(productId: number): Review[] {
    return this.reviews()
      .filter((r) => r.productId === productId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  addReview(review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) {
    const newReview: Review = {
      ...review,
      id: crypto.randomUUID(),
      date: new Date(),
      helpfulCount: 0,
    };

    const updatedReviews = [newReview, ...this.reviews()];
    this.saveReviews(updatedReviews);
  }

  markHelpful(reviewId: string) {
    const updatedReviews = this.reviews().map((r) => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    });
    this.saveReviews(updatedReviews);
  }
}
