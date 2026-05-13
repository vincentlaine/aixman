import { AfterViewInit, Component, HostListener, signal } from '@angular/core';
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
    setTimeout(() => {
      this.maps[disc]?.invalidateSize();
    }, 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    const disc = this.activeDiscipline();
    this.maps[disc]?.invalidateSize();
  }

  private initMaps(): void {
    this.maps.swim = this.initSwimMap();
    this.maps.bike = this.initBikeMap();
    this.maps.run = this.initRunMap();
  }

  private tileLayer(): L.TileLayer {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 17,
    });
  }

  private initSwimMap(): L.Map {
    const map = L.map('map-swim', { zoomControl: true, scrollWheelZoom: false });
    this.tileLayer().addTo(map);
    map.setView([45.684, 5.892], 13);

    // Real GPX track — boucle en eau libre dans le Lac du Bourget, Grand Port Aix-les-Bains
    const coords: L.LatLngTuple[] = [
      [45.68861, 5.895],
      [45.6881, 5.89402],
      [45.68738, 5.89262],
      [45.684015, 5.89205],
      [45.68065, 5.89148],
      [45.6806, 5.89319],
      [45.684143, 5.89405],
      [45.6868, 5.89469],
      [45.68861, 5.895],
    ];
    L.polyline(coords, { color: '#2b9ed4', weight: 4, opacity: 0.9, dashArray: '8,4' }).addTo(map);
    L.circleMarker([45.68861, 5.895], {
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
    map.setView([45.73, 5.87], 11);

    // Approximate route — 100 km, 2 000 m D+, tour du lac & massif des Bauges (2 boucles)
    const coords: L.LatLngTuple[] = [
      [45.68889, 5.89547],
      [45.6935, 5.888],
      [45.699, 5.878],
      [45.707, 5.871],
      [45.715, 5.866],
      [45.724, 5.863],
      [45.732, 5.862],
      [45.741, 5.862],
      [45.749, 5.864],
      [45.757, 5.868],
      [45.763, 5.872],
      [45.769, 5.872],
      [45.775, 5.868],
      [45.779, 5.861],
      [45.782, 5.852],
      [45.782, 5.842],
      [45.778, 5.833],
      [45.772, 5.825],
      [45.765, 5.818],
      [45.757, 5.814],
      [45.748, 5.812],
      [45.74, 5.814],
      [45.732, 5.818],
      [45.726, 5.825],
      [45.721, 5.833],
      [45.717, 5.842],
      [45.714, 5.851],
      [45.713, 5.862],
      [45.714, 5.873],
      [45.718, 5.882],
      [45.724, 5.893],
      [45.729, 5.905],
      [45.732, 5.917],
      [45.733, 5.929],
      [45.731, 5.941],
      [45.726, 5.952],
      [45.719, 5.961],
      [45.711, 5.967],
      [45.703, 5.97],
      [45.695, 5.969],
      [45.688, 5.963],
      [45.682, 5.954],
      [45.678, 5.943],
      [45.676, 5.931],
      [45.677, 5.918],
      [45.681, 5.907],
      [45.68889, 5.89547],
    ];
    L.polyline(coords, { color: '#e07b2a', weight: 4, opacity: 0.9 }).addTo(map);
    L.circleMarker([45.68889, 5.89547], {
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
    map.setView([45.692, 5.944], 12);

    // Real GPX track — montée du Mont Revard depuis Grand Port, 13 km / 1 200 m D+
    const coords: L.LatLngTuple[] = [
      [45.68973, 5.90366],
      [45.68961, 5.90379],
      [45.68856, 5.90448],
      [45.68655, 5.9057],
      [45.68552, 5.90637],
      [45.68543, 5.90783],
      [45.68555, 5.90983],
      [45.68566, 5.91009],
      [45.6856, 5.91039],
      [45.68579, 5.9123],
      [45.68601, 5.91334],
      [45.68611, 5.91409],
      [45.68629, 5.91422],
      [45.68668, 5.91449],
      [45.68684, 5.91529],
      [45.68647, 5.91583],
      [45.68694, 5.91627],
      [45.68613, 5.91661],
      [45.68516, 5.91689],
      [45.68439, 5.91741],
      [45.68386, 5.91752],
      [45.68345, 5.91739],
      [45.68353, 5.9177],
      [45.68297, 5.91713],
      [45.68218, 5.91651],
      [45.6818, 5.91651],
      [45.68158, 5.91596],
      [45.68104, 5.91594],
      [45.6804, 5.91687],
      [45.68016, 5.91765],
      [45.68001, 5.91803],
      [45.68014, 5.91823],
      [45.68084, 5.91844],
      [45.68095, 5.91868],
      [45.68122, 5.91887],
      [45.68122, 5.91915],
      [45.68111, 5.91962],
      [45.68135, 5.91981],
      [45.68202, 5.9211],
      [45.6832, 5.92307],
      [45.68334, 5.9248],
      [45.68224, 5.92615],
      [45.68099, 5.92748],
      [45.68013, 5.92867],
      [45.68016, 5.92896],
      [45.68042, 5.92943],
      [45.68014, 5.93072],
      [45.6801, 5.9316],
      [45.67995, 5.93271],
      [45.67987, 5.93315],
      [45.68031, 5.93326],
      [45.68062, 5.93372],
      [45.68134, 5.93368],
      [45.68201, 5.9345],
      [45.68254, 5.93456],
      [45.68256, 5.93476],
      [45.68251, 5.93496],
      [45.6828, 5.93527],
      [45.68311, 5.93493],
      [45.68333, 5.9352],
      [45.68336, 5.93555],
      [45.68377, 5.93557],
      [45.68419, 5.93567],
      [45.68434, 5.9363],
      [45.685, 5.93617],
      [45.68536, 5.9362],
      [45.68538, 5.93842],
      [45.6854, 5.93849],
      [45.68518, 5.93855],
      [45.68525, 5.93864],
      [45.68489, 5.94058],
      [45.68466, 5.9418],
      [45.6847, 5.94265],
      [45.68584, 5.94507],
      [45.686, 5.94539],
      [45.68666, 5.94675],
      [45.68699, 5.94729],
      [45.6882, 5.94775],
      [45.68863, 5.94828],
      [45.68936, 5.94854],
      [45.68951, 5.94872],
      [45.68992, 5.95004],
      [45.6898, 5.95155],
      [45.69009, 5.95201],
      [45.6903, 5.95205],
      [45.69007, 5.95218],
      [45.68992, 5.95243],
      [45.69101, 5.95468],
      [45.69122, 5.95549],
      [45.69104, 5.95676],
      [45.69072, 5.95876],
      [45.69143, 5.96032],
      [45.69157, 5.96095],
      [45.69195, 5.96266],
      [45.69294, 5.96512],
      [45.69393, 5.96716],
      [45.6947, 5.96918],
      [45.6948, 5.97088],
      [45.6949, 5.97314],
      [45.69492, 5.97368],
      [45.69453, 5.97493],
      [45.69458, 5.97586],
      [45.69517, 5.9777],
      [45.69541, 5.97971],
      [45.69589, 5.98239],
      [45.69606, 5.98304],
      [45.6959, 5.98379],
      [45.69542, 5.98473],
      [45.69499, 5.98715],
      [45.69559, 5.98882],
      [45.696, 5.99003],
      [45.69677, 5.99065],
      [45.69724, 5.99092],
      [45.69787, 5.99084],
      [45.69836, 5.99119],
      [45.69847, 5.99208],
      [45.69822, 5.99264],
      [45.69777, 5.99288],
      [45.69709, 5.99233],
      [45.69665, 5.99216],
      [45.69549, 5.9924],
      [45.69415, 5.9915],
      [45.69261, 5.99002],
      [45.69128, 5.98761],
      [45.69052, 5.98681],
      [45.6896, 5.98535],
      [45.68869, 5.98388],
      [45.68758, 5.98291],
      [45.686, 5.98301],
      [45.6851, 5.98142],
      [45.68611, 5.97976],
      [45.68641, 5.9783],
      [45.6864, 5.97774],
      [45.68593, 5.97783],
      [45.68542, 5.97734],
      [45.6849, 5.97645],
      [45.68447, 5.9764],
      [45.6841, 5.97567],
      [45.68376, 5.97581],
      [45.68349, 5.97561],
      [45.68306, 5.97584],
      [45.68271, 5.97568],
      [45.68156, 5.97481],
    ];
    L.polyline(coords, { color: '#2e8b57', weight: 4, opacity: 0.9 }).addTo(map);
    L.circleMarker([45.68973, 5.90366], {
      radius: 8,
      color: '#fff',
      fillColor: '#2e8b57',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup('<b>Départ Course à pied</b><br>Grand Port · Aix-les-Bains · 241m')
      .addTo(map);
    L.circleMarker([45.68156, 5.97481], {
      radius: 8,
      color: '#fff',
      fillColor: '#2e8b57',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup('<b>Arrivée</b><br>Mont Revard · ~1 510m')
      .addTo(map);

    return map;
  }
}
