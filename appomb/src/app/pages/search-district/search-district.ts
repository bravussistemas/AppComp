import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GeoServiceProvider, District } from '../../providers/geo-service/geo-service';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'app-search-district',
  templateUrl: './search-district.html',
  styleUrls: ['./search-district.scss'],
})
export class SearchDistrictPage implements OnInit {
  @ViewChild('searchBar', { static: false }) searchBar: ElementRef;

  searchText: string = '';
  items: District[] = [];
  searchMade = false;
  cityId: number;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    public loadingHelper: LoadingHelper,
    public geoServiceProvider: GeoServiceProvider
  ) {}

  ngOnInit() {
    this.cityId = Number(this.route.snapshot.paramMap.get('cityId'));
    if (!this.cityId) {
      throw new Error('Missing cityId');
    }

    this.loadingHelper.setLoading('items', true);
    this.geoServiceProvider.getDistricts(this.cityId).subscribe(
      (resp) => {
        this.searchMade = true;
        this.loadingHelper.setLoading('items', false);
        this.items = resp;
      },
      () => {
        this.loadingHelper.setLoading('items', false);
        console.error('Failed to load districts');
      }
    );
  }

  ionViewDidEnter() {
    setTimeout(() => {
      const inputElement = this.searchBar?.nativeElement.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }, 500);
  }

  select(address: District) {
    this.modalCtrl.dismiss(address);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
