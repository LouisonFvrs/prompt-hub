import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'
import { InputText } from 'primeng/inputtext'
import { Password } from 'primeng/password'
import { AuthService } from '../auth-service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, Card, Button, InputText, Password],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  authService = inject(AuthService)
  router: Router = inject(Router)
  mode = signal<'login' | 'register'>('login')

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  })

  toggleMode() {
    this.mode.update((mode) => (mode === 'login' ? 'register' : 'login'))
  }

  submit() {
    this.form.markAsTouched()
    if (!this.form.valid) return

    const { username, password } = this.form.getRawValue()
    if (this.mode() === 'login') {
      console.log(this.form.getRawValue())
      this.login(username, password)
    } else {
      this.register(username, password)
    }
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe(() => {
      void this.router.navigate(['/'])
    })
  }
  register(username: string, password: string) {
    this.authService.register(username, password).subscribe(() => {
      void this.router.navigate(['/'])
    })
  }
}
