import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, InjectionToken, Output, EventEmitter } from '@angular/core';
import {GalleryState} from '../../service/gallery.state';
import {GalleryConfig} from '../../config';
import { CONFIG } from "../../gallery.module";


@Component({
  selector: 'gallery-main',
  templateUrl: './gallery-main.component.html',
  styleUrls: ['./gallery-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GalleryMainComponent implements OnInit {

  @Input() state: GalleryState;
  @Input() config: GalleryConfig;


  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();
  @Output() play = new EventEmitter();
  
  
  loading;
  thumbDirection;

  constructor() {
  }

  ngOnInit() {
    // shortcut for thumbnail config
    const thumbPos = this.config.thumbnails.position;
    this.thumbDirection = (thumbPos === 'left' || thumbPos === 'right') ? 'row' : 'column';
  }

  setNext(){
    this.next.emit();
  }

  setPrev(){
    this.prev.emit();
  }

  setPlay(){
    this.play.emit();
  }

}
