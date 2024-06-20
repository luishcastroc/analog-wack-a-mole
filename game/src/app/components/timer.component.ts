import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'game-timer',
  standalone: true,
  template: `<img
      src="/img/icon_time.png"
      alt="Time icon, a tiny clock"
      class="absolute left-0 z-[2] h-10 w-10 md:h-12 md:w-12" />
    <div
      class="absolute left-[20px] right-[5px] flex h-6 max-w-[8rem] items-center justify-center rounded-[13px] bg-white text-[0.8rem] md:text-[1rem]">
      {{ time() }}
    </div>`,
  styles: `
    :host {
      @apply relative flex flex-1 items-center justify-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent {
  time = input.required<number>();
}
