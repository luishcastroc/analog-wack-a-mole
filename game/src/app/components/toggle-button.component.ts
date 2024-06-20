import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-toggle-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button
    type="button"
    class="flex h-12 w-12 flex-col items-center justify-center rounded-[10px] border-[solid_3px_white] bg-black">
    <img
      [src]="imgSource"
      alt="Pause icon, two vertical white bars"
      class="w-[1.3rem]" />
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonComponent {
  imgSource = '/img/icon_pause.png';
}
