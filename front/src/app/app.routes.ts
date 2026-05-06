import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'leads',
        loadComponent: () =>
          import('./features/leads/leads-list/leads-list.component').then(
            (m) => m.LeadsListComponent
          ),
      },
      {
        path: 'leads/:id',
        loadComponent: () =>
          import('./features/leads/lead-detail/lead-detail.component').then(
            (m) => m.LeadDetailComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

