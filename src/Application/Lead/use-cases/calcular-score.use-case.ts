import { Injectable } from '@nestjs/common';
import { Lead } from '../../../Domain/Lead/entities/lead.entity';
import { LeadNivel } from '../../../Domain/Lead/value-objects/lead.enums';
import { FuenteLead } from '../../../Domain/Lead/value-objects/lead.enums';
import {
  PESOS_SCORING,
  SCORE_UMBRAL_HOT,
  SCORE_UMBRAL_WARM,
} from '../../../Domain/Shared/constants/scoring.constants';

// Caso de uso: calcula el score de un lead y determina su nivel (HOT/WARM/COLD).
// Se ejecuta al crear un lead y cada vez que se registra una nueva interacción.
@Injectable()
export class CalcularScoreUseCase {
  ejecutar(lead: Partial<Lead>, totalInteracciones: number = 0): { score: number; nivel: LeadNivel } {
    let score = 0;

    if (lead.empresa) {
      score += PESOS_SCORING.TIENE_EMPRESA;
    }

    if (lead.problema && lead.problema.length > 10) {
      score += PESOS_SCORING.TIENE_PROBLEMA_DEFINIDO;
    }

    if (lead.fuente === FuenteLead.LINKEDIN || lead.fuente === FuenteLead.REFERIDO) {
      score += PESOS_SCORING.FUENTE_PREMIUM;
    } else if (lead.fuente && lead.fuente !== FuenteLead.OTRO) {
      score += PESOS_SCORING.FUENTE_ESTANDAR;
    }

    // Puntuación por interacciones previas (máximo 30 puntos extra)
    const puntosInteraccion = Math.min(totalInteracciones * 5, 30);
    score += puntosInteraccion;

    // Score normalizado entre 0 y 100
    score = Math.min(score, 100);

    const nivel = this.determinarNivel(score);

    return { score, nivel };
  }

  private determinarNivel(score: number): LeadNivel {
    if (score >= SCORE_UMBRAL_HOT) return LeadNivel.HOT;
    if (score >= SCORE_UMBRAL_WARM) return LeadNivel.WARM;
    return LeadNivel.COLD;
  }
}
