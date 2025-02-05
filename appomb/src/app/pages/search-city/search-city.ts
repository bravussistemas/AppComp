import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GeoServiceProvider, City } from '../../providers/geo-service/geo-service';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'page-search-city',
  templateUrl: './search-city.html',
  styleUrls: ['./search-city.scss'],
})
export class SearchCityPage implements OnInit {
  @ViewChild('searchBar', { static: true }) searchBar!: IonSearchbar;

  searchText: string = '';
  items: City[] = [];
  searchMade: boolean = false;
  stateId!: number;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    protected loadingHelper: LoadingHelper,
    private geoServiceProvider: GeoServiceProvider,
  ) {}

  ngOnInit() {
    // Obtém o `stateId` dos parâmetros de rota
    this.stateId = Number(this.route.snapshot.paramMap.get('stateId'));
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

  ionViewDidEnter() {
    // Define o foco na barra de pesquisa após carregar a página
    setTimeout(() => {
      this.searchBar.setFocus();
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
