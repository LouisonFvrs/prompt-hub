import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Prompt } from './prompt.model'
import { environment } from '../../environments/environment'
import { Category } from './category.model'

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  httpClient = inject(HttpClient)
  baseUrl = environment.apiUrl + 'prompts'

  getPrompts() {
    return this.httpClient.get<Prompt[]>(this.baseUrl)
  }

  getPrompt(id: number) {
    return this.httpClient.get<Prompt>(`${this.baseUrl}/${id}`)
  }

  createPrompt(prompt: {title: string, content: string, categoryId: number}) {
    return this.httpClient.post<Prompt>(`${this.baseUrl}`, prompt)
  }

  updatePrompt(promptId: number, prompt: {title: string, content: string, categoryId: number}) {
    return this.httpClient.put<Prompt>(`${this.baseUrl}/${promptId}`, prompt)
  }

  deletePrompt(promptId: number) {
    return this.httpClient.delete<Prompt>(`${this.baseUrl}/${promptId}`)
  }
}
