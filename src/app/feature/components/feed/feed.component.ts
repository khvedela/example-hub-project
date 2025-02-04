import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {Ripple} from 'primeng/ripple';
import {PostComponent} from '../../../shared/components/post/post.component';

@Component({
  selector: 'app-feed',
  imports: [
    Card,
    Button,
    PrimeTemplate,
    Ripple,
    PostComponent
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  postDate = 'February 4, 2025'; // Example date, replace dynamically
}
