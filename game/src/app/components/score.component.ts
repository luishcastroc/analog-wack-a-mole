import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'game-score',
  standalone: true,
  template: `<img
      src="/img/icon_score.png"
      alt="Score icon, a tiny golden coin" />
    <div class="score-container">{{ score() }}</div>`,
  styles: `
    :host {
      position: relative;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      position: absolute;
      left: 0;
      width: 3rem;
      height: 3rem;
      z-index: 2;
    }

    .score-container {
      height: 1.5rem;
      position: absolute;
      left: 20px;
      right: 5px;
      background-color: white;
      border-radius: 13px;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  score = input.required<number>();
}
