import { ErrorHandler, Injectable } from '@angular/core';
import Raven from 'raven-js';
import { ENV } from '@environment';
import packageJson from '../../../package.json';

const version = packageJson.version;

Raven
  .config(ENV.SENTRY_DSN,
    {
      release: version,
      dataCallback: data => {
        if (data.culprit) {
          data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
        }
        let stacktrace = data.stacktrace ||
          data.exception &&
          data.exception.values[0].stacktrace;
        if (stacktrace) {
          stacktrace.frames.forEach(function (frame) {
            frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
          });
        }
      }
    })
  .install();

export class SentryErrorHandler extends ErrorHandler {

  override handleError(error: any) {
    super.handleError(error);
    try {
      if (!ENV.DEBUG) {
        Raven.captureException(error.originalError || error);
      }
    }
    catch (e) {
      console.error(e);
    }
  }
}