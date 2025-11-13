import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Esp32Service {

  // Cambia esta IP si tu ESP32 usa otra
  private baseUrl = 'http://192.168.1.25';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los valores de temperatura y humedad del ESP32
   */
  getSensorData(): Observable<{ temperatura: number, humedad: number }> {
    return this.http.get<{ temperatura: number, humedad: number }>(`${this.baseUrl}/sensor`);
  }

  /**
   * Envía una solicitud para abrir la chapa
   */
  abrirChapa(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrl}/abrir`);
  }


}
