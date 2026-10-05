import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Scene = 'hero' | 'swim' | 'bike' | 'run' | 'finish';
type Discipline = 'swim' | 'bike' | 'run';
type Lang = 'fr' | 'en';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  lang = signal<Lang>('fr');
  menuOpen = signal(false);
  scrolled = signal(false);

  // Hero scroll
  scene = signal<Scene>('hero');
  swimPct = signal(0);
  bikePct = signal(0);
  runPct = signal(0);
  hudKm = signal('0');
  hudAlt = signal('231');
  hudDisc = signal('Natation');
  hintVisible = signal(true);

  // Parcours tabs
  activeTab = signal<Discipline>('swim');

  setLang(l: Lang) { this.lang.set(l); }
  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }
  setTab(d: Discipline) { this.activeTab.set(d); }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
    this.hintVisible.set(window.scrollY < 60);
    if (this.menuOpen()) this.menuOpen.set(false);

    const section = document.getElementById('ride');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const p = Math.max(0, Math.min(1, -rect.top / scrollable));

    if (p < 0.06) {
      this.scene.set('hero');
      this.swimPct.set(0); this.bikePct.set(0); this.runPct.set(0);
      this.hudKm.set('0'); this.hudAlt.set('231'); this.hudDisc.set('Natation');
    } else if (p < 0.33) {
      this.scene.set('swim');
      const q = (p - 0.06) / 0.27;
      this.swimPct.set(q); this.bikePct.set(0); this.runPct.set(0);
      this.hudKm.set((q * 2).toFixed(1)); this.hudAlt.set('231'); this.hudDisc.set('Natation');
    } else if (p < 0.66) {
      this.scene.set('bike');
      const q = (p - 0.33) / 0.33;
      this.swimPct.set(1); this.bikePct.set(q); this.runPct.set(0);
      this.hudKm.set((2 + q * 100).toFixed(0));
      this.hudAlt.set(Math.round(231 + q * 1100).toString()); this.hudDisc.set('Vélo');
    } else if (p < 0.92) {
      this.scene.set('run');
      const q = (p - 0.66) / 0.26;
      this.swimPct.set(1); this.bikePct.set(1); this.runPct.set(q);
      this.hudKm.set((102 + q * 13).toFixed(0));
      this.hudAlt.set(Math.round(1331 + q * 231).toString()); this.hudDisc.set('Trail');
    } else {
      this.scene.set('finish');
      this.swimPct.set(1); this.bikePct.set(1); this.runPct.set(1);
      this.hudKm.set('115'); this.hudAlt.set('1562'); this.hudDisc.set('Arrivée');
    }
  }
}
