import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Required for every (standalone) Angular application.
// For info about standalone components (and a comparison to the old modules approach),
// see https://angular.io/guide/standalone-components

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
