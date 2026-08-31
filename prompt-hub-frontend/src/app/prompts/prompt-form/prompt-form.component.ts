import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card'
import { InputText } from 'primeng/inputtext'
import { Textarea } from 'primeng/textarea'
import { Select } from 'primeng/select'
import { CategoryServiceService } from '../category-service.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from 'primeng/button'
import { PromptService } from '../prompt-service'
import { Prompt } from '../prompt.model'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-prompt-form',
  standalone: true,
  imports: [Card, InputText, Textarea, Select, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './prompt-form.component.html',
  styleUrl: './prompt-form.component.scss',
})
export class PromptFormComponent {
  router = inject(Router)
  promptService = inject(PromptService)
  categoryService = inject(CategoryServiceService)

  categories = toSignal(this.categoryService.getCategories())

  form = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.maxLength(30)], nonNullable: true }),
    content: new FormControl('', { validators: [Validators.required, Validators.minLength(20)], nonNullable: true }),
    categoryId: new FormControl(-1, { validators:[Validators.required, Validators.min(0)], nonNullable: true }),
  })

  submit() {
    this.form.markAsTouched()
    if(this.form.invalid) return
    const prompt = this.form.getRawValue()
    this.promptService.createPrompt(prompt).subscribe()
    void this.router.navigate(['/'])
  }
}
