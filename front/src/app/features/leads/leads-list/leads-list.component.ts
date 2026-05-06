import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../../../core/services/leads.service';
import { Lead, LeadNivel, LeadEstado, FuenteLead } from '../../../core/models/crm.models';
import { LeadFormComponent } from '../lead-form/lead-form.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined;

@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    LeadFormComponent,
    CurrencyPipe,
    IconFieldModule,
    InputIconModule,
  ],
  template: `
    <div class="flex flex-column gap-3">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center">
        <h2 class="m-0 text-900">Leads</h2>
        <p-button label="Nuevo Lead" icon="pi pi-plus" (onClick)="openForm(null)" />
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-2 align-items-center">
        <p-iconfield>
          <p-inputicon styleClass="pi pi-search" />
          <input
            pInputText
            [(ngModel)]="busqueda"
            placeholder="Buscar..."
            (input)="onFilter()"
            class="w-14rem"
          />
        </p-iconfield>

        <p-select
          [(ngModel)]="filtroNivel"
          [options]="nivelesOpts"
          optionLabel="label"
          optionValue="value"
          placeholder="Nivel"
          [showClear]="true"
          (onChange)="onFilter()"
          styleClass="w-9rem"
        />
        <p-select
          [(ngModel)]="filtroEstado"
          [options]="estadosOpts"
          optionLabel="label"
          optionValue="value"
          placeholder="Estado"
          [showClear]="true"
          (onChange)="onFilter()"
          styleClass="w-12rem"
        />
        <p-select
          [(ngModel)]="filtroFuente"
          [options]="fuentesOpts"
          optionLabel="label"
          optionValue="value"
          placeholder="Fuente"
          [showClear]="true"
          (onChange)="onFilter()"
          styleClass="w-10rem"
        />
      </div>

      <!-- Tabla -->
      <p-table
        [value]="leads()"
        [loading]="loading()"
        [paginator]="true"
        [rows]="20"
        [rowsPerPageOptions]="[10, 20, 50]"
        [rowHover]="true"
        styleClass="p-datatable-sm"
        [globalFilterFields]="['nombre', 'email', 'empresa']"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Email</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Score</th>
            <th>Valor Est.</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-lead>
          <tr>
            <td class="font-medium">{{ lead.nombre }}</td>
            <td>{{ lead.empresa ?? '-' }}</td>
            <td class="text-500 text-sm">{{ lead.email }}</td>
            <td>
              <p-tag
                [value]="lead.nivel"
                [severity]="nivelSeverity(lead.nivel)"
              />
            </td>
            <td>
              <p-tag
                [value]="lead.estado"
                severity="secondary"
                styleClass="text-xs"
              />
            </td>
            <td>
              <span class="font-bold">{{ lead.score }}</span>
            </td>
            <td>
              {{ lead.valor_estimado ? (lead.valor_estimado | currency:'USD':'symbol':'1.0-0') : '-' }}
            </td>
            <td>
              <div class="flex gap-1">
                <p-button
                  icon="pi pi-eye"
                  [text]="true"
                  size="small"
                  pTooltip="Ver detalle"
                  (onClick)="verDetalle(lead)"
                />
                <p-button
                  icon="pi pi-pencil"
                  [text]="true"
                  severity="secondary"
                  size="small"
                  pTooltip="Editar"
                  (onClick)="openForm(lead)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="8" class="text-center text-500 py-4">No se encontraron leads.</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Form Dialog -->
    @if (showForm()) {
      <app-lead-form
        [(visible)]="showFormVisible"
        [lead]="selectedLead"
        (saved)="onLeadSaved()"
      />
    }
  `,
})
export class LeadsListComponent implements OnInit {
  private leadsService = inject(LeadsService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  leads = signal<Lead[]>([]);
  loading = signal(true);
  showForm = signal(false);
  showFormVisible = false;
  selectedLead: Lead | null = null;

  busqueda = '';
  filtroNivel: LeadNivel | null = null;
  filtroEstado: LeadEstado | null = null;
  filtroFuente: FuenteLead | null = null;

  nivelesOpts = [
    { label: 'HOT', value: 'HOT' },
    { label: 'WARM', value: 'WARM' },
    { label: 'COLD', value: 'COLD' },
  ];

  estadosOpts = [
    { label: 'Nuevo', value: 'NUEVO' },
    { label: 'Calificado', value: 'CALIFICADO' },
    { label: 'Contactado', value: 'CONTACTADO' },
    { label: 'Cita Agendada', value: 'CITA_AGENDADA' },
    { label: 'Cita Realizada', value: 'CITA_REALIZADA' },
    { label: 'Cerrado', value: 'CERRADO' },
    { label: 'Perdido', value: 'PERDIDO' },
  ];

  fuentesOpts = [
    { label: 'Ads', value: 'ADS' },
    { label: 'LinkedIn', value: 'LINKEDIN' },
    { label: 'Referido', value: 'REFERIDO' },
    { label: 'Orgánico', value: 'ORGANICO' },
    { label: 'Landing', value: 'LANDING' },
    { label: 'Otro', value: 'OTRO' },
  ];

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.loading.set(true);
    this.leadsService
      .list({
        nivel: this.filtroNivel ?? undefined,
        estado: this.filtroEstado ?? undefined,
        fuente: this.filtroFuente ?? undefined,
        busqueda: this.busqueda || undefined,
      })
      .subscribe({
        next: (data) => {
          this.leads.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los leads.' });
        },
      });
  }

  onFilter() {
    this.loadLeads();
  }

  openForm(lead: Lead | null) {
    this.selectedLead = lead;
    this.showFormVisible = true;
    this.showForm.set(true);
  }

  onLeadSaved() {
    this.loadLeads();
  }

  verDetalle(lead: Lead) {
    this.router.navigate(['/leads', lead.id]);
  }

  nivelSeverity(nivel: LeadNivel): TagSeverity {
    const map: Record<LeadNivel, TagSeverity> = {
      HOT: 'danger',
      WARM: 'warn',
      COLD: 'info',
    };
    return map[nivel];
  }
}
