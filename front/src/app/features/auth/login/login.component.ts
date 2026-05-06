import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  template: `
    <div class="flex justify-content-center align-items-center min-h-screen bg-surface-100">
      <p-card styleClass="w-full md:w-25rem shadow-3">
        <ng-template pTemplate="header">
          <div class="text-center pt-4 pb-2">
            <i class="pi pi-chart-line text-primary" style="font-size: 2.5rem"></i>
            <h2 class="mt-2 mb-0 text-900">Webcol CRM</h2>
            <p class="text-500 text-sm mt-1">Inicia sesión para continuar</p>
          </div>
        </ng-template>

        <div class="flex flex-column gap-3">
          @if (error()) {
            <p-message severity="error" [text]="error()!" />
          }

          <div class="flex flex-column gap-1">
            <label for="email" class="font-medium text-sm">Email</label>
            <input
              pInputText
              id="email"
              type="email"
              [(ngModel)]="email"
              placeholder="admin@webcol.co"
              class="w-full"
              [disabled]="loading()"
            />
          </div>

          <div class="flex flex-column gap-1">
            <label for="password" class="font-medium text-sm">Contraseña</label>
            <p-password
              id="password"
              [(ngModel)]="password"
              placeholder="••••••••"
              [feedback]="false"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
              [disabled]="loading()"
            />
          </div>

          <p-button
            label="Iniciar sesión"
            icon="pi pi-sign-in"
            styleClass="w-full mt-1"
            [loading]="loading()"
            (onClick)="onLogin()"
          />
        </div>
      </p-card>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  onLogin() {
    if (!this.email || !this.password) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? 'Credenciales incorrectas. Intenta nuevamente.'
        );
      },
    });
  }
}
