import { Component } from '@angular/core';
import { WelcomeComponent } from '../components/welcome.component';

@Component({
  standalone: true,
  imports: [WelcomeComponent],
  template: ` <game-welcome /> `,
})
export default class GameComponent {}
