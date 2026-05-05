import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeroComponent } from '../components/hero/hero.component';
import { StatsBarComponent } from '../components/stats-bar/stats-bar.component';
import { PresentationComponent } from '../components/presentation/presentation.component';
import { ParcoursComponent } from '../components/parcours/parcours.component';
import { InscriptionsComponent } from '../components/inscriptions/inscriptions.component';
import { InfosPratiquesComponent } from '../components/infos-pratiques/infos-pratiques.component';
import { PalmaresComponent } from '../components/palmares/palmares.component';
import { SponsorsComponent } from '../components/sponsors/sponsors.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    HeroComponent,
    StatsBarComponent,
    PresentationComponent,
    ParcoursComponent,
    InscriptionsComponent,
    InfosPratiquesComponent,
    PalmaresComponent,
    SponsorsComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
