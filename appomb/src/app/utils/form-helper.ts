import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import { Utils } from './utils';

export class FormHelper {
  constructor(private form: FormGroup) {
  }

  setValidators(controlPath: string, validators: ValidatorFn[] | null) {
    const control = <FormControl>this.getControl(controlPath);
    control.setValidators(validators);
    if (Utils.isNullOrUndefined(validators)) {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  mapControls(controlPath: string, callback: Function) {
    const control = this.getControl(controlPath);
    if (control instanceof FormGroup) {
      for (const field in control.controls) {
        if (control.controls.hasOwnProperty(field)) {
          callback(control.controls[field]);
        }
      }
      return;
    }
    if (control instanceof FormControl) {
      callback(control);
      return;
    }
    throw new Error(`Control path not found: ${controlPath}`);
  }

  getControl(controlPath: string, form?: FormGroup): FormControl | FormGroup {
    const pathList = controlPath.split('.');
    const key = pathList.reverse().pop();
    const control = <any>(form || this.form).get(key);
    if (pathList.length === 0) {
      return control;
    }
    return this.getControl(pathList.join('.'), <FormGroup>control);
  }

  disable(controlPath: string) {
    this.getControl(controlPath).disable();
  }
}
