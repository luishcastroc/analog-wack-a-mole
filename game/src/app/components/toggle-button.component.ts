import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-toggle-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button type="button">
    <img [src]="imgSource" alt="Pause icon, two vertical white bars" />
  </button>`,
  styles: `
    button {
      width: 3rem;
      height: 3rem;
      background-color: black;
      border: solid 3px white;
      border-radius: 10px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      display: flex;
    }

    img {
      width: 1.3rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonComponent {
  imgSource = '/img/icon_pause.png';
}
