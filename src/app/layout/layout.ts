import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { WeatherService } from '@services/weather.service';
import { Esp32Service } from '@services/esp32.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, ButtonModule, ToastModule],
  templateUrl: './layout.html',
  providers: [MessageService],
})
export default class Layout implements OnInit {
  public weatherService = inject(WeatherService);
  public messageService = inject(MessageService);
  public esp32Service = inject(Esp32Service);

  currentTime: Date = new Date();
  estadoClima: string = 'Cargando...';
  temperatura: number = 0;
  iconoClima: string = 'pi pi-spin pi-spinner';

  public temperaturaSensor: number = 0;
  public humedadSensor: number = 0;

  lucesCasa: boolean = false;
  lucesGaraje: boolean = true;
  garajeAbierto: boolean = true;
  alarmaActiva: boolean = true;

  public loadingDoor: boolean = false;

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    this.actualizarClima();
    setInterval(() => this.actualizarClima(), 300000);
    this.obtenerSensor();
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

  obtenerSensor() {
    this.esp32Service.getSensorData().subscribe({
      next: (data) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'La conexión se reailzó con exito',
          life: 3000,
        });

        this.temperaturaSensor = data.temperatura;
        this.humedadSensor = data.humedad;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pude conectar',
          life: 3000,
        });
      },
    });
  }

  openDoor() {
    this.loadingDoor = true;
    this.esp32Service.abrirChapa().subscribe(
      (res) => {
        this.loadingDoor = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'La puerta se ha abierto correctamente.',
          life: 3000,
        });
        console.log(res);
      },
      (err) => {
        this.loadingDoor = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo abrir la puerta. Inténtalo de nuevo.',
          life: 3000,
        });
      }
    );
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
