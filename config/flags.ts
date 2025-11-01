// src/config/flags.ts
export const ENABLE_LESSON_I18N = true; // coloque false para desligar
export const LAB_UI = (process.env.VITE_LAB_UI ?? 'false') === 'true';
