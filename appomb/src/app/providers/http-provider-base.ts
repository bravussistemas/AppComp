import URI from 'urijs';
import { Observable, throwError } from 'rxjs';
import { Injector } from '@angular/core';
import { ResponseError } from '../utils/response-helper';
import { TranslateService } from '@ngx-translate/core';
import { ToastHelper } from '../utils/toast-helper';
import { AlertHelper } from '../utils/alert-helper';
import { LoadingHelper } from '../utils/loading-helper';
import { ENV } from '@environment';
import { AuthUserHttp } from './auth-user-http';

export abstract class HttpProviderBase {
  protected client: AuthUserHttp;
  protected toastHelper: ToastHelper;
  protected alertHelper: AlertHelper;
  protected loadingHelper: LoadingHelper;
  protected trans: TranslateService;

  private basePath: string;

  protected constructor(injector: Injector) {
    this.client = injector.get(AuthUserHttp);
    this.toastHelper = injector.get(ToastHelper);
    this.alertHelper = injector.get(AlertHelper);
    this.loadingHelper = injector.get(LoadingHelper);
    this.trans = injector.get(TranslateService);
  }

  setBasePath(basePath: string) {
    this.basePath = basePath;
  }

  buildUrl(value: { path?: string, vars?: { [key: string]: string } }): string {
    const paths = [];
  
    // Add base path if defined
    if (this.basePath) {
      paths.push(this.basePath);
    }
  
    // Process provided path
    if (value.path) {
      if (value.vars) {
        // Expand template variables in the path using string interpolation
        Object.entries(value.vars).forEach(([key, val]) => {
          value.path = value.path.replace(`{${key}}`, encodeURIComponent(val));
        });
      }
      paths.push(value.path);
    }
  
    // Construct full URL using URI library
    return new URI(ENV.SERVER_API)
      .path(paths.join('/')) // Join paths correctly
      .toString(); // Return the URL as a string
  }

  private _handlerHttpError(error: Response) {
    console.debug('handlerHttpError', error);
    this.loadingHelper.hide();
    this.loadingHelper.clear();
    if (!error) {
      return;
    }
    if (error instanceof Response) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      const responseError = new ResponseError(error);

      if (responseError.getErrorMessage() || responseError.isFormValidationError()) {
        // handler common errors
        this.alertHelper.show(responseError.getErrorMessage() || 'Verifique os erros e tente novamente.');
      } else {
        // GENERIC SERVER ERROR
        this.toastHelper.connectionError();
      }
    }
  }

  handlerHttpError(error: Response) {
    this._handlerHttpError(error);
    return throwError(() => error);
  }
}
