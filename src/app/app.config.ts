import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID, isDevMode,
} from '@angular/core';
import {
  RouterModule,
  RouterOutlet,
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './presets/primarypreset';

import localeEsBO from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';
import { provideServiceWorker } from '@angular/service-worker';
registerLocaleData(localeEsBO);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-BO' },
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    provideRouter(
      routes,
      withViewTransitions({
        onViewTransitionCreated() {},
      })
    ),
    importProvidersFrom(
      HttpClientModule,
      BrowserModule,
      RouterModule,
      BrowserAnimationsModule
    ), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
