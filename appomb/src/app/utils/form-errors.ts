import { FormGroup } from "@angular/forms";

/**
 * Created by alan on 23/04/17.
 */
export interface ValidationMessages {
  [key: string]: { [key: string]: string }
}

export class FormErrors {
  form: FormGroup;
  submitted = false;
  validationMessages: ValidationMessages;
  private formErrors: Object = {};

  constructor(form: FormGroup, validationMessages: any) {
    this.validationMessages = validationMessages;
    this.setupForm(form);
  }

  // todo: translate
  defaultMessages = {
    "required": "Este campo é obrigatório",
    "validateFullName": "Favor informar ao menos um sobrenome.",
    "validateCPF": "Favor informar um CPF válido."
  };

  setupForm(form: FormGroup) {
    this.form = form;
    this.setUpInitialErrors();
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  setSubmitted() {
    this.submitted = true;
    this.onValueChanged();
  }

  setUnsubmitted(){
    this.submitted = false;
  }

  getErrors(): any {
    return this.formErrors;
  }

  private setUpInitialErrors() {
    if (!this.formErrors) {
      this.formErrors = {};
    }
    for (let field in this.form.controls) {
      if (!this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = [];
      }
    }
  }

  addError(field: string, error: string) {
    if (!this.formErrors[field]) {
      this.formErrors[field] = [];
    }
    if (this.formErrors[field] && this.formErrors[field].indexOf(error) == -1) {
      this.formErrors[field].push(error);
    }
  }

  populateMessages(field, control, messages, defaultError) {
    for (const key in control.errors) {
      if (control.errors.hasOwnProperty(key)) {
        // set a general default error message
        if (messages[key]) {
          // have a preset error
          this.addError(field, messages[key]);
          return;
        } else if (this.defaultMessages.hasOwnProperty(key)) {
          // have a default more specific error
          this.addError(field, this.defaultMessages[key]);
          return;
        } else {
          this.addError(field, defaultError);
          return;
        }
      }
    }
  }

  onValueChanged(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (const field in this.formErrors) {
      this.formErrors[field] = [];
      const control = form.get(field);
      if (control && !control.valid) {
        const messages = this.validationMessages[field] || {};
        this.populateMessages(field, control, messages, "Digite um valor válido");
      }
    }
  }

}