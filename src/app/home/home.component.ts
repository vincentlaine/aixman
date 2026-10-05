import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private script?: HTMLScriptElement;
  private onScroll = () => {
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = scrollY > 60 ? '0' : '1';
  };

  ngAfterViewInit() {
    addEventListener('scroll', this.onScroll, { passive: true });
    this.script = document.createElement('script');
    this.script.src = 'aixman-scene.js';
    document.body.appendChild(this.script);
  }

  ngOnDestroy() {
    removeEventListener('scroll', this.onScroll);
    this.script?.remove();
  }

  toggleMenu() {
    document.body.classList.toggle('menu-open');
  }

  onMenuClick(e: Event) {
    if ((e.target as HTMLElement).closest('a')) document.body.classList.remove('menu-open');
  }

  setLang(l: 'fr' | 'en') {
    document.documentElement.lang = l;
    document.querySelectorAll<HTMLElement>('[data-en]').forEach(e => {
      if (e.dataset['fr'] === undefined) e.dataset['fr'] = e.innerHTML;
      e.innerHTML = l === 'en' ? e.dataset['en']! : e.dataset['fr']!;
    });
    document.querySelectorAll('.lang button').forEach(b =>
      b.classList.toggle('on', b.textContent!.toLowerCase() === l));
  }
}
