import { Component } from '@angular/core';

@Component({
  selector: 'app-inscriptions',
  templateUrl: './inscriptions.component.html',
  styleUrl: './inscriptions.component.css',
})
export class InscriptionsComponent {
  onRegisterClick(event: Event): void {
    event.preventDefault();
    alert("Lien vers plateforme d'inscription à venir !");
  }
}
