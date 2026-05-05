import { AfterViewInit, Component, signal } from '@angular/core';
import * as L from 'leaflet';

export type Discipline = 'swim' | 'bike' | 'run';

@Component({
  selector: 'app-parcours',
  templateUrl: './parcours.component.html',
  styleUrl: './parcours.component.css',
})
export class ParcoursComponent implements AfterViewInit {
  protected readonly activeDiscipline = signal<Discipline>('swim');

  private maps: Partial<Record<Discipline, L.Map>> = {};

  ngAfterViewInit(): void {
    this.initMaps();
  }

  switchDiscipline(disc: Discipline): void {
    this.activeDiscipline.set(disc);
    // Allow Angular to update the DOM (show/hide via CSS), then invalidate size
    setTimeout(() => {
      this.maps[disc]?.invalidateSize();
    }, 50);
  }

  private initMaps(): void {
    this.maps.swim = this.initSwimMap();
    this.maps.bike = this.initBikeMap();
    this.maps.run = this.initRunMap();
  }

  private tileLayer(): L.TileLayer {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 16,
    });
  }

  private initSwimMap(): L.Map {
    const map = L.map('map-swim', { zoomControl: true, scrollWheelZoom: false });
    this.tileLayer().addTo(map);
    map.setView([45.692, 5.897], 13);

    const coords: L.LatLngTuple[] = [
      [45.697, 5.888],
      [45.7, 5.9],
      [45.695, 5.91],
      [45.688, 5.905],
      [45.686, 5.893],
      [45.691, 5.883],
      [45.697, 5.888],
    ];
    L.polyline(coords, { color: '#2b9ed4', weight: 4, opacity: 0.9, dashArray: '8,4' }).addTo(map);
    L.circleMarker([45.697, 5.888], {
      radius: 8,
      color: '#fff',
      fillColor: '#2b9ed4',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup('<b>Départ/Arrivée Natation</b><br>Grand Port · Aix-les-Bains')
      .addTo(map);

    return map;
  }

  private initBikeMap(): L.Map {
    const map = L.map('map-bike', { zoomControl: true, scrollWheelZoom: false });
    this.tileLayer().addTo(map);
    map.setView([45.72, 5.87], 11);

    const coords: L.LatLngTuple[] = [
      [45.697, 5.888],
      [45.71, 5.89],
      [45.73, 5.875],
      [45.755, 5.862],
      [45.775, 5.843],
      [45.79, 5.83],
      [45.8, 5.81],
      [45.805, 5.79],
      [45.795, 5.775],
      [45.775, 5.76],
      [45.755, 5.758],
      [45.74, 5.77],
      [45.72, 5.79],
      [45.705, 5.81],
      [45.69, 5.84],
      [45.678, 5.87],
      [45.683, 5.89],
      [45.697, 5.888],
    ];
    L.polyline(coords, { color: '#e07b2a', weight: 4, opacity: 0.9 }).addTo(map);
    L.circleMarker([45.697, 5.888], {
      radius: 8,
      color: '#fff',
      fillColor: '#e07b2a',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup('<b>Transition T1/T2</b><br>Grand Port · Aix-les-Bains')
      .addTo(map);

    return map;
  }

  private initRunMap(): L.Map {
    const map = L.map('map-run', { zoomControl: true, scrollWheelZoom: false });
    this.tileLayer().addTo(map);
    map.setView([45.72, 5.895], 12);

    const coords: L.LatLngTuple[] = [
      [45.697, 5.888],
      [45.7, 5.892],
      [45.706, 5.897],
      [45.712, 5.902],
      [45.718, 5.908],
      [45.723, 5.912],
      [45.728, 5.915],
      [45.733, 5.916],
      [45.737, 5.912],
      [45.74, 5.908],
      [45.742, 5.903],
      [45.745, 5.898],
      [45.748, 5.896],
    ];
    L.polyline(coords, { color: '#2e8b57', weight: 4, opacity: 0.9 }).addTo(map);
    L.circleMarker([45.697, 5.888], {
      radius: 8,
      color: '#fff',
      fillColor: '#2e8b57',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup('<b>Départ Course</b><br>Grand Port · Aix-les-Bains')
      .addTo(map);
    L.circleMarker([45.748, 5.896], {
      radius: 8,
      color: '#fff',
      fillColor: '#2e8b57',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup('<b>Arrivée</b><br>Mont Revard · 1 562m')
      .addTo(map);

    return map;
  }
}
