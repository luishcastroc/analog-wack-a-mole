import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'game-clear-level',
  standalone: true,
  template: `<div class="clear-screen">
    <div class="cleared-level-container">
      <span class="cleared-level-text">Level</span>
      <span class="cleared-level-text">{{ level() }}</span>
    </div>

    <div class="panel">
      <span class="panel-title">Cleared</span>
      <span class="panel-text">Score: {{ score() }}</span>

      <div class="panel-buttons-container">
        <button class="panel-button" (click)="reset.emit()">
          <img
            class="panel-button-icon"
            [src]="'/img/icon_restart.png'"
            alt="Restart Icon" />
        </button>
        <button class="panel-button" (click)="nextLevel.emit()">
          <img
            class="panel-button-icon"
            [src]="'/img/icon_play.png'"
            alt="Play Icon" />
        </button>
      </div>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearLevelComponent {
  level = input.required<number>();
  score = input.required<number>();
  nextLevel = output();
  reset = output();
}
