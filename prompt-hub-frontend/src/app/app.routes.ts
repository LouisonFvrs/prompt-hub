import { Routes } from '@angular/router'
import { PromptList } from './prompts/prompt-list/prompt-list'
import { PromptFormComponent } from './prompts/prompt-form/prompt-form.component'

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  {    path: 'prompts', component: PromptList  },
  {    path: 'prompts/create', component: PromptFormComponent  }
]
