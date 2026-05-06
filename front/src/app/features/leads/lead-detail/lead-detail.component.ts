import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { LeadsService } from '../../../core/services/leads.service';
import { InteraccionesService } from '../../../core/services/interacciones.service';
import { VentasService } from '../../../core/services/ventas.service';
import {
  Lead,
  Interaccion,
  Venta,
  TipoInteraccion,
  EstadoVenta,
  LeadNivel,
} from '../../../core/models/crm.models';
import { LeadFormComponent } from '../lead-form/lead-form.component';
import { CardModule } from 'primeng/card';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined;

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CurrencyPipe,
    CardModule,
    TagModule,
    TimelineModule,
    TableModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    InputNumberModule,
    SkeletonModule,
    DividerModule,
    LeadFormComponent,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
  ],
  template: `
    <div class="flex flex-column gap-3">
      <!-- Header -->
      <div class="flex align-items-center gap-2">
        <p-button icon="pi pi-arrow-left" [text]="true" severity="secondary" (onClick)="goBack()" />
        <h2 class="m-0 text-900 flex-1">{{ lead()?.nombre ?? 'Cargando...' }}</h2>
        @if (lead()) {
          <p-tag [value]="lead()!.nivel" [severity]="nivelSeverity(lead()!.nivel)" />
          <p-button icon="pi pi-pencil" label="Editar" severity="secondary" (onClick)="openEdit()" />
        }
      </div>

      @if (loading()) {
        <p-skeleton height="12rem" />
      } @else if (lead()) {
        <!-- Info Cards -->
        <div class="grid">
          <div class="col-12 md:col-4">
            <p-card header="Información del Lead">
              <div class="flex flex-column gap-2 text-sm">
                <div><span class="text-500">Email:</span> {{ lead()!.email }}</div>
                <div><span class="text-500">Teléfono:</span> {{ lead()!.telefono ?? '-' }}</div>
                <div><span class="text-500">Empresa:</span> {{ lead()!.empresa ?? '-' }}</div>
                <div><span class="text-500">Fuente:</span> {{ lead()!.fuente }}</div>
                <div><span class="text-500">Estado:</span>
                  <p-tag [value]="lead()!.estado" severity="secondary" styleClass="ml-1 text-xs" />
                </div>
                <div><span class="text-500">Score:</span> <strong>{{ lead()!.score }}</strong></div>
                <div>
                  <span class="text-500">Valor Est.:</span>
                  {{ lead()!.valor_estimado ? (lead()!.valor_estimado! | currency:'USD':'symbol':'1.0-0') : '-' }}
                </div>
                <div><span class="text-500">Creado:</span> {{ lead()!.fecha_creacion | date:'dd/MM/yyyy' }}</div>
              </div>
            </p-card>
          </div>

          <div class="col-12 md:col-8">
            <p-card header="Problema / Necesidad">
              <p class="text-700 line-height-3">{{ lead()!.problema ?? 'Sin descripción.' }}</p>
            </p-card>
          </div>
        </div>

        <!-- Tabs -->
        <p-tabs [value]="0">
          <!-- Interacciones -->
          <p-tablist>
            <p-tab [value]="0">
              <i class="pi pi-comments mr-1"></i>
              Interacciones ({{ lead()!.interacciones?.length ?? 0 }})
            </p-tab>
            <p-tab [value]="1">
              <i class="pi pi-calendar mr-1"></i>
              Citas ({{ lead()!.citas?.length ?? 0 }})
            </p-tab>
            <p-tab [value]="2">
              <i class="pi pi-dollar mr-1"></i>
              Ventas ({{ lead()!.ventas?.length ?? 0 }})
            </p-tab>
          </p-tablist>

          <p-tabpanels>
            <!-- Interacciones Panel -->
            <p-tabpanel [value]="0">
              <!-- Add Interaction Form -->
              <div class="flex flex-column gap-2 mb-4 p-3 border-1 border-round surface-50">
                <h4 class="m-0 text-800">Registrar interacción</h4>
                <div class="flex gap-2 align-items-start flex-wrap">
                  <p-select
                    [(ngModel)]="nuevaInteraccion.tipo"
                    [options]="tiposInteraccion"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Tipo"
                    styleClass="w-10rem"
                  />
                  <textarea
                    pTextarea
                    [(ngModel)]="nuevaInteraccion.mensaje"
                    placeholder="Mensaje o nota..."
                    rows="2"
                    class="flex-1"
                    style="min-width: 200px"
                  ></textarea>
                  <p-button
                    label="Agregar"
                    icon="pi pi-plus"
                    (onClick)="addInteraccion()"
                    [loading]="savingInteraccion()"
                  />
                </div>
              </div>

              <!-- Timeline -->
              @if ((lead()!.interacciones?.length ?? 0) > 0) {
                <p-timeline [value]="lead()!.interacciones!" align="left">
                  <ng-template pTemplate="marker" let-item>
                    <i [class]="interaccionIcon(item.tipo) + ' text-primary'"></i>
                  </ng-template>
                  <ng-template pTemplate="content" let-item>
                    <div class="mb-3">
                      <div class="flex align-items-center gap-2 mb-1">
                        <p-tag [value]="item.tipo" severity="secondary" styleClass="text-xs" />
                        <span class="text-500 text-xs">{{ item.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      @if (item.mensaje) {
                        <p class="text-700 text-sm m-0">{{ item.mensaje }}</p>
                      }
                    </div>
                  </ng-template>
                </p-timeline>
              } @else {
                <p class="text-500 text-center py-4">Sin interacciones aún.</p>
              }
            </p-tabpanel>

            <!-- Citas Panel -->
            <p-tabpanel [value]="1">
              @if ((lead()!.citas?.length ?? 0) > 0) {
                <p-table [value]="lead()!.citas!" styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Reunión</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-cita>
                    <tr>
                      <td>{{ cita.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                      <td><p-tag [value]="cita.estado" severity="secondary" /></td>
                      <td>
                        @if (cita.url_reunion) {
                          <a [href]="cita.url_reunion" target="_blank" class="text-primary">
                            <i class="pi pi-external-link mr-1"></i>Unirse
                          </a>
                        } @else {
                          -
                        }
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              } @else {
                <p class="text-500 text-center py-4">Sin citas programadas.</p>
              }
            </p-tabpanel>

            <!-- Ventas Panel -->
            <p-tabpanel [value]="2">
              <!-- Add Venta Form -->
              <div class="flex flex-column gap-2 mb-4 p-3 border-1 border-round surface-50">
                <h4 class="m-0 text-800">Registrar venta</h4>
                <div class="flex gap-2 align-items-end flex-wrap">
                  <div class="flex flex-column gap-1">
                    <label class="text-xs font-medium">Valor (USD)</label>
                    <p-inputnumber
                      [(ngModel)]="nuevaVenta.valor"
                      mode="currency"
                      currency="USD"
                      locale="en-US"
                      styleClass="w-12rem"
                      inputStyleClass="w-full"
                    />
                  </div>
                  <div class="flex flex-column gap-1">
                    <label class="text-xs font-medium">Estado</label>
                    <p-select
                      [(ngModel)]="nuevaVenta.estado"
                      [options]="estadosVenta"
                      optionLabel="label"
                      optionValue="value"
                      styleClass="w-10rem"
                    />
                  </div>
                  <div class="flex flex-column gap-1 flex-1" style="min-width:180px">
                    <label class="text-xs font-medium">Notas</label>
                    <input pInputText [(ngModel)]="nuevaVenta.notas" placeholder="Notas opcionales..." class="w-full" />
                  </div>
                  <p-button
                    label="Registrar"
                    icon="pi pi-plus"
                    (onClick)="addVenta()"
                    [loading]="savingVenta()"
                  />
                </div>
              </div>

              @if ((lead()!.ventas?.length ?? 0) > 0) {
                <p-table [value]="lead()!.ventas!" styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Valor</th>
                      <th>Estado</th>
                      <th>Notas</th>
                      <th>Fecha</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-venta>
                    <tr>
                      <td class="font-bold">{{ venta.valor | currency:'USD':'symbol':'1.0-0' }}</td>
                      <td>
                        <p-tag
                          [value]="venta.estado"
                          [severity]="ventaSeverity(venta.estado)"
                        />
                      </td>
                      <td class="text-sm text-500">{{ venta.notas ?? '-' }}</td>
                      <td>{{ venta.fecha_cierre | date:'dd/MM/yyyy' }}</td>
                    </tr>
                  </ng-template>
                </p-table>
              } @else {
                <p class="text-500 text-center py-4">Sin ventas registradas.</p>
              }
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      }
    </div>

    <!-- Edit Dialog -->
    @if (showEdit()) {
      <app-lead-form
        [(visible)]="showEditVisible"
        [lead]="lead()"
        (saved)="onLeadUpdated($event)"
      />
    }
  `,
})
export class LeadDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private leadsService = inject(LeadsService);
  private interaccionesService = inject(InteraccionesService);
  private ventasService = inject(VentasService);
  private messageService = inject(MessageService);

  lead = signal<Lead | null>(null);
  loading = signal(true);
  showEdit = signal(false);
  showEditVisible = false;
  savingInteraccion = signal(false);
  savingVenta = signal(false);

  nuevaInteraccion: { tipo: TipoInteraccion; mensaje: string } = {
    tipo: 'NOTA',
    mensaje: '',
  };

  nuevaVenta: { valor: number | null; estado: EstadoVenta; notas: string } = {
    valor: null,
    estado: 'PENDIENTE',
    notas: '',
  };

  tiposInteraccion = [
    { label: 'Nota', value: 'NOTA' },
    { label: 'WhatsApp', value: 'WHATSAPP' },
    { label: 'Email', value: 'EMAIL' },
    { label: 'Llamada', value: 'LLAMADA' },
  ];

  estadosVenta = [
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Cerrada', value: 'CERRADA' },
    { label: 'Perdida', value: 'PERDIDA' },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.leadsService.getById(id).subscribe({
      next: (lead) => {
        this.lead.set(lead);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el lead.' });
        this.router.navigate(['/leads']);
      },
    });
  }

  goBack() {
    this.router.navigate(['/leads']);
  }

  openEdit() {
    this.showEditVisible = true;
    this.showEdit.set(true);
  }

  onLeadUpdated(updated: Lead) {
    this.lead.set({ ...this.lead()!, ...updated });
  }

  addInteraccion() {
    const l = this.lead();
    if (!l || !this.nuevaInteraccion.tipo) return;

    this.savingInteraccion.set(true);
    this.interaccionesService
      .registrar({ lead_id: l.id, tipo: this.nuevaInteraccion.tipo, mensaje: this.nuevaInteraccion.mensaje })
      .subscribe({
        next: (interaccion) => {
          this.savingInteraccion.set(false);
          const current = this.lead()!;
          this.lead.set({
            ...current,
            interacciones: [interaccion, ...(current.interacciones ?? [])],
          });
          this.nuevaInteraccion.mensaje = '';
          this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'Interacción guardada.' });
        },
        error: (err) => {
          this.savingInteraccion.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message ?? 'Error al registrar.' });
        },
      });
  }

  addVenta() {
    const l = this.lead();
    if (!l || !this.nuevaVenta.valor) {
      this.messageService.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El valor de la venta es obligatorio.' });
      return;
    }

    this.savingVenta.set(true);
    this.ventasService
      .registrar({
        lead_id: l.id,
        valor: this.nuevaVenta.valor,
        estado: this.nuevaVenta.estado,
        notas: this.nuevaVenta.notas || undefined,
      })
      .subscribe({
        next: (venta) => {
          this.savingVenta.set(false);
          const current = this.lead()!;
          this.lead.set({
            ...current,
            ventas: [...(current.ventas ?? []), venta],
          });
          this.nuevaVenta = { valor: null, estado: 'PENDIENTE', notas: '' };
          this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'Venta registrada.' });
        },
        error: (err) => {
          this.savingVenta.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message ?? 'Error al registrar la venta.' });
        },
      });
  }

  nivelSeverity(nivel: LeadNivel): TagSeverity {
    const map: Record<LeadNivel, TagSeverity> = { HOT: 'danger', WARM: 'warn', COLD: 'info' };
    return map[nivel];
  }

  ventaSeverity(estado: EstadoVenta): TagSeverity {
    const map: Record<EstadoVenta, TagSeverity> = {
      CERRADA: 'success',
      PENDIENTE: 'warn',
      PERDIDA: 'danger',
    };
    return map[estado];
  }

  interaccionIcon(tipo: TipoInteraccion): string {
    const map: Record<TipoInteraccion, string> = {
      WHATSAPP: 'pi pi-whatsapp',
      EMAIL: 'pi pi-envelope',
      LLAMADA: 'pi pi-phone',
      NOTA: 'pi pi-pencil',
    };
    return map[tipo] ?? 'pi pi-circle';
  }
}
