import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  untracked,
  viewChild,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'game-animated-sprite',
  standalone: true,
  template: ` <canvas #canvas></canvas> `,
})
export class AnimatedSpriteComponent implements AfterViewInit, OnDestroy {
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  imgSrc = input.required<string>();
  rows = input.required<number>();
  columns = input.required<number>();
  animations = input.required<{ [key: string]: number[] }>();
  loopMode = input(false);
  frameWidth = input<number | null>(null);
  frameHeight = input<number | null>(null);
  autoPlayAnimation = input('');

  private img = new Image();
  private ctx!: CanvasRenderingContext2D;
  private width!: number;
  private height!: number;
  private subscription!: Subscription;
  private currentLoopIndex = 0;
  private currentAnimationType!: string;
  private frameSequence!: number[];

  valueEffect = effect(() => {
    const [w, h, imgSrc] = [
      this.frameWidth(),
      this.frameHeight(),
      this.imgSrc(),
    ];
    untracked(() => {
      this.calculateDimensions();
    });
  });

  ngAfterViewInit(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (canvas) {
      this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      this.img.src = this.imgSrc();
      this.img.onload = () => {
        this.calculateDimensions();
        const autoPlay = this.autoPlayAnimation();
        if (autoPlay) {
          this.play(autoPlay);
        }
      };
    }
  }

  private calculateDimensions(): void {
    if (this.img.complete) {
      this.width = this.frameWidth() ?? this.img.naturalWidth / this.columns();
      this.height = this.frameHeight() ?? this.img.naturalHeight / this.rows();
      const canvas = this.canvasRef()?.nativeElement;
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
    }
  }

  play(animationType: string, fps = 24, onFinish?: () => void): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.currentLoopIndex = 0;
    this.currentAnimationType = animationType;
    this.frameSequence = this.animations()[animationType];
    this.startAnimation(this.frameSequence, fps, onFinish);
  }

  pause(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  resume(): void {
    if (this.currentAnimationType && this.frameSequence) {
      this.startAnimation(this.frameSequence);
    }
  }

  reset(): void {
    this.clearCanvas();
    this.currentLoopIndex = 0;
  }

  private startAnimation(
    frameSequence: number[],
    fps = 24,
    onFinish?: () => void
  ): void {
    const frameRate = 1000 / fps;
    this.subscription = interval(frameRate)
      .pipe(
        tap(() => this.clearCanvas()),
        map(() => frameSequence[this.currentLoopIndex]),
        tap(frameIndex => this.drawFrame(frameIndex)),
        tap(() => {
          this.currentLoopIndex++;
          if (this.currentLoopIndex >= frameSequence.length) {
            if (this.loopMode()) {
              this.currentLoopIndex = 0;
            } else {
              this.subscription.unsubscribe();
              if (onFinish) {
                onFinish();
              }
            }
          }
        })
      )
      .subscribe();
  }

  private clearCanvas(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (canvas) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private drawFrame(frameIndex: number): void {
    const frameX = frameIndex % this.columns();
    const frameY = Math.floor(frameIndex / this.columns());
    this.ctx.drawImage(
      this.img,
      frameX * this.width,
      frameY * this.height,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
