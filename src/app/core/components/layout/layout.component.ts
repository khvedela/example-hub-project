import {Component, inject} from '@angular/core';
import {MegaMenu} from 'primeng/megamenu';
import {MegaMenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import {LayoutStore} from '../../state/layout/layout.store';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-layout',
  imports: [
    MegaMenu,
    Button,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly router = inject(Router);
  protected readonly layoutStore = inject(LayoutStore);

  items: MegaMenuItem[] = [
    {
      label: 'Feed',
      icon: 'pi pi-globe',
      command: () => this.router.navigate(['feed']),
    }
  ]
}
