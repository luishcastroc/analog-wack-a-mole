import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AnimatedSpriteComponent } from './animated-sprite.component';
import { timer } from 'rxjs';

@Component({
  selector: 'game-mole',
  standalone: true,
  imports: [AnimatedSpriteComponent],
  template: ` <game-animated-sprite
    (click)="whack()"
    #mole
    [animations]="animations"
    [columns]="6"
    [rows]="8"
    [imgSrc]="'/img/sprites.png'"
    [autoPlayAnimation]="'idle'"
    [frameWidth]="frameWidth()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoleComponent {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accesses the AnimatedSpriteComponent
  finishPopping = output({ alias: 'finishPopping' }); // Emits when popping is finished
  damage = output({ alias: 'damageReceived' });
  score = output({ alias: 'takeScore' });
  heal = output({ alias: 'moleHealing' });
  frameWidth = input(0);

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
  isFeisty = false;
  isHealing = false;
  isWhacked = false;
  isAttacking = false;
  isHiding = false;

  pop() {
    this.resetStates();
    this.isAppearing = true;

    this.isFeisty = Math.random() < 0.5;
    this.isHealing = !this.isFeisty && Math.random() < 0.08;

    if (this.isHealing) {
      this.mole()?.play('heal', 24, () => {
        timer(1000).subscribe(() => this.hideMole());
      });
    } else {
      this.mole()?.play('appear', 24, () => {
        if (this.isFeisty && !this.isWhacked) {
          timer(600).subscribe(() => {
            if (!this.isWhacked) {
              this.isAttacking = true;
              this.mole()?.play('attack', 13, () => {
                this.damage.emit();
                this.hideMole();
              });
            }
          });
        } else {
          timer(1000).subscribe(() => this.hideMole());
        }
      });
    }
  }

  whack() {
    if (!this.isAppearing || this.isWhacked || this.isAttacking) return;

    this.isWhacked = true;
    this.isFeisty = false;
    this.score.emit();
    if (this.isHealing) this.heal.emit();

    this.mole()?.play('dizzy', 24, () => {
      this.mole()?.play('faint', 24, () => {
        this.isAppearing = false;
        this.finishPopping.emit();
      });
    });
  }

  hideMole() {
    if (this.isHiding) return;
    this.isHiding = true;
    this.mole()?.play('hide', 24, () => {
      this.isAppearing = false;
      this.finishPopping.emit();
    });
  }

  resetStates() {
    this.isWhacked = false;
    this.isAttacking = false;
    this.isHiding = false;
    this.isHealing = false;
  }
}
