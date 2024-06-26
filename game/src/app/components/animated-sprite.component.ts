import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  template: `<canvas #canvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  initialFrame = input<number>(0);

  private img = new Image();
  private ctx!: CanvasRenderingContext2D;
  private width!: number;
  private height!: number;
  private originalAspectRatio!: number;
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
        this.originalAspectRatio =
          this.img.naturalWidth / this.img.naturalHeight;
        this.calculateDimensions();
        this.drawFrame(this.initialFrame());
      };
    }
  }

  private calculateDimensions(): void {
    const [frameHeight, frameWidth] = [this.frameHeight(), this.frameWidth()];
    if (this.img.complete) {
      if (frameWidth && !frameHeight) {
        this.width = frameWidth;
        this.height = this.width / this.originalAspectRatio;
      } else if (!frameWidth && frameHeight) {
        this.height = frameHeight;
        this.width = this.height * this.originalAspectRatio;
      } else if (frameWidth && frameHeight) {
        this.width = frameWidth;
        this.height = frameHeight;
      } else {
        this.width = this.img.naturalWidth / this.columns();
        this.height = this.img.naturalHeight / this.rows();
      }

      const canvas = this.canvasRef()?.nativeElement;
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
    }
  }

  play(animationType: string, fps = 24, onFinish?: () => void): void {
    this.clearSubscription();
    this.currentLoopIndex = 0;
    this.currentAnimationType = animationType;
    this.frameSequence = this.animations()[animationType];
    this.startAnimation(this.frameSequence, fps, onFinish);
  }

  pause(): void {
    this.clearSubscription();
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
    const frameX = Math.floor(frameIndex % this.columns());
    const frameY = Math.floor(frameIndex / this.columns());
    const naturalFrameWidth = Math.floor(
      this.img.naturalWidth / this.columns()
    );
    const naturalFrameHeight = Math.floor(this.img.naturalHeight / this.rows());

    const padding = 1;

    this.ctx.drawImage(
      this.img,
      frameX * naturalFrameWidth + padding,
      frameY * naturalFrameHeight + padding,
      naturalFrameWidth - padding * 2,
      naturalFrameHeight - padding * 2,
      0,
      0,
      this.width,
      this.height
    );
  }

  private clearSubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.clearSubscription();
  }
}
