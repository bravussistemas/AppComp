import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import {
  GeoServiceProvider,
  City,
} from '../../providers/geo-service/geo-service';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.html',
  styleUrls: ['./search-city.scss'],
})
export class SearchCityPage implements OnInit, AfterViewInit {
  @ViewChild('searchBar', { static: true }) searchBar!: IonSearchbar;

  searchText: string = '';
  items: City[] = [];
  searchMade: boolean = false;
  stateId!: number;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private route: ActivatedRoute,
    protected loadingHelper: LoadingHelper,
    private geoServiceProvider: GeoServiceProvider
  ) {}

  ngOnInit() {
    // Obtém o `stateId` dos parâmetros de rota
    this.stateId = this.navParams.get('stateId');
    if (!this.stateId) {
      throw new Error('Missing stateId');
    }

    // Busca as cidades
    this.loadingHelper.setLoading('items', true);
    this.geoServiceProvider.getCities(this.stateId).subscribe(
      (resp) => {
        this.searchMade = true;
        this.loadingHelper.setLoading('items', false);
        this.items = resp;
      },
      (error) => {
        this.loadingHelper.setLoading('items', false);
        console.error('Erro ao buscar cidades:', error);
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchBar?.setFocus();
    }, 500);
  }

  select(city: City) {
    // Retorna a cidade selecionada para o componente pai
    this.modalCtrl.dismiss(city);
  }

  dismiss() {
    // Fecha o modal sem selecionar uma cidade
    this.modalCtrl.dismiss();
  }
}
