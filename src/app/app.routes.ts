import { Routes } from '@angular/router';
import {FeedComponent} from './feature/components/feed/feed.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full',
  },
  {
    path: 'feed',
    component: FeedComponent,
  },
];
