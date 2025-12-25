import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
    standalone: true,
    imports: [RouterOutlet]
})
export class App {
  title = 'aurora-e-shop';
}
