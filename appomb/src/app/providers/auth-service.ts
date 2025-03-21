import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { User, UserProvider } from '../shared/models/user.model';
//import { FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { Observable, Subject, lastValueFrom, of, throwError } from 'rxjs';
import { AppConfig } from '../../configs';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingHelper } from '../utils/loading-helper';
import { AlertHelper } from '../utils/alert-helper';
import { ToastHelper } from '../utils/toast-helper';
import { LoggerService } from './logger-service';
import { AuthHttp } from './auth-http';
import { ResponseError } from '../utils/response-helper';
import { ERROR_USER_EXISTS } from '../shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseProvider } from './database/database-provider';
import { IUserProfile } from '../shared/interfaces';
import { CacheService } from 'ionic-cache';
import { UserProfileService } from './user-profile.service';
import { Utils } from '../utils/utils';
import { TrackHelper } from './track-helper/track-helper';
import { EventService } from './event.service';
import * as Logger from 'bunyan';
import { catchError, map } from 'rxjs/operators';
import moment from 'moment';
import { Router } from '@angular/router';


let Cadastrouemail: boolean = false;
export interface loginCredentials {
  email: string;
  password: string;
}

export interface IGoogleUserData {
  idToken: string;
  displayName: string;
  userId: number;
  email: string;
  serverAuthCode: string;
  imageUrl: string;
}

export interface IFacebookUserData {
  picture: {
    data: {
      url: string;
    }
  }
  name: string;
  email: string;
}

