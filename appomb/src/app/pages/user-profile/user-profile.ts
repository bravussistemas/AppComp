import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../shared/models/user.model';
import { IUserProfile } from '../../shared/interfaces';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';

/**
 * Generated class for the UserProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  user: User;
  userProfile: IUserProfile;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertHelper: AlertHelper,
              private toastHelper: ToastHelper,
              private loadingHelper: LoadingHelper,              
              public auth: AuthService,
              private router: Router) {

  }

  openEditNamePrompt() {
    this.alertHelper
      .prompt({
        header: 'Alterar nome',
        inputs: [
          {
            type: 'text',
            name: 'name',
            value: this.user.full_name,
            placeholder: 'Digite seu nome e sobrenome'
          }
        ]
      }).then((data: any) => {
      if (data.name) {
        this.loadingHelper.show();
        this.auth.updateName(data.name).then(() => {
          this.loadingHelper.hide();
          this.loadUserData();
        }, () => {
          this.alertHelper.show('Ocorreu um erro na sua requisição, verifique sua conexão com a internet.');
          this.loadingHelper.hide();
        });
      }
    });
  }

  loadUserData() {
    this.auth.getUser().then((user) => {
      this.auth.getUserProfile().then((p) => {
        this.userProfile = p;
      });
      this.user = user;
    })
  }

  ionViewDidLoad() {
    this.loadUserData();
  }

  gotToEditPassword() {
    this.router.navigate(['/EditPasswordPage']);
  }

  deleteaccount() {
    this.alertHelper.confirm("Atenção", "Deseja realmente excluir sua conta? Esse processo é irreversivel!").then((confirmed) => {
      if (confirmed) {
        this.loadingHelper.show()
        this.auth.deleteaccount(this.user).subscribe((resp) => {      
          this.loadingHelper.hide()
          if (resp.result) {
            this.auth.logout()   
            this.toastHelper.show({message: 'Conta Excluida com sucesso!', cssClass: 'toast-custom-white'});         
          }          
        })         
      }               
    })
  }

  gotToEditPhone() {
    this.router.navigate(['/RegisterMobilePhone'], { queryParams:{
      mobilePhone: (this.userProfile.mobile_phone_area || '') + (this.userProfile.mobile_phone || ''),
      enableBackButton: true
    }});
  }

  gotToEditName() {
    this.openEditNamePrompt();
  }

}
