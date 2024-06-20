import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'game-game-over',
  standalone: true,
  template: `<div class="clear-screen">
    <div class="cleared-level-container">
      <span class="cleared-level-text">Level</span>
      <span class="cleared-level-text">{{ level() }}</span>
    </div>

    <div class="panel">
      <span class="panel-title">Game Over</span>
      <span class="panel-text">Score: {{ score() }}</span>

      <div class="panel-buttons-container">
        <button class="panel-button" (click)="reset.emit()">
          <img
            class="panel-button-icon"
            [src]="'img/icon_restart.png'"
            alt="Restart Icon" />
        </button>
      </div>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverComponent {
  level = input.required<number>();
  score = input.required();
  reset = output();
}
