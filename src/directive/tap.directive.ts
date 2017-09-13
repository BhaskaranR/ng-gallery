/** This directive enable tap if HammerJS is loaded, otherwise it uses the normal click event (useful for thumbnail click) */

import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { GalleryConfig } from '../config';

declare const Hammer: any;

@Directive({
  selector: '[tap]'
})
export class TapDirective implements OnInit {

  @Input() tap;
  @Output() tapClick = new EventEmitter();
  @Input() galleryConfig: GalleryConfig
  

  constructor( private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.setTapEvent();
  }

  /** Enable gestures if hammer is loaded */
  setTapEvent() {

    if (this.galleryConfig.gestures) {
      if (typeof Hammer === 'undefined') {

        throw Error('[NgGallery]: HammerJS is undefined, make sure it is loaded');
      } else {
        /** Use tap for click event */
        if (typeof Hammer !== 'undefined') {
          const mc = new Hammer(this.el.nativeElement);
          mc.on('tap', () => {
            this.tapClick.emit(null);
          });
        }
      }
    } else {
      /** Use normal click event */
      this.renderer.setProperty(this.el.nativeElement, 'onclick', () => {
        this.tapClick.emit(null);
      });
    }

  }
}
