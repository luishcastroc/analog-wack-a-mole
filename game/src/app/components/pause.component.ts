import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'game-pause',
  standalone: true,
  template: `<div class="clear-screen">
    <div class="panel">
      <span class="panel-title">Ready?</span>

      <div class="panel-buttons-container">
        <div class="panel-button" (click)="reset.emit()">
          <img
            class="panel-button-icon"
            [src]="'/img/icon_restart.png'"
            alt="Restart Icon" />
        </div>
        <div class="panel-button" (click)="resume.emit()">
          <img
            class="panel-button-icon"
            [src]="'/img/icon_play.png'"
            alt="Play Icon" />
        </div>
      </div>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseComponent {
  reset = output();
  resume = output();
}
