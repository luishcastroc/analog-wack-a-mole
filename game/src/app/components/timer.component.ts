import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'game-timer',
  standalone: true,
  template: `<img src="/img/icon_time.png" alt="Time icon, a tiny clock" />
    <div class="time-container">{{ time() }}</div>`,
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

    .time-container {
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
export class TimerComponent {
  time = input.required<number>();
}
