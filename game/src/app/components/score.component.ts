import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'game-score',
  standalone: true,
  template: `<img
      class="absolute left-0 z-[2] h-12 w-12"
      src="/img/icon_score.png"
      alt="Score icon, a tiny golden coin" />
    <div
      class="absolute left-[20px] right-[5px] flex h-6 max-w-[8rem] items-center justify-center rounded-[13px] bg-white">
      {{ score() }}
    </div>`,
  styles: `
    :host {
      @apply relative flex flex-1 items-center justify-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  score = input.required<number>();
}
