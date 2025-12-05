import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { InteractiveSystemsPreset } from './primeng/interactive-systems-preset';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        // Set our customized theme defined in app/primeng/interactive-systems-preset.ts
        preset: InteractiveSystemsPreset,
        options: {
          // Disable dark mode
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
