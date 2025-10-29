import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=-17.9833&longitude=-67.15&current_weather=true' +
    '&temperature_unit=celsius&timezone=America/La_Paz';

  constructor(private http: HttpClient) {}

  getCurrentWeather(): Observable<any> {
    return this.http.get(this.url);
  }
}
