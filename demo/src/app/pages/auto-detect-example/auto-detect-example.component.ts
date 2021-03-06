import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SharedService} from '../../shared/service/shared.service';

@Component({
  selector: 'auto-detect-example',
  templateUrl: './auto-detect-example.component.html',
  styleUrls: ['./auto-detect-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoDetectExampleComponent {

  constructor(public shared: SharedService) {
  }

}
