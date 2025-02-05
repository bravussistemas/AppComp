import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Logger from 'bunyan';
import { AppConfig } from '../../configs';
import { LogentriesLogger } from './logentries-bunyan-stream';

@Injectable({
  providedIn: 'root', // Escopo global do serviço
})
export class LoggerService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  public create(name: string): Logger {
    return Logger.createLogger({
      name: name,
      streams: [
        {
          stream: new LogentriesLogger(this.appConfig.LOGENTRIES_TOKEN, this.http),
          type: 'raw',
        },
      ],
    });
  }
}
