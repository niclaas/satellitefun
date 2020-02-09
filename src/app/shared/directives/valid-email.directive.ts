import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { emailValidator } from '../../auth/valid-email.validator';

@Directive({
  selector: '[appValidEmail]',
  providers: [{provide: NG_VALIDATORS, useExisting: ValidEmailDirective, multi: true}]
})
export class ValidEmailDirective implements Validator {
  validate(control: AbstractControl): {[key: string]: any} | null {
    return emailValidator(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'i'))(control);
  }
}
