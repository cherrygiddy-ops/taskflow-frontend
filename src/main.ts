import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const currentUrl = new URL(window.location.href);
if (currentUrl.searchParams.has('utm_source')) {
  currentUrl.searchParams.delete('utm_source');
  window.history.replaceState(
    window.history.state,
    '',
    `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
  );
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
