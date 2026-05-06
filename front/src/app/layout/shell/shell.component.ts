import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ButtonModule, AvatarModule],
  template: `
    <div class="flex flex-column min-h-screen">
      <p-menubar [model]="menuItems" styleClass="border-noround border-bottom-1">
        <ng-template pTemplate="start">
          <span class="font-bold text-primary text-xl mr-4">Webcol CRM</span>
        </ng-template>
        <ng-template pTemplate="end">
          <div class="flex align-items-center gap-2">
            <p-avatar
              [label]="userInitial()"
              shape="circle"
              styleClass="bg-primary text-white"
            />
            <span class="text-sm font-medium">{{ userEmail() }}</span>
            <p-button
              icon="pi pi-sign-out"
              severity="secondary"
              [text]="true"
              (onClick)="logout()"
              pTooltip="Cerrar sesión"
            />
          </div>
        </ng-template>
      </p-menubar>

      <div class="flex-1 p-4">
        <router-outlet />
      </div>
    </div>
  `,
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/dashboard',
    },
    {
      label: 'Leads',
      icon: 'pi pi-users',
      routerLink: '/leads',
    },
  ];

  userEmail() {
    return this.auth.currentUser()?.email ?? '';
  }

  userInitial() {
    const email = this.auth.currentUser()?.email ?? 'U';
    return email[0].toUpperCase();
  }

  logout() {
    this.auth.logout();
  }
}
