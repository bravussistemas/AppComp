import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DispatchOrderRequests } from '../../shared/models/dispatch-order.model';
import { ActionSheetController } from '@ionic/angular';
import { DispatchOrderService, ReportProblemDTO } from '../../providers/dispatch-order.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { AppConfig } from '../../../configs';

@Component({
  selector: 'my-requests-list',
  templateUrl: './my-requests-list.html',
  styleUrl: './my-requests-list.scss',
})
export class MyRequestsListComponent {

  text: string;
  @Input() data: DispatchOrderRequests[];
  @Output('reload') reload: EventEmitter<any> = new EventEmitter();
  @Output('onClickItem') onClickItem: EventEmitter<DispatchOrderRequests> = new EventEmitter();

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private appConfig: AppConfig,
    private dispatchOrderService: DispatchOrderService,
    public loadingHelper: LoadingHelper,
    public alertHelper: AlertHelper,
    public toastHelper: ToastHelper
  ) {

  }

  emitOnClickItem(item: DispatchOrderRequests) {
    this.onClickItem.emit(item)
  }

  callReportProblemApi(data: ReportProblemDTO) {
    this.loadingHelper.show();
    this.dispatchOrderService.reportProblem(data)
      .toPromise()
      .then(() => {
        this.alertHelper.show(
          'Recebemos sua mensagem',
          'Sentimos muito pelo problema com o seu pedido, mas avisamos a nossa equipe e ' +
          'logo entraremos em contato para resolver essa questão. ;)');
        this.loadingHelper.hide();
        this.reload.emit();
      })
      .catch((e) => {
        console.log(e);
        this.loadingHelper.hide();
        this.toastHelper.show({
          message: 'Erro de comunicação com servidor, verifique seu sinal e tente novamente.',
          cssClass: 'toast-error'
        });
      })
  }

  logRatingChange(rating, item) {
    item._loading_rating = true;
    this.dispatchOrderService.setDispatchRating({
      id: item.id,
      rating: rating
    }).toPromise().then(() => {
      item._loading_rating = false;
      item.rating = rating;
    }).catch(() => {
      item._loading_rating = false;
      this.toastHelper.connectionError()
    })
  }

  async helpClicked($event, item) {
    $event.stopPropagation();
    if (item.can_request_help) {
      const buttons = [
        {
          text: 'Não recebi meu pedido',
          handler: () => {
            this.callReportProblemApi({
              problem_type: 0,
              dispatch_order: item.id
            })
          }
        },
        {
          text: 'Meu pedido veio errado',
          handler: () => {
            this.callReportProblemApi({
              problem_type: 1,
              dispatch_order: item.id
            })
          }
        },
        {
          text: 'Outro problema',
          handler: () => {
            this.callReportProblemApi({
              problem_type: 2,
              dispatch_order: item.id
            })
          }
        }
      ];
      const actionSheet = this.actionSheetCtrl.create({
        header: 'Como podemos ajudar?',
        buttons: [
          ...buttons, {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      });
      (await actionSheet).present();
    } else {
      this.alertHelper.confirm(
        'Reportar um problema',
        `Para reportar problemas com pedidos de outros dias, entre em contato pelo e-mail: <strong>${this.appConfig.CONTACT_EMAIL}</strong>`,
        'Entrar em contato',
        'Cancelar'
      ).then((confirmed) => {
        if (!confirmed) {
          return;
        }
        window.open(`mailto:${this.appConfig.CONTACT_EMAIL}`, '_system');
      });
    }

  }
}
