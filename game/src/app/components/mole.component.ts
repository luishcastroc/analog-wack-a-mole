import { Component } from "@angular/core";
import { AnimatedSpriteComponent } from "./animated-sprite.component";

@Component({
  selector: "game-mole",
  standalone: true,
  imports: [AnimatedSpriteComponent],
  template: `<game-animated-sprite
    [animations]="animations"
    [columns]="6"
    [rows]="8"
    [imgSrc]="'/sprites.png'"
    [autoPlayAnimation]="'idle'"
  />`,
})
export class MoleComponent {
  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };
}
