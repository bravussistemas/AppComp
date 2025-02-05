import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DispatchFilterData, DispatchFilterService } from '../../providers/dispatch-filter.service';
import { DeliveryEmployeeSimple } from '../../shared/models/store.model';
import { ActivatedRoute, Route } from '@angular/router';

export interface DeliveryEmployeeFilter extends DeliveryEmployeeSimple {
  checked: boolean;
}

@Component({
  selector: 'edit-dispatch-filter',
  templateUrl: './edit-dispatch-filter.html',
  styleUrl: './edit-dispatch-filter.scss',
})
export class EditDispatchFilterPage implements OnInit {
  data: DispatchFilterData;
  deliveryEmployeesFilter: DeliveryEmployeeFilter[];

  constructor(
    private modalCtrl: ModalController,
    private dispatchFilterService: DispatchFilterService,
    private route: ActivatedRoute
  ) {    
    this.deliveryEmployeesFilter = JSON.parse(this.route.snapshot.paramMap.get('deliveryEmployeesFilter'));
  }

  ngOnInit() {
    // Inicializa os dados
    this.dispatchFilterService.get().then((data) => {
      this.data = data;
    });
  }

  save() {
    // Atualiza os filtros e fecha o modal
    this.data.deliveryEmployeesFilter = this.deliveryEmployeesFilter;
    this.dispatchFilterService.set(this.data).then(() => {
      this.dismiss(true); // Passa um estado ao fechar
    });
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data); // Fecha o modal e passa os dados, se necessário
  }
}
