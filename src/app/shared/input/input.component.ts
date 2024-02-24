import { NgxMaskDirective } from 'ngx-mask';

import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() control: FormControl = new FormControl();
  @Input() type = 'text';
  @Input() placeholder = '';
  // NgxMaskDirective
  @Input() format = '';

  msg = {
    required: 'Field is required',
    minlength: 'Min length ',
    email: 'You must enter a valid email',
    min: 'Value too low',
    max: 'Value too high',
    pattern1: '- at least 8 characters',
    pattern2:
      '- must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    pattern3: '- can contain special characters',
    match: 'Password do not match.',
    easy: 'Password is too easy.',
  };
  // control = input<FormControl>(new FormControl());
}
