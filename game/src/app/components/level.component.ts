import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'game-level',
  standalone: true,
  template: ` <span>Level</span>
    <span>{{ level() }}</span>`,
  styles: `
    :host {
      color: white;
      font-size: 1.5rem;
      width: 5rem;
      height: 5rem;
      background-color: #ff1a1a;
      border-radius: 10px;
      border-color: white;
      border-width: 3px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelComponent {
  level = input.required<number>();
}
