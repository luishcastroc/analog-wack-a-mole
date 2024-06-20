import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimatedSpriteComponent } from './animated-sprite.component';
import { timer } from 'rxjs';

@Component({
  selector: 'game-welcome',
  standalone: true,
  imports: [RouterLink, AnimatedSpriteComponent],
  template: `<div class="container flex flex-col items-center">
    <div
      class="flex h-[100dvh] w-[650px] flex-col items-center justify-center gap-5 bg-[url('/img/background.png')] bg-cover">
      <span class="text-shadow text-6xl">Wack-A-Mole</span>
      <game-animated-sprite
        [animations]="animations"
        [columns]="6"
        [rows]="8"
        [imgSrc]="'/img/sprites.png'"
        #mole />
      <button
        routerLink="/game"
        type="button"
        class="flex flex-row items-center justify-center gap-4">
        <span class="text-shadow text-6xl">Play</span>
        <div
          class="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-white bg-[#ff1a1a]">
          <img src="/img/icon_play.png" alt="Play Icon" class="w-4" />
        </div>
      </button>
    </div>
  </div>`,
  styles: `
    :host {
      @apply flex flex-col items-center;
    }

    .text-shadow {
      text-shadow:
        -1px -1px 0 #fff,
        1px -1px 0 #fff,
        -1px 1px 0 #fff,
        1px 1px 0 #fff;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements AfterViewInit {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accesses the AnimatedSpriteComponent

  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };

  private mainAnimations = ['attack', 'dizzy', 'heal', 'appear'];

  ngAfterViewInit(): void {
    this.startSequence();
  }

  startSequence(): void {
    this.playRandomAnimation();
  }

  playRandomAnimation(): void {
    const nextAnimation = this.getRandomAnimation();
    this.playAnimation(nextAnimation);
  }

  playAnimation(mainAnimation: string): void {
    this.mole()?.play(mainAnimation, 12, () => {
      timer(1000).subscribe(() => {
        this.playHideAnimation();
      });
    });
  }

  playHideAnimation(): void {
    this.mole()?.play('hide', 12, () => {
      timer(1000).subscribe(() => {
        this.playRandomAnimation();
      });
    });
  }

  getRandomAnimation(): string {
    const randomIndex = Math.floor(Math.random() * this.mainAnimations.length);
    return this.mainAnimations[randomIndex];
  }
}
