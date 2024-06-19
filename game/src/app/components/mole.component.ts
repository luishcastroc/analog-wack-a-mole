import {
  ChangeDetectionStrategy,
  Component,
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
    #mole
    [animations]="animations"
    [columns]="6"
    [rows]="8"
    [imgSrc]="'/img/sprites.png'"
    [autoPlayAnimation]="'idle'" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoleComponent {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accesses the AnimatedSpriteComponent
  finishPopping = output({ alias: 'finishPopping' }); // Emits when popping is finished
  damage = output({ alias: 'damageReceived' });
  score = output({ alias: 'takeScore' });
  heal = output({ alias: 'moleHealing' });

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

  pop() {
    this.isWhacked = false;
    this.isAttacking = false;
    this.isAppearing = true;

    this.isFeisty = Math.random() < 0.5;
    if (!this.isFeisty) {
      this.isHealing = Math.random() < 0.06;
    }

    if (this.isHealing) {
      this.mole()?.play('heal', 24, () => {
        timer(1000).subscribe({
          next: () => {
            this.mole()?.play('hide', 24, () => {
              this.isAppearing = false;
              this.finishPopping.emit();
            });
          },
        });
      });
    } else {
      this.mole()?.play('appear', 24, () => {
        if (this.isFeisty) {
          timer(1000).subscribe({
            next: () => {
              this.isAttacking = true;
              this.damage.emit();
              this.mole()?.play('attack', 12, () => {
                this.mole()?.play('hide', 24, () => {
                  this.isAppearing = false;
                  this.finishPopping.emit();
                });
              });
            },
          });
        } else {
          timer(1000).subscribe({
            next: () => {
              this.mole()?.play('hide', 24, () => {
                this.isAppearing = false;
                this.finishPopping.emit();
              });
            },
          });
        }
      });
    }
  }

  whack() {
    if (!this.isAppearing || this.isWhacked || this.isAttacking) {
      return;
    }

    this.isWhacked = true;
    this.isFeisty = false;

    this.score.emit();
    if (this.isHealing) {
      this.heal.emit();
    }

    this.mole()?.play('dizzy', 24, () => {
      this.mole()?.play('faint', 24, () => {
        this.isAppearing = false;
        this.finishPopping.emit();
      });
    });
  }
}
