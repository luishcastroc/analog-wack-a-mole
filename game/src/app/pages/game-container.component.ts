import {AfterViewInit, Component, OnDestroy, viewChildren} from "@angular/core";
import {MoleComponent} from "../components/mole.component";
import {interval, Subscription} from "rxjs";

@Component({
  selector: "game-container",
  standalone: true,
  imports: [MoleComponent],
  template: `<div class="container flex flex-col items-center">
    <div class="background-image">
      <div class="header"></div>
      <div class="moles-container">
        @for(mole of moles; track $index){
        <game-mole #moleComponent (finishPopping)="onFinishPopping($event)" />
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

      .background-image{
        background: url('/background.png') ;
        width:650px;
        height:100dvh;
        display: flex ;
        flex-direction: column;
      }

      .header {
        flex-basis: 25%
      }

      .moles-container {
        display:grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      }
    `,
})
export class GameContainerComponent implements AfterViewInit, OnDestroy {
  moleComponents = viewChildren<MoleComponent>('moleComponent')
  moles = Array.from({ length: 12 });
  molesPopping = 0;
  private moleIntervalSubscription!: Subscription;
  private timerIntervalSubscription!: Subscription;
  state = { level: 1, time: 60, cleared: false }; // Example state object with time

  ngAfterViewInit() {
    this.setupTicks();
  }

  setupTicks() {
    let speed = 750 - (this.state.level * 50);
    if (speed < 350) {
      speed = 350;
    }

    this.moleIntervalSubscription = interval(speed).subscribe(() => {
      this.popRandomMole();
    });

    this.timerIntervalSubscription = interval(1000).subscribe(() => {
      this.timerTick();
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

  onFinishPopping(index: number): void {
    this.molesPopping -= 1;
  }

  popRandomMole(): void {
    const molesArray = this.moleComponents();
    if (molesArray.length !== 12) {
      console.log(molesArray.length);
      return;
    }

    const randomIndex = this.randomBetween(0, 11);
    const mole = molesArray[randomIndex];
    if (!mole.isAppearing && this.molesPopping < 3) {
      this.molesPopping += 1;
      mole.pop(randomIndex);
    }
  }

  timerTick(): void {
    if (this.state.time === 0) {
      this.clearIntervals();
      this.state.cleared = true;
    } else {
      this.state.time -= 1;
    }
  }

  ngOnDestroy() {
    this.clearIntervals();
  }
}
