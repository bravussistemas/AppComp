import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreditCardService } from '../../providers/credit-card.service';
import { ICreditCard, IUserSettings } from '../../shared/interfaces';
import { LoadingHelper } from '../../utils/loading-helper';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { ToastHelper } from '../../utils/toast-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { EventService } from 'src/app/providers/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-list-credit-card',
  templateUrl: './list-credit-card.html',
  styleUrl: './list-credit-card.scss',
})
export class ListCreditCardPage implements OnDestroy, OnInit {
  items: ICreditCard[] = [];
  store: Store;
  toChooseDefault = false;

  constructor(
    private navCtrl: NavController,
    private alertHelper: AlertHelper,
    public loadingHelper: LoadingHelper,
    private toastHelper: ToastHelper,
    private creditCardService: CreditCardService,
    private events: EventService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.toChooseDefault =
      route.snapshot.paramMap.get('action') === 'toChooseDefault';
    this.settingsService.getSettings().then((result: IUserSettings) => {
      this.store = result.store;
    });
    this.events.onEvent('creditCardAdded').subscribe(this.eventCreditCardAdded);
  }

  ngOnInit(): void {
    this.loadCards();
  }

  eventCreditCardAdded = (data) => {
    this.loadCards(data.id);
  };

  loadCards(autoSelectId?: number) {
    this.loadingHelper.setLoading('items', true);
    this.creditCardService.list().subscribe(
      (resp) => {
        this.items = resp;
        this.loadingHelper.setLoading('items', false);
        if (autoSelectId) {
          const cardToSelect = resp.find(
            (card) => card.id.toString() === autoSelectId.toString()
          );
          if (cardToSelect) {
            this.onSelectCard(cardToSelect);
          }
        }
      },
      () => {
        this.loadingHelper.setLoading('items', false);
        this.toastHelper.connectionError();
      }
    );
  }

  goToAddCard() {
    this.router.navigate(['/RegisterCreditCard'], {
      queryParams: { redirectAfter: 'pop' },
    });
  }

  deleteCard(event, cardId: number) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.alertHelper
      .confirm('Excluir cartão', 'Isso é irreversível, deseja continuar?')
      .then((confirmed) => {
        if (confirmed) {
          this.loadingHelper.show();
          this.creditCardService.delete(cardId).subscribe(
            () => {
              this.events.emitEvent('creditCard', null);
              this.toastHelper.show({
                message: 'Cartão removido com sucesso.',
              });
              this.loadingHelper.hide();
              this.loadCards();
            },
            () => {
              this.toastHelper.show({
                message: 'Não foi possível remover o cartão.',
              });
              this.loadingHelper.hide();
            }
          );
        }
      });
  }

  onSelectCard(card: ICreditCard) {
    if (!this.toChooseDefault) {
      return;
    }
    this.loadingHelper.show();
    this.creditCardService.setDefault({ card_id: card.id }).subscribe(
      () => {
        this.events.emitEvent('creditCard', card);
        this.navCtrl.pop().then(() => {
          this.loadingHelper.hide();
        });
      },
      () => {
        this.toastHelper.connectionError();
        this.loadingHelper.hide();
      }
    );
  }

  ngOnDestroy() {
    this.events.unsubscribe('creditCardAdded');
  }
}
