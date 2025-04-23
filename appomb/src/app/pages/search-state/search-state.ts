import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { GeoServiceProvider, State } from '../../providers/geo-service/geo-service';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'app-search-state',
  templateUrl: './search-state.html',
  styleUrls: ['./search-state.scss'],
})
export class SearchStatePage implements OnInit, AfterViewInit  {
  @ViewChild('searchBar', { static: false }) searchBar: IonSearchbar;
  
  searchText: string = '';
  items: State[] = [];
  searchMade = false;

  constructor(
    private modalCtrl: ModalController,
    public loadingHelper: LoadingHelper,
    public geoServiceProvider: GeoServiceProvider
  ) {}

  ngOnInit() {
    this.loadStates();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchBar?.setFocus();
    }, 500);
  }

  loadStates() {
    this.loadingHelper.setLoading('states', true);
    this.geoServiceProvider.getStates().subscribe(
      (resp) => {
        this.searchMade = true;
        this.loadingHelper.setLoading('states', false);
        this.items = resp;
      },
      (err) => {
        console.error('Erro ao carregar estados:', err);
        this.loadingHelper.setLoading('states', false);
      }
    );
  }

  select(state: State) {
    this.modalCtrl.dismiss(state);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
