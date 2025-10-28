import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { WeatherService } from '@services/weather.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, ButtonModule],
  templateUrl: './layout.html',
})
export default class Layout implements OnInit {
  public weatherService = inject(WeatherService);

  currentTime: Date = new Date();
  estadoClima: string = 'Cargando...';
  temperatura: number = 0;
  iconoClima: string = 'pi pi-spin pi-spinner';

  lucesCasa: boolean = false;
  lucesGaraje: boolean = true;
  garajeAbierto: boolean = true;
  alarmaActiva: boolean = true;

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    this.actualizarClima();
    setInterval(() => this.actualizarClima(), 300000);
  }

  actualizarClima() {
    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        const clima = data.current_weather;
        this.temperatura = Math.round(clima.temperature);

        const mapped = this.mapWeatherCode(clima.weathercode);
        this.estadoClima = mapped.texto;
        this.iconoClima = mapped.icono;
      },
      error: (err) => {
        console.error('Error al obtener clima:', err);
        this.estadoClima = 'Error al cargar';
        this.iconoClima = 'pi pi-exclamation-triangle';
      },
    });
  }

  toggleLucesCasa() {
    this.lucesCasa = !this.lucesCasa;
  }

  toggleLucesGaraje() {
    this.lucesGaraje = !this.lucesGaraje;
  }

  toggleGaraje() {
    this.garajeAbierto = !this.garajeAbierto;
  }

  toggleAlarma() {
    this.alarmaActiva = !this.alarmaActiva;
  }

  private mapWeatherCode(code: number) {
    if (code === 0) return { texto: 'Despejado', icono: 'pi pi-sun' };
    if (code >= 1 && code <= 3)
      return { texto: 'Parcialmente nublado', icono: 'pi pi-cloud' };
    if (code >= 45 && code <= 48)
      return { texto: 'Niebla', icono: 'pi pi-cloud' };
    if (code >= 51 && code <= 57)
      return { texto: 'Llovizna', icono: 'pi pi-cloud-rain' };
    if (code >= 61 && code <= 67)
      return { texto: 'Lluvia', icono: 'pi pi-cloud-rain' };
    if (code >= 71 && code <= 77)
      return { texto: 'Nieve', icono: 'pi pi-snow' };
    if (code >= 80 && code <= 82)
      return { texto: 'Chubascos', icono: 'pi pi-cloud-showers' };
    if (code >= 95 && code <= 99)
      return { texto: 'Tormenta', icono: 'pi pi-bolt' };
    return { texto: 'Condición desconocida', icono: 'pi pi-question' };
  }
}
