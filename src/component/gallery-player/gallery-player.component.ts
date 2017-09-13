import { ChangeDetectionStrategy, Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { GalleryPlayConfig } from '../../config';
import { GalleryState } from '../../service/gallery.state';

@Component({
  selector: 'gallery-player',
  templateUrl: './gallery-player.component.html',
  styleUrls: ['./gallery-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPlayerComponent implements OnInit {

  @Input() config: GalleryPlayConfig;
  @Input() state: GalleryState;

  @Output() play = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    /** Start auto-play if enabled */
    if (this.config.autoplay) {
      this.play.emit();
    }

    /** TODO: Display status bar */
  }

}
