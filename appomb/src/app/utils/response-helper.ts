export class ResponseError {

  get status() {
    return this._status;
  }

  get json() {
    return this._json;
  }

  get response() {
    return this._response;
  }

  private _response;
  private _json;
  private _status;

  constructor(response: Response) {
    this._response = response;
    try {
      this._json = response;
    } catch (e) {
      console.error(e);
    }
    this._status = response.status;
  }

  isError(errorCode?: string) {
    if (errorCode && this.getErrorCode()) {
      return this.getErrorCode() == errorCode;
    }
    if (!errorCode) {
      return !this._response.ok;
    }
    return false;
  }

  getErrorCode() {
    if (this._json) {
      return this._json.error_code;
    }
  }

  getErrorMessage() {
    if (this._json) {
      return this._json.detail;
    }
  }

  isFormValidationError() {
    return this.status === 400 && this._json && this._json.error_code == "validation_error";
  }

}
