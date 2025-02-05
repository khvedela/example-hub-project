import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LayoutComponent} from './core/components/layout/layout.component';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'examplehub';
}
