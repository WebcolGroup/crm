// Umbrales de scoring para clasificación automática de leads
export const SCORE_UMBRAL_HOT = parseInt(process.env.HOT_LEAD_SCORE_THRESHOLD ?? '70', 10);
export const SCORE_UMBRAL_WARM = parseInt(process.env.WARM_LEAD_SCORE_THRESHOLD ?? '40', 10);

// Pesos usados en el algoritmo de scoring dinámico
export const PESOS_SCORING = {
  TIENE_EMPRESA: 20,
  TIENE_PROBLEMA_DEFINIDO: 25,
  FUENTE_PREMIUM: 15,       // linkedin, referido
  FUENTE_ESTANDAR: 8,       // ads, organico
  INTERACCION_EMAIL: 5,
  INTERACCION_WHATSAPP: 10,
  INTERACCION_LLAMADA: 15,
  CITA_AGENDADA: 20,
} as const;
