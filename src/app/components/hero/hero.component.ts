import { Component, HostListener, inject, signal } from '@angular/core';
import { LanguageService } from '../../services/language.service';

export type Scene = 'hero' | 'swim' | 'bike' | 'run' | 'finish';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  protected readonly langService = inject(LanguageService);
  protected readonly scene = signal<Scene>('hero');
  protected readonly swimPct = signal(0);
  protected readonly bikePct = signal(0);
  protected readonly runPct = signal(0);
  protected readonly hudKm = signal('0');
  protected readonly hudAlt = signal('231');
  protected readonly hudDisc = signal('Natation');
  protected readonly hintVisible = signal(true);

  @HostListener('window:scroll')
  onScroll(): void {
    this.hintVisible.set(window.scrollY < 60);

    const section = document.getElementById('ride');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

    // Update scene
    if (progress < 0.06) {
      this.scene.set('hero');
      this.swimPct.set(0); this.bikePct.set(0); this.runPct.set(0);
      this.hudKm.set('0'); this.hudAlt.set('231'); this.hudDisc.set('Natation');
    } else if (progress < 0.33) {
      this.scene.set('swim');
      const p = (progress - 0.06) / 0.27;
      this.swimPct.set(p);
      this.bikePct.set(0); this.runPct.set(0);
      this.hudKm.set((p * 2).toFixed(1)); this.hudAlt.set('231');
      this.hudDisc.set(this.langService.lang() === 'en' ? 'Swim' : 'Natation');
    } else if (progress < 0.66) {
      this.scene.set('bike');
      const p = (progress - 0.33) / 0.33;
      this.swimPct.set(1); this.bikePct.set(p); this.runPct.set(0);
      this.hudKm.set((2 + p * 100).toFixed(0));
      this.hudAlt.set(Math.round(231 + p * 1100).toString());
      this.hudDisc.set(this.langService.lang() === 'en' ? 'Bike' : 'Vélo');
    } else if (progress < 0.92) {
      this.scene.set('run');
      const p = (progress - 0.66) / 0.26;
      this.swimPct.set(1); this.bikePct.set(1); this.runPct.set(p);
      this.hudKm.set((102 + p * 13).toFixed(0));
      this.hudAlt.set(Math.round(1331 + p * 231).toString());
      this.hudDisc.set('Trail');
    } else {
      this.scene.set('finish');
      this.swimPct.set(1); this.bikePct.set(1); this.runPct.set(1);
      this.hudKm.set('115'); this.hudAlt.set('1562');
      this.hudDisc.set(this.langService.lang() === 'en' ? 'Finish' : 'Arrivée');
    }
  }
}
