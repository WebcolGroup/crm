import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../../../core/services/leads.service';
import {
  Lead,
  CrearLeadDto,
  ActualizarLeadDto,
  FuenteLead,
  LeadEstado,
} from '../../../core/models/crm.models';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

const FUENTES: { label: string; value: FuenteLead }[] = [
  { label: 'Ads', value: 'ADS' },
  { label: 'LinkedIn', value: 'LINKEDIN' },
  { label: 'Referido', value: 'REFERIDO' },
  { label: 'Orgánico', value: 'ORGANICO' },
  { label: 'Landing', value: 'LANDING' },
  { label: 'Otro', value: 'OTRO' },
];

const ESTADOS: { label: string; value: LeadEstado }[] = [
  { label: 'Nuevo', value: 'NUEVO' },
  { label: 'Calificado', value: 'CALIFICADO' },
  { label: 'Contactado', value: 'CONTACTADO' },
  { label: 'Cita Agendada', value: 'CITA_AGENDADA' },
  { label: 'Cita Realizada', value: 'CITA_REALIZADA' },
  { label: 'Cerrado', value: 'CERRADO' },
  { label: 'Perdido', value: 'PERDIDO' },
];

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    FormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="lead ? 'Editar Lead' : 'Nuevo Lead'"
      [modal]="true"
      [style]="{ width: '35rem' }"
      [closable]="!saving()"
      (onHide)="onClose()"
    >
      <div class="flex flex-column gap-3 pt-2">
        <div class="grid">
          <div class="col-12 md:col-6">
            <label class="block text-sm font-medium mb-1">Nombre *</label>
            <input pInputText [(ngModel)]="form.nombre" class="w-full" placeholder="Juan Pérez" />
          </div>
          <div class="col-12 md:col-6">
            <label class="block text-sm font-medium mb-1">Email *</label>
            <input pInputText [(ngModel)]="form.email" type="email" class="w-full" placeholder="juan@empresa.com" />
          </div>
          <div class="col-12 md:col-6">
            <label class="block text-sm font-medium mb-1">Teléfono</label>
            <input pInputText [(ngModel)]="form.telefono" class="w-full" placeholder="+57 300..." />
          </div>
          <div class="col-12 md:col-6">
            <label class="block text-sm font-medium mb-1">Empresa</label>
            <input pInputText [(ngModel)]="form.empresa" class="w-full" placeholder="Nombre empresa" />
          </div>
          <div class="col-12 md:col-6">
            <label class="block text-sm font-medium mb-1">Fuente</label>
            <p-select
              [(ngModel)]="form.fuente"
              [options]="fuentes"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona"
              styleClass="w-full"
            />
          </div>
          @if (lead) {
            <div class="col-12 md:col-6">
              <label class="block text-sm font-medium mb-1">Estado</label>
              <p-select
                [(ngModel)]="form.estado"
                [options]="estados"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecciona"
                styleClass="w-full"
              />
            </div>
          }
          <div class="col-12 md:col-6">
            <label class="block text-sm font-medium mb-1">Valor Estimado (USD)</label>
            <p-inputnumber
              [(ngModel)]="form.valor_estimado"
              mode="currency"
              currency="USD"
              locale="en-US"
              styleClass="w-full"
              inputStyleClass="w-full"
            />
          </div>
          <div class="col-12">
            <label class="block text-sm font-medium mb-1">Problema / Necesidad</label>
            <textarea
              pTextarea
              [(ngModel)]="form.problema"
              rows="3"
              class="w-full"
              placeholder="Describe el problema o necesidad del lead..."
            ></textarea>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          severity="secondary"
          [text]="true"
          (onClick)="onClose()"
          [disabled]="saving()"
        />
        <p-button
          [label]="lead ? 'Guardar cambios' : 'Crear Lead'"
          icon="pi pi-check"
          (onClick)="onSave()"
          [loading]="saving()"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class LeadFormComponent implements OnInit {
  @Input() visible = false;
  @Input() lead: Lead | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<Lead>();

  private leadsService = inject(LeadsService);
  private messageService = inject(MessageService);

  saving = signal(false);
  fuentes = FUENTES;
  estados = ESTADOS;

  form: any = {
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    problema: '',
    fuente: 'OTRO',
    estado: undefined,
    valor_estimado: null,
  };

  ngOnInit() {
    if (this.lead) {
      this.form = {
        nombre: this.lead.nombre,
        email: this.lead.email,
        telefono: this.lead.telefono ?? '',
        empresa: this.lead.empresa ?? '',
        problema: this.lead.problema ?? '',
        fuente: this.lead.fuente,
        estado: this.lead.estado,
        valor_estimado: this.lead.valor_estimado ?? null,
      };
    }
  }

  onClose() {
    this.visibleChange.emit(false);
  }

  onSave() {
    if (!this.form.nombre || !this.form.email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Nombre y email son obligatorios.',
      });
      return;
    }

    this.saving.set(true);

    const obs = this.lead
      ? this.leadsService.update(this.lead.id, this.form as ActualizarLeadDto)
      : this.leadsService.create(this.form as CrearLeadDto);

    obs.subscribe({
      next: (lead) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.lead ? 'Lead actualizado.' : 'Lead creado.',
        });
        this.saved.emit(lead);
        this.onClose();
      },
      error: (err) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message ?? 'No se pudo guardar el lead.',
        });
      },
    });
  }
}