export interface IResponseToken {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

export interface IJWTUser {
  id: number;
  url: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_social_user?: boolean;
  is_store_seller?: boolean;
  delivery_employee_id?: number;
  stores_seller_ids?: number[];
  stores_seller_ids_can_admin_app?: number[];
  profile: IUserProfile;
}

export interface signUpCredentials {
  name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface EditPasswordData {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ForgotPasswordData {
  email: string;
  code: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ForgotPasswordCodeData {
  email: string;
  code: string;
}

@Injectable()
export class AuthService {

  static TOKEN_NAME = 'id_token';
  static NEXT_REFRESH_TOKEN_NAME = 'next_refresh';
  static REFRESH_TOKEN_NAME = 'id_refresh_token';

  GOOGLE_CONF = {};

  logger: Logger;
  userChange$ = new Subject<void>();

  constructor(private http: HttpClient,
              private storage: Storage,
              private events: EventService,
              private loadingHelper: LoadingHelper,
              private trackHelper: TrackHelper,
              private alertHelper: AlertHelper,
              loggerService: LoggerService,
              private authHttp: AuthHttp,
              private toastHelper: ToastHelper,
              private db: DatabaseProvider,
              private trans: TranslateService,
              public cache: CacheService,
              public userProfileService: UserProfileService,
              private appConfig: AppConfig,
              private navCtrl: NavController,
              private router: Router,) {
    this.logger = loggerService.create('AuthService');
    this.GOOGLE_CONF = {
      'webClientId': this.appConfig.GOOGLE_CLIENT_ID,
      'offline': true,
    };
  }

  notifyUserChanged() {
    this.userChange$.next();
  }

  navigateToHome() {
    this.navCtrl.navigateRoot('/home'); // Substitui setRoot
  }

  // get navCtrl(): any {
  //   return this.app.getRootNav();
  // }

  getAuthHeader(): Promise<{ headers: HttpHeaders }> {
    return this.getToken().then((token) => {
      if (!token) {
        throw new Error('No token found to create an auth header.');
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return { headers }; // Retorna o objeto de opções com o cabeçalho
    });
  }

  // LOGIN PROVIDERS

  async login(credentials: loginCredentials): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.post(`${this.appConfig.SERVER_API}${this.appConfig.API_GET_TOKEN}`, {
          username: credentials.email,
          password: credentials.password,
          grant_type: 'password',
          client_id: this.appConfig.SERVER_OAUTH2_CLIENT_ID
        })
      );

      await this.setTokenWithResponse(response as IResponseToken);
      const user = await this.updateUserFromServer();

      // Notifica o callback que o usuário foi autenticado
      this.onAuthUser(user);
    } catch (error) {
      this.onLoginError(error);
    }
  }

  async loginGoogle() {
    
  }
  

  loginFacebook() {
    
  }

  logout() {
    // store current selected store to restore later
    const destroyDb = this.db.destroy();
    const destroyStorage = this.storage.clear();
    const destroyCache = this.cache.clearAll();
    Promise.all([destroyDb, destroyStorage, destroyCache])
      .then(() => {
        this.events.emitEvent('userLogOut');
      }).catch(() => {
      this.events.emitEvent('userLogOut');
    });
  }

  loggedIn(autoRefresh = false): Promise<boolean> {
    return this.getToken().then((token) => {
      // user not auth
      if (!token) {
        return false; // NOT LOGGED IN
      }
      // user is auth, check for token expiration
      return this.isTokenExpired().then((isExpired) => {
        if (!isExpired) {
          return true; // IS LOGGED IN
        }
        if (autoRefresh) {
          return this.refreshToken().then(() => {
            return true; // IS LOGGED IN
          })
        }
        return false;
      });
    })
  }

  // LOGIN CALLBACKS

  onAuthUser(user: User) {
    this.refreshUserProfile().then(() => {
      this.getUserProfile().then((profile) => {
        if (!profile.mobile_phone) {
          // Substitui push por navigateForward
          this.navCtrl.navigateForward('/RegisterMobilePhone').then(() => {
            this.loadingHelper.hide();
          });
        } else {
          this.events.emitEvent('userLogIn', user);
        }
      });
    });
  }

  onLoginGoogle(googleResponse: any) {

    console.debug('Received response from Google API...');
    console.debug(googleResponse);

    this.getGoogleTokenFromIdToken(googleResponse.Authentication.idToken, googleResponse.Authentication.accessToken).subscribe(
      // SUCCESS - Server returns token
      (response: IResponseToken) => {

        console.debug('getGoogleTokenFromIdToken callback');
        console.debug(response);

        this.getServerTokenFromSocialToken(response.access_token, 'google-plus').subscribe(
          // SUCCESS - Server returns converted token
          (response: IResponseToken) => {
            console.debug('getServerTokenFromSocialToken callback');
            console.debug(response);
            console.debug('token and refresh_token is set...');

            // this.setUserFromGoogle(googleResponse).then(() => {
            this.setTokenWithResponse(response).then(() => {

              this.updateUserSocialPhotoUrl(googleResponse.imageUrl);

              // getting User instance than was set after login with Google

              let userGoogle = UserProvider.fromGoogle(googleResponse);
              this.updateUserFromServer(userGoogle).then((user) => {
                // notify callback that user was logged in
                this.onAuthUser(user);
              });

              // this.getUser().then(
              //   (user) => {
              //     console.debug('User was set: ');
              //     console.debug(user);
              //     // notify callback that user was logged in
              //     this.onAuthUser(user);
              //   }
              // ).catch(this.handleGoogleLoginError.bind(this));

            });
            // });
          },
          // ERROR - Server NOT returns converted token
          this.handleGoogleLoginError.bind(this)
        );

      },
      // ERROR - Server NOT returns token
      this.handleGoogleLoginError.bind(this)
    );

  }

  savePushToken(data: {
    userId: string;
    pushToken: string;
  }) {
    return this.userProfileService.edit(<any>{
      push_token: data.pushToken,
      push_user_id: data.userId,
    });
  }

  updateAppVersion(appVersion) {
    return this.userProfileService.edit(<any>{
      app_version: appVersion
    });
  }

  handleGoogleLoginError(error: Response | any) {
    
  }

  onLoginFacebook(res: any) {
    
  }

  onSocialLoginError(error) {
    console.log('onSocialLoginError');
    console.log(error);
    if (!error || error === 12501 /* google */ || error.errorCode !== 4201 /* facebook */) {
      // user dismiss the social auth pop up
      this.loadingHelper.hide();
      return;
    }
    this.trans.get(['ERROR', 'ERROR_TRY_ANOTHER_LOGIN_WAY']).subscribe((res) => {
      this.alertHelper.show(
        res.ERROR, res.ERROR_TRY_ANOTHER_LOGIN_WAY
      );
    });
    this.handleError(error);
  }

  onLoginError(error) {
    if (error instanceof Response) {
      const body: any = error|| {};
      if (body.error === 'invalid_grant') {
        // user was input invalid credentials
        console.debug('Invalid login:');
        console.debug(error);
        this.loadingHelper.hide();
        this.alertHelper.show(
          'Login incorreto',
          'Verifique as informações de acesso e tente novamente.'
        );
      } else {
        this.handleError(error);
      }
    } else {
      this.handleError(error);
    }
  }

  async updateUserFromServer(socialUser?: User): Promise<User> {
    try {
      // Obtém os cabeçalhos de autenticação
      const header = await this.getAuthHeader();
  
      // Faz a requisição para obter os dados do usuário
      const userData: any = await lastValueFrom(
        this.http.get(`${this.appConfig.SERVER_API}${this.appConfig.API_GET_USER_DATA}`, header)
      );
  
      let user: IJWTUser = userData.results[0];
  
      // Atualiza os dados do usuário se for um socialUser
      if (socialUser) {
        user.is_social_user = true;
        if (user.profile) {
          user.profile.user_photo = socialUser.profile.user_photo;
        }
      }
  
      // Define o usuário obtido no sistema e retorna o resultado
      return await this.setUserFromServer(user);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  VerifyValidatedEmail(credentials: signUpCredentials): Observable<any> {
    return this.http.post(`${this.appConfig.SERVER_API}${this.appConfig.API_VERIFY_EMAIL_VALIDATED}`, {
      email: credentials.email
    }).pipe(
      map((resp: any) => {
      return resp;
    }));               
  }

  deleteaccount(user: User): Observable<any> {
    this.loadingHelper.show();
  
    return this.authHttp
      .post(`${this.appConfig.SERVER_API}${this.appConfig.API_DELETE_ACCOUNT}`, { iduser: user.id })
      .pipe(
        map((resp: any) => {
          // Retorna a resposta já desserializada
          return resp;
        }),
        catchError((error) => {
          console.error('Error deleting account:', error);
          this.loadingHelper.hide(); // Esconde o loader em caso de erro
          return of(null); // Emite um valor nulo ou alternativo no fluxo em caso de erro
        }),
        map(() => {
          this.loadingHelper.hide(); // Esconde o loader em caso de sucesso
          return null; // Retorna valor após ocultar o loader
        })
      );
  }

  signUp(credentials: signUpCredentials, PrimeiraTentativa: Boolean) {
    this.loadingHelper.show();
    this.authHttp.post(`${this.appConfig.SERVER_API}${this.appConfig.API_SIGN_UP}`, credentials)
      .toPromise()
      .then((result) => {
        this.VerifyValidatedEmail(credentials).subscribe((resp) => {            
          if (resp.result){
            this.osSignUpSuccess(result as Response, credentials);
            return result;
          }
          else 
          {
            return null;    
            let mensagem: string;
            if (PrimeiraTentativa){
              mensagem = 'VERIFY_EMAIL_FIRST_MESSAGE';
              Cadastrouemail = true;
            }
            else
              mensagem = 'VERIFY_EMAIL_SECOND_MESSAGE';
            this.trans.get(['VERIFY_EMAIL_TITLE', mensagem], {email:credentials.email}).subscribe((res) => {
              if (PrimeiraTentativa)
                mensagem = res.VERIFY_EMAIL_FIRST_MESSAGE
              else
              mensagem = res.VERIFY_EMAIL_SECOND_MESSAGE
              this.alertHelper.confirm(res.VERIFY_EMAIL_TITLE, mensagem,'Já Verifiquei', 'Cancelar').then((confirmed) => {
                if (confirmed) {
                  this.signUp(credentials,false) 
                }               
                else  
                  this.loadingHelper.hide()
              })
            });                     
          }
       })
      })
      .catch((error) => this.onSignUpError(error, credentials.email));
  }

  osSignUpSuccess(response: Response, credentials: signUpCredentials) {
    this.trackHelper.trackByName(TrackHelper.EVENTS.CREATED_ACCOUNT, {email: credentials.email});
    console.debug('osSignUpSuccess with user info: ');
    console.debug(response);
    this.loadingHelper.show();
    this.login({email: credentials.email, password: credentials.password});
  }

  onSignUpError(error: any, email: string) {
    this.loadingHelper.hide();
    console.debug('Error signUp:', error);
  
    if (error instanceof Response) {
      const serverResponse = new ResponseError(error);
      if (serverResponse.isError(ERROR_USER_EXISTS)) {
        this.trans.get(['EMAIL_ALREADY_IN_USE', 'WANT_REDIRECT_TO_LOGIN_SCREEN']).subscribe((res) => {
          if (Cadastrouemail) {
            this.toastHelper.show({
              message: 'E-mail cadastrado com sucesso!',
              cssClass: 'toast-success'
            });
            this.navCtrl.navigateForward('/sign-in', { state: { email } }).then(() => {
              this.loadingHelper.hide();
            });
          } else {
            this.alertHelper
              .confirm(res.EMAIL_ALREADY_IN_USE, res.WANT_REDIRECT_TO_LOGIN_SCREEN)
              .then((confirmed) => {
                if (confirmed) {
                  this.loadingHelper.show();
                  this.navCtrl.navigateForward('/sign-in', { state: { email } }).then(() => {
                    this.loadingHelper.hide();
                  });
                }
              });
          }
        });
      } else {
        this.handleError(error);
      }
    } else {
      this.handleError(error);
    }
  }

  editPassword(data: EditPasswordData): Promise<any> {
    return this.getAuthHeader()
      .then((header) => {
        return this.http.post(`${this.appConfig.SERVER_API}${this.appConfig.API_EDIT_PASSWORD}`, data, header)
          .toPromise()
          .catch(this.handleError.bind(this));
      })
      .catch(this.handleError.bind(this));
  }

  sendResetPasswordCode(email: string): Observable<any> {
    return this.authHttp
      .post(`${this.appConfig.SERVER_API}${this.appConfig.API_SEND_RESET_PASSWORD_CODE}`, { email })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  confirmResetPasswordCode(data: ForgotPasswordCodeData): Observable<any> {
    return this.authHttp
      .post(`${this.appConfig.SERVER_API}${this.appConfig.API_CONFIRM_RESET_PASSWORD_CODE}`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  setNewPasswordReset(data: ForgotPasswordData): Observable<any> {
    return this.authHttp
      .post(`${this.appConfig.SERVER_API}${this.appConfig.API_SET_NEW_PASSWORD_RESET}`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  setTokenWithResponse(response: IResponseToken): Promise<void | any[]> {
    let promises = [];
    promises.push(this.setRefreshToken(response.refresh_token));
    promises.push(this.setNextRefresh(response.expires_in));
    promises.push(this.setToken(response.access_token));
    return Promise.all(promises)
      .catch((e) => {
        this.handleError(e);
      });
  }

  setUserFromServer(userFromServer: IJWTUser): Promise<User> {
    console.debug('Setting use data with: ');
    console.debug(userFromServer);
    return this.setUser(UserProvider.fromServer(userFromServer))
      .then((user) => {
        return user;
      })
  }

  updateUserSocialPhotoUrl(photoUrl: string) {
    console.debug('Setting user social photo...');
    this.userProfileService.edit(<any>{
      user_photo_social: photoUrl
    }).subscribe(
      () => console.debug(`User social photo was set: ${photoUrl}`),
      e => console.error(e)
    );
  }

  setUserFromGoogle(googleResponse: IGoogleUserData) {
    return this.setUser(UserProvider.fromGoogle(googleResponse));
  }

  setUserFromFacebook(facebookId: string): Promise<User> {
    return null
  }

  isTokenExpired(): Promise<boolean> {
    return this.getNextRefresh()
      .then((nextRefresh) => {
        if (nextRefresh) {
          const date = moment(nextRefresh).toDate();
          const expired = date.toString() === 'Invalid Date' || date.getTime() <= new Date().getTime();
          return expired;
        } else {
          // Não há próxima atualização; considera como expirado
          return true;
        }
      })
      .catch((error) => {
        this.handleError(error); // Trata o erro
        return true; // Considera como expirado em caso de erro
      });
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
  
      const res: IResponseToken = await lastValueFrom(
        this.http.post<IResponseToken>(
          `${this.appConfig.SERVER_API}${this.appConfig.API_REFRESH_TOKEN}`,
          {
            grant_type: 'refresh_token',
            client_id: this.appConfig.SERVER_OAUTH2_CLIENT_ID,
            refresh_token: refreshToken,
          }
        )
      );
  
      console.debug('refreshToken: received response from server:', res);
  
      await this.setTokenWithResponse(res);
    } catch (error) {
      console.error('Error during refresh token:', error);
      this.handleError(error);
      throw error;
    }
  }

  getServerTokenFromSocialToken(token: string, backend: string): Observable<IResponseToken> {
    return this.http
      .post<IResponseToken>(`${this.appConfig.SERVER_API}${this.appConfig.API_CONVERT_TOKEN_PATH}`, {
        grant_type: 'convert_token',
        client_id: this.appConfig.SERVER_OAUTH2_CLIENT_ID,
        backend: backend,
        token: token,
      })
      .pipe(
        map((res: IResponseToken) => {
          console.debug('getServerTokenFromSocialToken: Received response from server:', res);
          return res; // O JSON já é retornado automaticamente
        }),
        catchError((error) => {
          console.error('Error in getServerTokenFromSocialToken:', error);
          return this.handleError(error);
        })
      );
  }

  getGoogleTokenFromIdToken(idToken: string, authCode: string): Observable<IResponseToken> {
    return null
  }

  // GETTERS & SETTERS

  setUser(user: User): Promise<any> {
    return this.storage.set('userData', JSON.stringify(user)).then(() => {
      this.notifyUserChanged();
    });
  }

  getUser(): Promise<User> {
    return this.storage.get('userData')
      .then((userData: string) => {
          try {
            return <User>JSON.parse(userData);
          } catch (e) {
            return null;
          }
        }
      );
  }

  async refreshUserProfile(): Promise<void> {
    try {
      const header = await this.getAuthHeader();
  
      // Realiza a requisição com os cabeçalhos apropriados
      const resp: any = await lastValueFrom(
        this.http.get(`${this.appConfig.SERVER_API}${this.appConfig.API_GET_USER_DATA}`, header)
      );
  
      const user: User = resp.results?.[0] || {};
  
      // Atualiza o perfil do usuário
      await this.setUserProfile(user.profile);
    } catch (error) {
      console.error('Error in refreshUserProfile:', error);
      this.handleError(error);
    }
  }

  setUserProfile(profile: IUserProfile): Promise<any> {
    return this.storage.set('user_profile', JSON.stringify(profile)).then(() => {
      this.notifyUserChanged();
    });
  }

  getUserProfile(): Promise<IUserProfile> {
    return this.storage.get('user_profile').then((profile) => {
      return JSON.parse(profile);
    });
  }

  isAdmin(): Promise<boolean> {
    return this.getUser().then((user) => {
      if (Utils.isNullOrUndefined(user)) {
        return false;
      }
      return user.is_staff;
    });
  }

  setToken(token): Promise<any> {
    return this.storage.set(AuthService.TOKEN_NAME, token);
  }

  getToken(): Promise<string> {
    return this.storage.get(AuthService.TOKEN_NAME);
  }

  setRefreshToken(token): Promise<any> {
    return this.storage.set(AuthService.REFRESH_TOKEN_NAME, token);
  }

  getRefreshToken(): Promise<string> {
    return this.storage.get(AuthService.REFRESH_TOKEN_NAME);
  }

  getNextRefresh(): Promise<string> {
    return this.storage.get(AuthService.NEXT_REFRESH_TOKEN_NAME);
  }

  setNextRefresh(nextRefreshSeconds: number): Promise<any> {
    let nextRefresh = moment().add(nextRefreshSeconds, 'seconds');
    console.debug('Set next refresh date to ' + nextRefresh.toString());
    return this.storage.set(AuthService.NEXT_REFRESH_TOKEN_NAME, nextRefresh.toISOString());
  }

  updateName(name: string) {
    return this.authHttp.post(`${this.appConfig.SERVER_API}${this.appConfig.API_UPDATE_USER_NAME}`, {name: name})
      .toPromise().then(() => {
        return this.getUser().then((u) => {
          u.first_name = name;
          u.full_name = name;
          return this.setUser(u);
        });
      });
  }

  handleError(error?: Response | any) {
    console.error(error);
    // hide any loading if has any active
    this.loadingHelper.hide();

    if (this.router.url === '/DummyPage') {
      this.router.navigate(['/Login']);
    }

    let errMsg: string;
    if (error instanceof Response) {
      // handler common errors

      let serverResponse = new ResponseError(error);
      if (serverResponse.getErrorMessage() || serverResponse.isFormValidationError()) {
        this.alertHelper.show(serverResponse.getErrorMessage() || 'Verifique os erros e tente novamente.');
      } else {
        // GENERIC SERVER ERROR
        this.trans.get(['ERROR', 'ERROR_REQUEST']).subscribe((res: any) => {
          this.alertHelper.show(res.ERROR, res.ERROR_REQUEST);
        });
        let body: any = {};
        try {
          body = error|| {};
        } catch (e) {
          body = {}
        }
        // make error message
        console.debug('handlerError: error received:');
        console.debug(error);
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      }
    } else {
      // GENERIC ERROR
      this.trans.get(['ERROR', 'ERROR_REQUEST']).subscribe((res) => {
        this.alertHelper.show(
          res.ERROR, res.ERROR_REQUEST
        );
      });
      errMsg = error.message ? error.message : error.toString();
    }

    this.logger.error(error);

    return throwError(() => new Error(errMsg || 'Server error'));
  }

}
