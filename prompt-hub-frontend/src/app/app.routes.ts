import { Routes } from '@angular/router'
import { PromptList } from './prompts/prompt-list/prompt-list'
import { PromptFormComponent } from './prompts/prompt-form/prompt-form.component'
import { AuthForm } from './auth/auth-form/auth-form'
import { authGuard } from './auth/auth-guard'

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  { path: 'prompts', component: PromptList },
  { path: 'prompts/create', component: PromptFormComponent, canActivate: [authGuard] },
  { path: 'prompts/:promptId/edit', component: PromptFormComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthForm },
]
