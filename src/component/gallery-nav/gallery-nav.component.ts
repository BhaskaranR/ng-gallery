import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'gallery-nav',
  templateUrl: './gallery-nav.component.html',
  styleUrls: ['./gallery-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryNavComponent {

  @Input() state;

  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();

  constructor() {
  }

}
