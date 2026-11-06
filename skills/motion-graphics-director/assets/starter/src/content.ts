import {z} from 'zod';

export const filmSchema = z.object({
  brand: z.string().min(1).max(14),
  label: z.string().max(48),
  headlines: z.array(z.string().min(1).max(90)).length(5),
  supporting: z.array(z.string().max(110)).length(5),
  footer: z.string().max(60),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  musicVolume: z.number().min(0).max(1),
  sfxVolume: z.number().min(0).max(1),
  audioEnabled: z.boolean(),
});
export type FilmProps = z.infer<typeof filmSchema>;
// Editable defaults live as object literals in Root.tsx so Studio can persist them.
export const SHOTS = [
  {id:'idea', from:0, duration:120, purpose:'Hook: an idea becomes visible', chapter:'01 — DIE IDEE'},
  {id:'focus', from:120, duration:120, purpose:'Scattered forms converge into one focal point', chapter:'02 — DER FOKUS'},
  {id:'feeling', from:240, duration:120, purpose:'Type, color and form embody the feeling', chapter:'03 — DAS GEFÜHL'},
  {id:'possibility', from:360, duration:120, purpose:'One shape becomes a family of expressions', chapter:'04 — DIE MÖGLICHKEIT'},
  {id:'signature', from:480, duration:120, purpose:'A quiet signature and call to action', chapter:'05 — DEIN NÄCHSTER SCHRITT'},
] as const;
