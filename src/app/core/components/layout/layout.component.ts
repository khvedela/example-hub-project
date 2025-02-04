import { Component } from '@angular/core';
import {MegaMenu} from 'primeng/megamenu';
import {MegaMenuItem} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-layout',
  imports: [
    MegaMenu,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  items: MegaMenuItem[] = [
    {
      label: 'Feed',
      route: 'feed',
      icon: 'pi pi-globe',
    },
    {
      label: 'Admin',
      route: 'admin',
      icon: 'pi pi-bullseye',
    },
    {
      label: 'Profile',
      route: 'profile',
      icon: 'pi pi-user',
    }
  ]
}
