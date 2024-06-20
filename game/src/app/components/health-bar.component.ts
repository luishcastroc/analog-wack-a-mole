import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-health-bar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="ml-[4px] mt-[1px] h-6 w-full rounded-[10px] bg-white">
      <div
        class="absolute ml-[4px] h-6 rounded-[10px] bg-[#ff1a1a]"
        [style.width.%]="health()"></div>
    </div>
    <img
      src="/img/icon_health.png"
      alt="Health icon, a red hearth"
      class="absolute left-0 top-[-7px] h-10 w-12" /> `,
  styles: `
    :host {
      @apply relative flex-1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthBarComponent {
  health = input.required<number>();
}
