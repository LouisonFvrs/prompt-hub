import { Component, effect, inject, input } from '@angular/core'
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
import { MessageService } from 'primeng/api'
import { from } from 'rxjs'

@Component({
  selector: 'app-prompt-form',
  standalone: true,
  imports: [Card, InputText, Textarea, Select, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './prompt-form.component.html',
  styleUrl: './prompt-form.component.scss',
})
export class PromptFormComponent {
  message = inject(MessageService)
  router = inject(Router)
  promptService = inject(PromptService)
  categoryService = inject(CategoryServiceService)

  promptId = input<number>()

  categories = toSignal(this.categoryService.getCategories())

  form = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.maxLength(30)], nonNullable: true }),
    content: new FormControl('', { validators: [Validators.required, Validators.minLength(20)], nonNullable: true }),
    categoryId: new FormControl(-1, { validators:[Validators.required, Validators.min(0)], nonNullable: true }),
  })

  constructor() {
    effect(() => {
      const promptId = this.promptId()
      if(promptId) {
        this.promptService.getPrompt(promptId).subscribe(prompt => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            categoryId: prompt.category.id
          })
        })
      }
    })
  }

  submit() {
    this.form.markAsTouched()
    if (this.form.invalid) return

    const prompt = this.form.getRawValue()

    const request$ = this.promptId()
      ? this.promptService.updatePrompt(this.promptId()!, prompt)
      : this.promptService.createPrompt(prompt)

    request$.subscribe(() => {
      this.message.add({ severity: 'success', summary: 'Success', detail: 'Prompt saved successfully' })
      void this.router.navigate(['/'])
    })
  }

  delete() {
    const id = this.promptId()
    if (id) {
      this.promptService.deletePrompt(id).subscribe(() => {
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Prompt deleted successfully',
        })
        void this.router.navigate(['/'])
      })
    }
  }
}
