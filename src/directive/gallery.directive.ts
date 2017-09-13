import { Directive, ElementRef, Renderer2, Input, OnInit, Host, Self, Optional } from '@angular/core';
import { GalleryImage } from '../service/gallery.state';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { GalleryModalComponent } from '../component/gallery-modal/gallery-modal.component';
import { GalleryComponent } from "../component/gallery/gallery.component";

@Directive({
  selector: '[gallerize]'
})
export class GalleryDirective implements OnInit {

  // A flag to check if content has changed
  content;

  @Input() gallerize;

  constructor(public el: ElementRef, public renderer: Renderer2, 
    @Host() @Self() @Optional() public hostGalleryComponent : GalleryComponent,
    @Host() @Self() @Optional() public hostGalleryModalComponent : GalleryModalComponent
    
  ) {
  }

  ngOnInit() {

    /** Listen for InnerHtml changes */
    Observable.fromEvent(this.el.nativeElement, 'DOMSubtreeModified')
      .subscribe(() => {
        // skip if content is the same
        if (this.content === this.el.nativeElement.innerText) {
          return;
        }
        else {
          this.content = this.el.nativeElement.innerText;
        }

        const images: GalleryImage[] = [];
        const classes = (this.gallerize) ? this.gallerize.split(' ').map((className) => '.' + className) : '';

        // get all img elements from content
        const imageElements = this.el.nativeElement.querySelectorAll(`img${classes}`);

        if (imageElements) {
          Observable.from(imageElements).map((img: HTMLImageElement, i) => {
            // add click event to the images
            this.renderer.setStyle(img, 'cursor', 'pointer');
            this.renderer.setProperty(img, 'onclick', () => {

              if (this.hostGalleryComponent) {
                this.hostGalleryComponent.set(i);
            } 
            else if (this.hostGalleryModalComponent) {
              this.hostGalleryModalComponent.set(i);
            }
            });

            // create an image item
            images.push({
              src: img.src,
              text: img.alt
            });
          })
          .finally(() => {
            if (this.hostGalleryComponent) {
                this.hostGalleryComponent.load(images);
            } 
            else if (this.hostGalleryModalComponent) {
              this.hostGalleryModalComponent.load(images);
            }

          })
          .subscribe();

        }
      });
  }
}
