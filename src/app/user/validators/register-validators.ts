import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        console.error('Form control can not be found in the form group.');
        return { controlNotFound: true };
      }

      const match = control.value === matchingControl.value;
      const error = match ? null : { noMatch: true };

      matchingControl.setErrors(error);
      return error;
    };
  }

  static passwordEasy(group: AbstractControl): ValidationErrors | null {
    const control = group.get('password');

    if (control && control.value === 'Pa$$w0rd') {
      const error = { easy: true };
      control.setErrors(error);
      return error;
    }
    return null;
  }
}
