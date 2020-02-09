import { ValidatorFn, AbstractControl } from '@angular/forms';

export function emailValidator(valRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const matched = valRe.test(control.value);
      return matched ? null : {'invalidEmail': {value: control.value}}
    };
  }