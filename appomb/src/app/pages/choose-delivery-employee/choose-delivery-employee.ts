import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdminStoreService } from '../../providers/admin-store.service';
import { DeliveryEmployeeSimple } from '../../shared/models/store.model';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-choose-delivery-employee',
  templateUrl: './choose-delivery-employee.html',
  styleUrls: ['./choose-delivery-employee.scss'],
})
export class ChooseDeliveryEmployeePage implements OnInit {

  employers: DeliveryEmployeeSimple[] = [];
  dispatchId: number;

  constructor(
    private adminStoreService: AdminStoreService,
    public loadingHelper: LoadingHelper,
    public toastHelper: ToastHelper,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dispatchId = +this.route.snapshot.queryParamMap.get('dispatchId');
    this.loadData();
  }

  loadData() {
    this.loadingHelper.setLoading('employers', true);
    this.adminStoreService.listDeliveryEmployee().subscribe({
      next: (resp) => {
        this.employers = resp;
        this.loadingHelper.setLoading('employers', false);
      },
      error: (e) => {
        console.error(e);
        this.toastHelper.connectionError();
        this.loadingHelper.setLoading('employers', false);
      }
    });
  }

  refreshCache() {
    this.adminStoreService.clean().then(() => {
      this.loadData();
    });
  }

  choose(employee: DeliveryEmployeeSimple | null) {
    const employeeId = employee ? employee.id : null;
    this.loadingHelper.show();
    this.adminStoreService.setDispatchDeliveryEmployee({
      dispatch_id: this.dispatchId,
      employee_id: employeeId,
    }).subscribe({
      next: () => {
        this.dismiss();
      },
      error: (e) => {
        console.error(e);
        this.toastHelper.show({ message: 'Ocorreu um erro. Tente novamente.' });
        this.loadingHelper.hide();
      }
    });
  }

  get ready() {
    return !this.loadingHelper.isLoading('employers');
  }

  dismiss() {
    this.modalCtrl.dismiss();
    this.loadingHelper.hide();
  }
}
