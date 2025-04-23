import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  UserAddress,
  UserAddressProvider,
} from '../../providers/user-address/user-address';
import { AlertController } from '@ionic/angular';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'user-address-row',
  templateUrl: './user-address-row.html',
  styleUrl: './user-address-row.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserAddressRowComponent {
  @Input('userAddress') address: UserAddress;
  @Output() onDeleteAddress: EventEmitter<UserAddress> = new EventEmitter();

  constructor(
    private alertCtrl: AlertController,
    private userAddressProvider: UserAddressProvider,
    private loadingHelper: LoadingHelper
  ) {}

  async deleteAddress(event: MouseEvent, address: UserAddress) {
    event.stopPropagation();
    const confirmAlert = this.alertCtrl.create({
      header: 'Excluir Endereço?',
      message: address.address.simple_address,
      buttons: [
        {
          text: 'Excluir endereço',
          handler: () => {
            this.loadingHelper.show();
            this.userAddressProvider.delete(address).subscribe(
              () => {
                this.loadingHelper.hide();
                this.onDeleteAddress.emit(address);
              },
              (e) => {
                console.log(e);
                this.loadingHelper.hide();
              }
            );
          },
        },
        {
          text: 'Cancelar',
          role: 'destructive',
          handler: () => {
            return;
          },
        },
      ],
    });
    (await confirmAlert).present();
  }
}
