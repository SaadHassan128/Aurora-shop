import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-size-guide',
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="close.emit()"
      ></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-xl text-primary">
              📏
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Size Guide</h2>
          </div>
          <button
            (click)="close.emit()"
            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            All measurements are in inches. Use this chart to find your perfect fit.
          </p>

          <!-- Tabs (Simulated) -->
          <div class="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800">
            <button class="px-4 py-2 text-primary font-bold border-b-2 border-primary">
              Clothing
            </button>
            <button
              class="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Shoes
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table class="w-full text-sm text-left">
              <thead
                class="bg-gray-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold"
              >
                <tr>
                  <th class="px-6 py-4">Size</th>
                  <th class="px-6 py-4">Chest</th>
                  <th class="px-6 py-4">Waist</th>
                  <th class="px-6 py-4">Hips</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  class="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">XS</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">32-34"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">26-28"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">32-34"</td>
                </tr>
                <tr
                  class="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">S</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">34-36"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">28-30"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">34-36"</td>
                </tr>
                <tr
                  class="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">M</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">36-38"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">30-32"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">36-38"</td>
                </tr>
                <tr
                  class="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">L</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">38-40"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">32-34"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">38-40"</td>
                </tr>
                <tr
                  class="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">XL</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">40-42"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">34-36"</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-400">40-42"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Measuring Tips -->
          <div
            class="mt-8 bg-blue-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-blue-100 dark:border-slate-700"
          >
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">How to Measure</h3>
            <ul class="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex items-start gap-2">
                <span
                  class="w-5 h-5 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5"
                  >1</span
                >
                <span
                  ><strong class="text-slate-900 dark:text-white">Chest:</strong> Measure around the
                  fullest part of your chest.</span
                >
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="w-5 h-5 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5"
                  >2</span
                >
                <span
                  ><strong class="text-slate-900 dark:text-white">Waist:</strong> Measure around
                  your natural waistline.</span
                >
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="w-5 h-5 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5"
                  >3</span
                >
                <span
                  ><strong class="text-slate-900 dark:text-white">Hips:</strong> Measure around the
                  fullest part of your hips.</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SizeGuideComponent {
  @Input() category: string = 'clothing';
  @Output() close = new EventEmitter<void>();
}
