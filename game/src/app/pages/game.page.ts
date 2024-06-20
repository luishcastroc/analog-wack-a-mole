import { Component } from '@angular/core';

import { GameContainerComponent } from '../components/game-container.component';

@Component({
  standalone: true,
  imports: [GameContainerComponent],
  template: ` <game-container /> `,
})
export default class GameComponent {}
