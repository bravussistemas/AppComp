import { Component, Input } from '@angular/core';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'loading',
  templateUrl: 'loading.html',
})
export class LoadingComponent {

  @Input() loadingId: string;

  constructor(private loadingHelper: LoadingHelper) {
  }

  loading() {
    if (!this.loadingId) {
      return false;
    }
    return this.loadingHelper.isLoading(this.loadingId);
  }

}
