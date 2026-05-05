import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'fr' | 'en';

export interface Translations {
  eyebrow: string;
  date: string;
  navEvent: string;
  navCourses: string;
  navRegister: string;
  navInfo: string;
  navResults: string;
  navCta: string;
  btnRegister: string;
  btnCourses: string;
  langToggle: string;
}

const TRANSLATIONS: Record<Lang, Translations> = {
  fr: {
    eyebrow: 'Triathlon Distance L · Savoie',
    date: '6 Juin 2026',
    navEvent: "L'épreuve",
    navCourses: 'Parcours',
    navRegister: 'Inscriptions',
    navInfo: 'Infos',
    navResults: 'Palmarès',
    navCta: "S'inscrire",
    btnRegister: "S'inscrire maintenant",
    btnCourses: 'Voir les parcours',
    langToggle: 'EN',
  },
  en: {
    eyebrow: 'Long Distance Triathlon · Savoie',
    date: '6 June 2026',
    navEvent: 'The Race',
    navCourses: 'Courses',
    navRegister: 'Register',
    navInfo: 'Info',
    navResults: 'Results',
    navCta: 'Register',
    btnRegister: 'Register now',
    btnCourses: 'View courses',
    langToggle: 'FR',
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>('fr');
  readonly t = computed<Translations>(() => TRANSLATIONS[this.lang()]);

  toggle(): void {
    this.lang.update((l) => (l === 'fr' ? 'en' : 'fr'));
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }
}
