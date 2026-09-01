import { Component, computed, inject, input, linkedSignal } from '@angular/core'
import { Prompt } from '../prompt.model'
import { Button } from 'primeng/button'
import { Textarea } from 'primeng/textarea'
import { Tag } from 'primeng/tag'
import { Card } from 'primeng/card'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../auth/auth-service'
import { PromptService } from '../prompt-service'
import { MessageService } from 'primeng/api'
import { from } from 'rxjs'

@Component({
  selector: 'app-prompt-card',
  imports: [Button, Textarea, Tag, Card, RouterLink],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss',
})
export class PromptCard {
  message = inject(MessageService)
  router = inject(Router)
  promptService = inject(PromptService)
  authService = inject(AuthService)
  prompt = input.required<Prompt>()

  score = linkedSignal(() => this.prompt().score)
  userVote = linkedSignal(() => (this.authService.currentUser()) ? this.prompt().userVote : null)

  canEdit= computed(() => {
    const currentUser = this.authService.currentUser()
    return currentUser && currentUser.id === this.prompt().author.id
  })

  copyToClipboard() {
    from(navigator.clipboard.writeText(this.prompt().content)).subscribe(() => {
      this.message.add({ severity: 'success', summary: 'Copy', detail: 'Prompt copied to clipboard' })
    })
  }

  upvote() {
    if(!this.authService.currentUser()) {
      void this.router.navigate(['/auth'])
      return
    }
    this.promptService.upvotePrompt(this.prompt().id).subscribe((updatedPrompt) => {
      this.score.set(updatedPrompt.score)
      this.userVote.set(updatedPrompt.userVote)
    })
  }

  downvote() {
    if(!this.authService.currentUser()) {

      void this.router.navigate(['/auth'])
      return
    }
    this.promptService.downvotePrompt(this.prompt().id).subscribe((updatedPrompt) => {
      this.score.set(updatedPrompt.score)
      this.userVote.set(updatedPrompt.userVote)
    })
  }
}
