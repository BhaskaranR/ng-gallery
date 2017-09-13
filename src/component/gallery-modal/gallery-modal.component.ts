import { ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, ElementRef, Renderer2, Optional } from '@angular/core';
import { transition, state, trigger, style, animate } from '@angular/animations';

import { GalleryState, GalleryImage } from '../../service/gallery.state';
import { GalleryConfig } from '../../config/gallery.config';
import { defaultState, defaultConfig } from '../../config/gallery.default';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
@Component({
  selector: 'gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('popup', [
      state('in', style({ opacity: 0.8, transform: 'scale(0.2) translate3d(0, 100px, 0)' })),
      transition('void => *', [
        style({ opacity: 0.8, transform: 'scale(0.2) translate3d(0, 100px, 0)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 1, transform: 'scale(1)  translate3d(0, 0, 0)' }))
      ])
    ])]
})
export class GalleryModalComponent implements OnDestroy {

  @Input() closeButton = true;
  /** Gallery state */
  state: BehaviorSubject<GalleryState>;
  /** Gallery config */
  config: GalleryConfig = defaultConfig;
  /** Gallery slide show player */
  player: Subject<number>;


  constructor(public el: ElementRef, public renderer: Renderer2, @Optional() config: GalleryConfig) {
    /** Initialize the state */
    this.state = new BehaviorSubject<GalleryState>(defaultState);
    /** Initialize the config */
    this.config = Object.assign({}, defaultConfig, config);

    /** Initialize the player for play/pause commands */
    this.player = new Subject();
    this.player.switchMap((interval) => (interval) ? this.playerEngine(interval) : Observable.of(null)).subscribe();

  }

  load(images: GalleryImage[]) {
    this.state.next({
      images: images,
      currIndex: 0,
      hasNext: images.length > 1,
      hasPrev: false,
      active: false
    });
  }

  /** Set current image and update the state */
  set(index: number) {
    const state = this.state.getValue();

    this.state.next(Object.assign({}, state, {
      prevIndex: state.currIndex,
      currIndex: index,
      hasNext: index < state.images.length - 1,
      hasPrev: index > 0,
      active: true
    }));
  }

  /** Go to next image and update the state */
  next() {
    const state = this.state.getValue();

    if (state.hasNext) {
      const index = state.currIndex + 1;
      this.set(index);
    } else {
      this.set(0);
    }
  }

  /** Go to previous image and update the state */
  prev() {
    const state = this.state.getValue();

    if (state.hasPrev) {
      const index = state.currIndex - 1;
      this.set(index);
    } else {
      this.set(state.images.length - 1);
    }
  }

  /** Close gallery modal if open */
  close() {
    const state = this.state.getValue();

    this.state.next(Object.assign({}, state, {
      active: false,
      play: false
    }));
    this.stop();
  }

  /** Reset gallery with initial state */
  reset() {
    this.state.next(defaultState);
    this.stop();
  }

  /** Play slide show */
  play(interval?) {
    const speed = interval || this.config.player.speed || 2000;

    const state = this.state.getValue();
    /** Open and play the gallery, 'active' opens gallery modal */
    this.state.next(Object.assign({}, state, { play: true, active: true }));
    this.player.next(speed);
  }

  /** End slide show */
  stop() {
    this.player.next(0);
  }

  playerEngine(interval?) {

    return Observable.interval(interval)
      .takeWhile(() => this.state.getValue().play)
      .do(() => {
        this.next();
      })
      .finally(() => {
        this.state.next(Object.assign({}, this.state.getValue(), { play: false }));
      });

  }

  /** Activate keyboard for navigation */
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 37:  // prev
        this.prev();
        break;
      case 39:  // next
        this.next();
        break;
      case 13:  // enter
        this.next();
        break;
      case 27:  // esc
        this.close();
        break;
      default:
        return;
    }
  }

  ngOnDestroy() {
    this.reset();
  }
}
