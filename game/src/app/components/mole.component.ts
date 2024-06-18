import {Component, output, viewChild} from "@angular/core";
import {AnimatedSpriteComponent} from "./animated-sprite.component";
import {timer} from "rxjs";

@Component({
  selector: "game-mole",
  standalone: true,
  imports: [AnimatedSpriteComponent],
  template: `<game-animated-sprite
    #mole
    [animations]="animations"
    [columns]="6"
    [rows]="8"
    [imgSrc]="'/sprites.png'"
    [autoPlayAnimation]="'idle'"
  />`,
})
export class MoleComponent {
  mole = viewChild<AnimatedSpriteComponent>("mole");
  finishPopping = output<number>({alias:'finishPopping'})
  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };
  isAppearing = false;

  pop(i?:number) {
    const mole = this.mole();
    if (mole) {
      this.isAppearing = true;
      mole.play('appear', () => {
        timer(1500).subscribe(() => {
          this.hide();
        });
      });
    }
  }

  hide(i?:number) {
    const mole = this.mole();
    if (mole) {
      mole.play('hide', () => {
        this.isAppearing = false;
        this.finishPopping.emit(i as number)
      });
    }
  }
}
