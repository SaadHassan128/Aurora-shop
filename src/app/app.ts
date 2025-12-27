import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
    standalone: true,
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  title = 'aurora-e-shop';
}
