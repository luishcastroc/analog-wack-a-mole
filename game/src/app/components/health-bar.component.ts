import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-health-bar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="health-bar">
      <div class="health-bar-inner" [style.width.%]="health()"></div>
    </div>
    <img
      src="/img/icon_health.png"
      alt="Health icon, a red hearth"
      class="health-icon" /> `,
  styles: `
    :host {
      position: relative;
      flex: 1;
    }

    .health-icon {
      position: absolute;
      top: -7px;
      left: 0;
      width: 3rem;
      height: 2.5rem;
    }

    .health-bar {
      height: 1.5rem;
      width: 100%;
      margin-left: 4px;
      margin-top: 1px;
      background-color: white;
      border-radius: 10px;
    }

    .health-bar-inner {
      position: absolute;
      margin-left: 4px;
      background-color: #ff1a1a;
      border-radius: 10px;
      height: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthBarComponent {
  health = input.required<number>();
}
