import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';
import { ENV } from '@environment';
import 'hammerjs';
import { register } from 'swiper/element/bundle'; // Importar o registro do Swiper

// Registrar os Swiper custom elements
register();

if (!ENV.DEBUG) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
