import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  viewChildren,
} from '@angular/core';
import { MoleComponent } from './mole.component';
import { interval, Subscription } from 'rxjs';
import { LevelComponent } from './level.component';
import { TimerComponent } from './timer.component';
import { ScoreComponent } from './score.component';
import { ToggleButtonComponent } from './toggle-button.component';
import { HealthBarComponent } from './health-bar.component';
import { ClearLevelComponent } from './clear-level.component';
import { GameOverComponent } from './game-over.component';
import { PauseComponent } from './pause.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

const DEFAULT_TIME = 30;
interface GameState {
  level: number;
  score: number;
  time: number;
  cleared: boolean;
  paused: boolean;
  gameOver: boolean;
  health: number;
}

const DEFAULT_STATE: GameState = {
  level: 1,
  score: 0,
  time: DEFAULT_TIME,
  cleared: false,
  paused: false,
  gameOver: false,
  health: 100,
};

@Component({
  selector: 'game-container',
  standalone: true,
  imports: [
    MoleComponent,
    LevelComponent,
    TimerComponent,
    ScoreComponent,
    ToggleButtonComponent,
    HealthBarComponent,
    ClearLevelComponent,
    GameOverComponent,
    PauseComponent,
  ],
  template: `<div class="container flex h-[100dvh] flex-col items-center">
    <div
      class="flex w-full flex-1 flex-col bg-[url('/img/background.png')] bg-cover bg-no-repeat md:w-[650px]">
      <div
        class="flex basis-[200px] flex-col content-center gap-4 px-6 pb-2 pt-12">
        <div class="flex flex-row items-center gap-[4px] md:gap-6">
          <game-level [level]="state().level" />
          <game-timer [time]="state().time" />
          <game-score [score]="state().score" />
          <game-toggle-button (click)="state().paused ? resume() : pause()" />
        </div>
        <div class="flex flex-row items-center justify-center">
          <game-health-bar [health]="state().health" />
        </div>
      </div>
      <div
        class="relative grid cursor-[url('/img/hammer.png'),_auto] grid-cols-[repeat(3,_minmax(140px,_1fr))] items-center justify-items-center gap-4 px-4 py-0">
        @for (mole of moles(); track $index) {
          <game-mole
            #moleComponent
            (finishPopping)="onFinishPopping()"
            (damageReceived)="onDamage()"
            (moleHealing)="onHeal()"
            (takeScore)="onScore()"
            [frameWidth]="moleWidth()" />
        }
      </div>
    </div>
    @if (state().cleared) {
      <game-clear-level
        [score]="state().score"
        [level]="state().level"
        (nextLevel)="nextLevel()"
        (reset)="reset()" />
    }
    @if (state().gameOver) {
      <game-game-over
        [score]="state().score"
        [level]="state().level"
        (reset)="reset()" />
    }
    @if (state().paused) {
      <game-pause (reset)="reset()" (resume)="resume()" />
    }
  </div>`,
  styles: `
    :host {
      @apply flex flex-col items-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameContainerComponent implements AfterViewInit, OnDestroy {
  moleComponents = viewChildren<MoleComponent>('moleComponent');
  private moleIntervalSubscription!: Subscription;
  private timerIntervalSubscription!: Subscription;
  moleQty = 12;
  moleWidth = signal(0);
  moles = signal<Array<number>>(Array.from({ length: this.moleQty }));
  molesPopping = 0;
  state = signal<GameState>({ ...DEFAULT_STATE });
  #responsive = inject(BreakpointObserver);

  constructor() {
    this.#responsive.observe([Breakpoints.Handset]).subscribe({
      next: result => {
        if (result.matches) {
          this.moleWidth.set(110);
        } else {
          this.moleWidth.set(0);
        }

        console.log({ result });
      },
    });
  }

  ngAfterViewInit() {
    this.setupTicks();
  }

  setupTicks() {
    let speed = 750 - this.state().level * 50;
    if (speed < 350) {
      speed = 350;
    }

    this.clearIntervals();

    this.moleIntervalSubscription = interval(speed).subscribe({
      next: () => {
        this.popRandomMole();
      },
    });

    this.timerIntervalSubscription = interval(1000).subscribe({
      next: () => {
        this.timerTick();
      },
    });
  }

  clearIntervals() {
    if (this.moleIntervalSubscription) {
      this.moleIntervalSubscription.unsubscribe();
    }
    if (this.timerIntervalSubscription) {
      this.timerIntervalSubscription.unsubscribe();
    }
  }

  randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  onFinishPopping(): void {
    this.molesPopping -= 1;
  }

  popRandomMole(): void {
    const molesArray = this.moleComponents();
    if (molesArray.length !== this.moleQty) {
      return;
    }

    const randomIndex = this.randomBetween(0, this.moleQty - 1);
    const mole = molesArray[randomIndex];
    if (!mole.isAppearing && this.molesPopping < 3) {
      this.molesPopping += 1;
      mole.pop();
    }
  }

  timerTick(): void {
    if (this.state().time === 0) {
      this.clearIntervals();
      if (this.state().score > 0) {
        this.state.update(state => ({ ...state, cleared: true }));
      } else {
        this.gameOver();
      }
    } else {
      this.state.update(state => ({ ...state, time: (state.time -= 1) }));
    }
  }

  reset() {
    this.molesPopping = 0;
    this.state.update(() => ({ ...DEFAULT_STATE }));
    this.setupTicks();
  }

  pause() {
    this.clearIntervals();
    this.state.update(state => ({ ...state, paused: true }));
  }

  resume() {
    this.molesPopping = 0;
    this.state.update(state => ({ ...state, paused: false }));
    this.setupTicks();
  }

  nextLevel() {
    this.molesPopping = 0;
    this.state.update(state => ({
      ...state,
      level: (state.level += 1),
      cleared: false,
      gameOver: false,
      score: 0,
      time: DEFAULT_TIME,
    }));
    this.setupTicks();
  }

  onScore() {
    this.state.update(state => ({ ...state, score: (state.score += 1) }));
  }

  onDamage() {
    if (this.state().cleared || this.state().gameOver || this.state().paused) {
      return;
    }

    const targetHealth =
      this.state().health - 10 < 0 ? 0 : this.state().health - 10;

    this.state.update(state => ({ ...state, health: targetHealth }));

    if (targetHealth <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.clearIntervals();
    this.state.update(state => ({ ...state, gameOver: true }));
  }

  onHeal() {
    this.state.update(state => ({
      ...state,
      health: state.health + 10 > 100 ? 100 : state.health + 10,
    }));
  }

  ngOnDestroy() {
    this.clearIntervals();
  }
}
