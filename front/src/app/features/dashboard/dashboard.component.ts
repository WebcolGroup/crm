import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardMetricas } from '../../core/models/crm.models';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, ChartModule, SkeletonModule, TagModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="flex flex-column gap-4">
      <h2 class="m-0 text-900">Dashboard</h2>

      @if (loading()) {
        <div class="grid">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="col-12 md:col-6 lg:col-2">
              <p-skeleton height="6rem" />
            </div>
          }
        </div>
      } @else if (metricas()) {
        <!-- KPI Cards -->
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-2">
            <p-card styleClass="h-full text-center">
              <div class="text-500 text-sm font-medium mb-2">Total Leads</div>
              <div class="text-4xl font-bold text-900">{{ metricas()!.totalLeads }}</div>
            </p-card>
          </div>
          <div class="col-12 md:col-6 lg:col-2">
            <p-card styleClass="h-full text-center">
              <div class="text-500 text-sm font-medium mb-2">Leads HOT</div>
              <div class="text-4xl font-bold text-red-500">{{ metricas()!.leadsHOT }}</div>
            </p-card>
          </div>
          <div class="col-12 md:col-6 lg:col-2">
            <p-card styleClass="h-full text-center">
              <div class="text-500 text-sm font-medium mb-2">Pipeline</div>
              <div class="text-2xl font-bold text-green-600">
                {{ metricas()!.pipelineValue | currency:'USD':'symbol':'1.0-0' }}
              </div>
            </p-card>
          </div>
          <div class="col-12 md:col-6 lg:col-2">
            <p-card styleClass="h-full text-center">
              <div class="text-500 text-sm font-medium mb-2">Ventas Cerradas</div>
              <div class="text-4xl font-bold text-primary">{{ metricas()!.closedSales }}</div>
            </p-card>
          </div>
          <div class="col-12 md:col-6 lg:col-2">
            <p-card styleClass="h-full text-center">
              <div class="text-500 text-sm font-medium mb-2">Conversión</div>
              <div class="text-3xl font-bold text-blue-500">
                {{ metricas()!.conversionRate | number:'1.1-1' }}%
              </div>
            </p-card>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid">
          <div class="col-12 md:col-6">
            <p-card header="Leads por Estado">
              <p-chart type="bar" [data]="barChartData()" [options]="barChartOptions" height="250px" />
            </p-card>
          </div>
          <div class="col-12 md:col-6">
            <p-card header="Nuevos Leads (últimos 7 días)">
              <p-chart type="line" [data]="lineChartData()" [options]="lineChartOptions" height="250px" />
            </p-card>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = signal(true);
  metricas = signal<DashboardMetricas | null>(null);

  barChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  lineChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    tension: 0.4,
  };

  barChartData() {
    const m = this.metricas();
    if (!m) return {};
    const labels = Object.keys(m.leadsByState);
    const data = Object.values(m.leadsByState);
    return {
      labels,
      datasets: [
        {
          label: 'Leads',
          data,
          backgroundColor: '#6366f1',
          borderRadius: 4,
        },
      ],
    };
  }

  lineChartData() {
    const m = this.metricas();
    if (!m) return {};
    const days = m.last7DaysLeads ?? [];
    const labels = Array.from({ length: days.length }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days.length - 1 - i));
      return d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' });
    });
    return {
      labels,
      datasets: [
        {
          label: 'Leads',
          data: days,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.15)',
          fill: true,
        },
      ],
    };
  }

  ngOnInit() {
    this.dashboardService.getMetricas().subscribe({
      next: (data) => {
        this.metricas.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
