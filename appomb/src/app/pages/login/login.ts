import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth-service';
import { TrackEvent, TrackHelper } from '../../providers/track-helper/track-helper';
import { AppConfig } from '../../../configs';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  constructor(
    private router: Router,
    private trackHelper: TrackHelper,
    private appConfig: AppConfig,
    private auth: AuthService,
    private loadingHelper: LoadingHelper
  ) {}

  get appName() {
    return this.appConfig.APP_NAME;
  }

  ionViewDidEnter() {
    this.trackHelper.trackByName(TrackHelper.EVENTS.OPEN_LOGIN_PAGE);
  }

  goToSignInForm() {
    this.trackMethod('email');
    this.router.navigate(['/SignIn'], { state: { animate: true, direction: 'left' } });
  }

  async loginGoogle() {
    try {
      console.debug('Start loginGoogle');
      this.loadingHelper.show();
      const response = await this.auth.loginGoogle();
      console.log('Google login successful:', response);
    } catch (error) {
      console.error('Google login error:', error);
      this.onSocialLoginError(error);
    } finally {
      this.loadingHelper.hide();
    }
  }

  async loginFacebook() {
    try {
      console.debug('Start loginFacebook');
      this.loadingHelper.show();
      const response = await this.auth.loginFacebook();
      console.log('Facebook login successful:', response);
    } catch (error) {
      console.error('Facebook login error:', error);
      this.onSocialLoginError(error);
    } finally {
      this.loadingHelper.hide();
    }
  }

  createAccount() {
    const event = new TrackEvent(TrackHelper.EVENTS.CREATE_ACCOUNT);
    this.trackHelper.track(event);
    this.router.navigate(['/SignUp']);
  }

  trackMethod(method: string) {
    const event = new TrackEvent(TrackHelper.EVENTS.LOGIN_METHOD, { method });
    this.trackHelper.track(event);
  }

  googleEnabled() {
    return this.appConfig.GOOGLE_LOGIN_ENABLED;
  }

  facebookEnabled() {
    return this.appConfig.FACEBOOK_LOGIN_ENABLED;
  }

  private onSocialLoginError(error: any) {
    console.error('Social login error:', error);
    // Adicione lógica para exibir mensagens de erro ao usuário, se necessário.
  }
}
