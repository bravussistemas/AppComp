import { Component, Renderer2, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditCardService } from '../../providers/credit-card.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { AlertHelper } from '../../utils/alert-helper';

@Component({
  selector: 'page-card-error-pop-up',
  templateUrl: './card-error-pop-up.html',
  styleUrls: ['./card-error-pop-up.scss'],
})
export class CardErrorPopUp {
  @Input() message: string; // Usado para receber `componentProps`

  alreadyCheckSuccess = false;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private loadingHelper: LoadingHelper,
    private alertHelper: AlertHelper,
    private creditCardService: CreditCardService
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'custom-popup');
  }

  get hasCustomMessage(): boolean {
    return Boolean(this.message && this.message.length);
  }

  alreadyCheck(): void {
    this.loadingHelper.show();
    this.creditCardService
      .notifyUserCheckCardView()
      .subscribe(
        () => this.handleNotifyResponse(),
        () => this.handleNotifyResponse()
      );
  }

  handleNotifyResponse(): void {
    this.loadingHelper.hide();
    this.close().then(() => {
      this.alertHelper.show('Ok, vamos verificar o ocorrido e em breve entraremos em contato.');
    });
  }

  close(): Promise<boolean> {
    return this.modalCtrl.dismiss();
  }
}
