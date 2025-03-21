import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSearchbar } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { UserCreditService } from '../../providers/user-credit.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';

@Component({
  selector: 'page-adm-manager-user-credits',
  templateUrl: './adm-manager-user-credits.html',
  styleUrls: ['./adm-manager-user-credits.scss'],
})

export class AdmManagerUserCreditsPage implements OnInit {

  searchTextToAdd: string;
  page = 1;
  limit = 7;
  usersList = [];
  canLoadMore = true;
  @ViewChild('searchBar') searchBar: IonSearchbar;

  constructor(public navCtrl: NavController,
              public loadingHelper: LoadingHelper,
              public toastHelper: ToastHelper,
              public userCreditService: UserCreditService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 350);
  }

  ionViewDidEnter() {
    this.loadUsers('usersList');
  }

  onInputSearchToAdd(e) {
    this.usersList = [];
    this.page = 1;
    this.loadUsers('usersList');
  }

  loadMore() {
    if (this.loadingHelper.isLoading('usersListMore')) {
      return;
    }
    this.page += 1;
    this.loadUsers('usersListMore');
  }

  loadUsers(loaderName) {
    if (!this.searchTextToAdd || this.searchTextToAdd.length === 0) {
      return;
    }
    this.loadingHelper.setLoading(loaderName, true);
    this.userCreditService.list(this.page, this.limit, this.searchTextToAdd)
      .subscribe((resp) => {
        this.loadingHelper.setLoading(loaderName, false);
        const data = resp;
        const users = data.users;
        const pages = data.pages;
        this.canLoadMore = this.page < pages;
        if (this.page === 1) {
          this.usersList = users;
        } else {
          this.usersList = this.usersList.concat(users);
        }
      }, (error) => {
        console.error(error);
        this.loadingHelper.setLoading(loaderName, false);
        this.toastHelper.show({message: 'Ocorreu um erro, verifique sua conexão.', cssClass: 'toast-error'});
      })
  }

  ngOnInit(): void {
  }

  detail(userId: number) {
    this.router.navigate(['/adm-detail-user-credits'], { queryParams: { userId: userId } });
  }

}
