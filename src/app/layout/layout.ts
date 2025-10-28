import { Component, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, ButtonModule],
  templateUrl: './layout.html',
})
export default class Layout implements OnInit {
  currentTime: Date = new Date();
  estadoClima: string = 'Soleado';
  temperatura: number = 25;
  iconoClima: string = 'pi pi-sun'; // icono de PrimeIcons

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

   actualizarClima() {
    const estados = [
      { icono: 'pi pi-sun', texto: 'Soleado', temp: 25 },
      { icono: 'pi pi-cloud', texto: 'Nublado', temp: 22 },
      { icono: 'pi pi-cloud-rain', texto: 'Lluvioso', temp: 18 },
      { icono: 'pi pi-moon', texto: 'Despejado', temp: 20 },
    ];
    const climaAleatorio = estados[Math.floor(Math.random() * estados.length)];
    this.estadoClima = climaAleatorio.texto;
    this.temperatura = climaAleatorio.temp;
    this.iconoClima = climaAleatorio.icono;
  }
}
