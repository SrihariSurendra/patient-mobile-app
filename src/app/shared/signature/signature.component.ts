import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;
  @Output() base64Signature = new EventEmitter<any>();
  @Input() public imageToDisplay?: any; 
  constructor(private renderer: Renderer2, public elementRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.setupCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('imageToDisplay' in changes) {
      this.setupCanvas();
    }
  }

  private setupCanvas(): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (canvas) {
      this.ctx = canvas.getContext('2d');
      if (this.ctx) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      this.setupEventListeners();

      if (this.imageToDisplay) {
        const image = new Image();
        image.onload = () => {
          if (this.ctx) {
            this.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          }
        };
        image.src = this.imageToDisplay;
      }
    }
  }

  setupEventListeners() {
    this.renderer.listen(this.signatureCanvas.nativeElement, 'mousedown', (event) => this.startDrawing(event));
    this.renderer.listen(this.signatureCanvas.nativeElement, 'mousemove', (event) => this.draw(event));
    this.renderer.listen(this.signatureCanvas.nativeElement, 'mouseup', () => this.endDrawing());

    // Touch events
    this.renderer.listen(this.signatureCanvas.nativeElement, 'touchstart', (event) => this.startDrawing(event));
    this.renderer.listen(this.signatureCanvas.nativeElement, 'touchmove', (event) => this.draw(event));
    this.renderer.listen(this.signatureCanvas.nativeElement, 'touchend', () => this.endDrawing());
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDrawing = true;
    const pos = this.getCursorPosition(event);
    if(this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    }
  }

  draw(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (this.isDrawing) {
      const pos = this.getCursorPosition(event);
      if(this.ctx) {
        this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      }
    }
  }

  endDrawing() {
    this.isDrawing = false;
    this.convertCanvasToBase64().then((imageData) => {
      this.base64Signature.emit(imageData);
    });
  }

  private convertCanvasToBase64(): Promise<any> {
    return new Promise((resolve, reject) => {
      const canvas = this.signatureCanvas.nativeElement;
      const imageData = canvas.toDataURL('image/png');
      resolve(imageData);
    });
  }

  getCursorPosition(event: MouseEvent | TouchEvent) {
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    const canvasRect = this.signatureCanvas.nativeElement.getBoundingClientRect();
    return {
      x: (clientX !== undefined ? clientX : 0) - canvasRect.left,
      y: (clientY !== undefined ? clientY : 0) - canvasRect.top
    };
  }

  clearSignature() {
    if (this.ctx) {
      const canvas = this.signatureCanvas.nativeElement;
      this.ctx.fillStyle = 'white'; 
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

}
