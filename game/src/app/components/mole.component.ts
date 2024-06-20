import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AnimatedSpriteComponent } from './animated-sprite.component';
import { Subscription, timer } from 'rxjs';

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
    [initialFrame]="0"
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

  private subscriptions: Subscription[] = []; // Store all subscriptions

  // Initiates the mole popping sequence
  pop() {
    this.resetStates(); // Reset all states to ensure a clean start
    this.isAppearing = true;

    // Determine if the mole is feisty or healing
    this.isFeisty = Math.random() < 0.5;
    this.isHealing = !this.isFeisty && Math.random() < 0.08;

    // Play the appropriate animation based on the mole's state
    if (this.isHealing) {
      this.mole()?.play('heal', 24, () => {
        this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
      });
    } else {
      this.mole()?.play('appear', 24, () => {
        // If the mole is feisty and hasn't been whacked, it will attack
        if (this.isFeisty && !this.isWhacked) {
          this.subscriptions.push(
            timer(600).subscribe(() => {
              if (!this.isWhacked) {
                this.isAttacking = true;
                this.mole()?.play('attack', 13, () => {
                  this.damage.emit();
                  this.hideMole();
                });
              }
            })
          );
        } else {
          // Otherwise, the mole will hide after a delay
          this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
        }
      });
    }
  }

  // Handles the whack event
  whack() {
    // Only whack if the mole is appearing and not already whacked or attacking
    if (!this.isAppearing || this.isWhacked || this.isAttacking) return;

    this.isWhacked = true;
    this.isFeisty = false;
    this.score.emit();
    if (this.isHealing) this.heal.emit();

    // Play the dizzy and faint animations upon whack
    this.mole()?.play('dizzy', 24, () => {
      this.mole()?.play('faint', 24, () => {
        this.isAppearing = false;
        this.finishPopping.emit();
      });
    });
  }

  // Hides the mole
  hideMole() {
    // Only hide if not already hiding
    if (this.isHiding) return;
    this.isHiding = true;
    this.mole()?.play('hide', 24, () => {
      this.isAppearing = false;
      this.finishPopping.emit();
    });
  }

  // Resets all state flags
  resetStates() {
    this.isWhacked = false;
    this.isAttacking = false;
    this.isHiding = false;
    this.isHealing = false;
    this.clearSubscriptions(); // Clear all subscriptions
  }

  // Clear all subscriptions
  clearSubscriptions() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
