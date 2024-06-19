import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
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
  ],
  template: `<div class="container flex flex-col items-center">
    <div class="background-image">
      <div class="header">
        <div class="stats">
          <game-level [level]="state().level" />
          <game-timer [time]="state().time" />
          <game-score [score]="state().score" />
          <game-toggle-button
            (click)="state().paused ? resume() : pause()"
            [buttonState]="state().paused ? 'paused' : 'playing'" />
        </div>
        <div class="health-container">
          <game-health-bar [health]="state().health" />
        </div>
      </div>
      <div class="moles-container">
        @for (mole of moles; track $index) {
          <game-mole
            #moleComponent
            (finishPopping)="onFinishPopping()"
            (damageReceived)="onDamage()"
            (moleHealing)="onHeal()"
            (takeScore)="onScore()" />
        }
      </div>
    </div>
  </div>`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .background-image {
      background: url('/img/background.png');
      width: 650px;
      height: 100dvh;
      display: flex;
      flex-direction: column;
    }

    .header {
      flex-basis: 25%;
      flex-shrink: 0;
      padding: 4rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
    }

    .stats {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
    }

    .health-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .moles-container {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameContainerComponent implements AfterViewInit, OnDestroy {
  moleComponents = viewChildren<MoleComponent>('moleComponent');
  private moleIntervalSubscription!: Subscription;
  private timerIntervalSubscription!: Subscription;
  moles = Array.from({ length: 12 });
  molesPopping = 0;
  state = signal<GameState>({ ...DEFAULT_STATE });

  ngAfterViewInit() {
    this.setupTicks();
    this.pause();
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
    if (molesArray.length !== 12) {
      return;
    }

    const randomIndex = this.randomBetween(0, 11);
    const mole = molesArray[randomIndex];
    if (!mole.isAppearing && this.molesPopping < 3) {
      this.molesPopping += 1;
      mole.pop();
    }
  }

  timerTick(): void {
    if (this.state().time === 0) {
      this.clearIntervals();
      this.state.update(state => ({ ...state, cleared: true }));
    } else {
      this.state.update(state => ({ ...state, time: (state.time -= 1) }));
    }
  }

  reset() {
    this.molesPopping = 0;
    this.state.update(() => ({ ...DEFAULT_STATE }));
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
