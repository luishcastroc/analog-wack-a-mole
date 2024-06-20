import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'game-score',
  standalone: true,
  template: `<img
      class="absolute left-0 z-[2] h-10 w-10 md:h-12 md:w-12"
      src="/img/icon_score.png"
      alt="Score icon, a tiny golden coin" />
    <div
      class="absolute left-[20px] right-[5px] flex h-6 max-w-[8rem] items-center justify-center rounded-[13px] bg-white text-[0.8rem] md:text-[1rem]">
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
