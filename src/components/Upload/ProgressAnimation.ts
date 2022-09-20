import { requestAnimationFrame } from '@/utils';
import { QuadEaseIn } from '@/utils/tween';

const defaultOpts = {
  origin: { x: 0, y: 0 },
  width: 100,
  height: 100,
  circleCenter: { x: 50, y: 50 },
  radius: 40,
};
type DefaultOpts = typeof defaultOpts;

export default class ProgressAnimation {
  // canvas 原点X坐标
  private originX: number;

  // canvas 原点X坐标
  private originY: number;

  // canvas 画布的宽度
  private width: number;

  // canvas 画布的高度
  private height: number;

  // 圆形进度条的圆心X坐标
  private circleCenterX: number;

  // 圆形进度条的圆心Y坐标
  private circleCenterY: number;

  // 圆形进度条的半径
  private radius: number;

  // ctx 画布
  private ctx: CanvasRenderingContext2D;

  // 当前文件上传的进度
  private maxValue: number;

  // 当前动画执行的进度
  private currentValue: number;

  // 步长
  private step: number;

  // 动画执行的状态
  private animationPlayState: 'running' | 'paused' | 'end' | '';

  // 动画执行结束的回调函数
  private callback?: () => void;

  constructor(ctx: CanvasRenderingContext2D, options?: DefaultOpts | null, callback?: () => void) {
    const opts = (options || defaultOpts) as DefaultOpts;
    this.originX = opts.origin.x;
    this.originY = opts.origin.y;
    this.width = opts.width;
    this.height = opts.height;
    this.circleCenterX = opts.circleCenter.x;
    this.circleCenterY = opts.circleCenter.y;
    this.radius = opts.radius;
    this.ctx = ctx;
    this.maxValue = 0;
    this.currentValue = 0;
    this.step = 1;
    this.animationPlayState = '';
    this.callback = callback;
  }

  start() {
    if (!this.ctx) return;
    if (this.animationPlayState === 'running') return;
    if (this.animationPlayState === 'end') return;
    if (this.animationPlayState === 'paused') {
      this.drawProgressBar();
    } else {
      this.ctx.beginPath();
      this.ctx.rect(this.originX, this.originY, this.width, this.height);
      // 剪切一个矩形，将绘画限制在这个区域内
      this.ctx.clip();
      this.drawProgressBar();
    }
  }

  // 开始绘制进度条
  drawProgressBar() {
    const loopDraw = () => {
      if (this.currentValue >= 100) {
        this.animationPlayState = 'end';
        this.hiddenMask();
      } else if (this.currentValue >= this.maxValue) {
        this.animationPlayState = 'paused';
      } else {
        this.currentValue += this.step;
        this.animationPlayState = 'running';
        this.drawCircularProgressBar();
        requestAnimationFrame(loopDraw);
      }
    };

    loopDraw();
  }

  // 绘制圆形进度条
  drawCircularProgressBar() {
    const { originX, originY, width, height, circleCenterX, circleCenterY, radius, ctx } = this;
    ctx.clearRect(originX, originY, width, height);
    ctx.beginPath();
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(originX, originY, width, height);

    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      circleCenterX,
      circleCenterY,
      radius,
      -0.5 * Math.PI,
      2 * Math.PI * (this.currentValue / 100) - 0.5 * Math.PI,
      false,
    );
    ctx.strokeStyle = '#52c41a';
    ctx.stroke();

    ctx.beginPath();
    ctx.font = '16px arial';
    ctx.fillStyle = '#52c41a';
    // 以圆形进度条的圆心位置开始绘制文字
    ctx.fillText(`${this.currentValue}%`, circleCenterX, circleCenterY);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  updateProgress(progress: number) {
    this.maxValue = progress;
    // 如果当前下载进度已经完成，但是进度条动画还不足 70%，那就加快动画执行的 step
    if (progress === 100 && this.currentValue <= 70) this.step = 5;
    this.start();
  }

  hiddenMask() {
    // 外圈的半径
    const outCircleRadius = (this.width * 1.42) / 2;
    // 内圈的半径
    let innerCircleRadius = 1;
    // 执行了多少次
    let index = 0;
    // 共执行多少次
    const count = 60;
    // 循环执行的函数
    const loopHandleXor = () => {
      index++;
      innerCircleRadius = QuadEaseIn(index, innerCircleRadius, outCircleRadius - innerCircleRadius, count);
      // 条件满足，终止循环。执行回调函数。
      if (innerCircleRadius >= outCircleRadius) {
        this.callback?.();
      } else {
        this.handleXor(innerCircleRadius, outCircleRadius);
        requestAnimationFrame(loopHandleXor);
      }
    };
    loopHandleXor();
  }

  handleXor(innerCircleRadius: number, outCircleRadius: number) {
    const { originX, originY, width, height, circleCenterX, circleCenterY, ctx } = this;
    ctx.clearRect(originX, originY, width, height);
    ctx.beginPath();
    ctx.fillStyle = '#fafafa';
    ctx.arc(circleCenterX, circleCenterY, outCircleRadius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.globalCompositeOperation = 'xor';

    ctx.beginPath();
    ctx.fillStyle = '#fafafa';
    ctx.arc(circleCenterX, circleCenterY, innerCircleRadius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
