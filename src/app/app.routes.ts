import { Routes } from '@angular/router';
import {FeedComponent} from './feature/components/feed/feed.component';
import {AdminComponent} from './feature/components/admin/admin.component';
import {ProfileComponent} from './feature/components/profile/profile.component';

export const routes: Routes = [
  {
    path: 'feed',
    component: FeedComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  }
];
