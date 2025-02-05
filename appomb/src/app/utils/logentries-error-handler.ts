import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../providers/logger-service';
import * as Logger from 'bunyan';

@Injectable()
export class LogentriesErrorHandler implements ErrorHandler {
  private logger: Logger;

  constructor(private loggerService: LoggerService) {
    this.logger = this.loggerService.create('general_error_handler');
  }

  handleError(error: any): void {
    // Loga o erro no console
    console.error('An error occurred:', error);

    // Loga o erro usando o LoggerService
    try {
      this.logger.error(error);
    } catch (e) {
      console.error('Failed to log the error:', e);
    }

    // Opcional: Adicione lógica para rastrear erros remotamente ou exibir mensagens de erro amigáveis
  }
}
