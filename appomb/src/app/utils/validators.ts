import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as CPF from 'gerador-validador-cpf';

export function validateFullName(control: AbstractControl): ValidationErrors | null {
  if (!control) {
    return null;
  }
  const val = control.value;
  if (typeof val === 'string' && val.split(' ').length > 1 && val.split(' ')[1] && val.split(' ')[1].length > 0) {
    return null;
  }
  return {
    validateFullName: {
      valid: false
    }
  }
}

export function validateCPF(control: AbstractControl): ValidationErrors | null {
  if (!control) {
    return null;
  }
  const val = control.value;
  if (typeof val === 'string' && CPF.validate(val)) {
    return null;
  }
  return {
    validateCPF: {
      valid: false
    }
  }
}