import { Component, Renderer2 } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OperatingDaysNote } from '../../shared/models/operating-day-note.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Utils } from '../../utils/utils';
import { Browser } from '@capacitor/browser';
import { AppConfigService } from '../../providers/app-config.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'page-day-note-pop-up',
  templateUrl: 'day-note-pop-up.html',
})
export class DayNotePopUpPage {
  note: OperatingDaysNote;
  role: string;

  constructor(public navCtrl: NavController,
              private renderer: Renderer2,
              private sanitizer: DomSanitizer,
              private appConfig: AppConfigService,
              private loading: LoadingHelper,
              private router: Router,
              private route: ActivatedRoute,
            ) {
    this.renderer.addClass(document.body, 'custom-popup');
    this.route.queryParams.subscribe(params => {
      this.note = params['note'];
      this.role = params['role'] || 'normal';
    });
  }

  async openAppUpdate() {
    this.loading.show('Abrindo loja de aplicativos...');

    // Obtenha o nome do pacote do AppConfigService ou outro método
    const build = this.appConfig.buildConfig$.getValue();
    const packageName = build.packageName;

    // URL da Google Play Store
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
    // URL da Apple App Store (use seu ID do aplicativo aqui)
    const appStoreUrl = `https://apps.apple.com/app/id${packageName}`;

    // Abra a URL no navegador
    try {
      if (this.isAndroid()) {
        await Browser.open({ url: playStoreUrl });
      } else if (this.isIos()) {
        await Browser.open({ url: appStoreUrl });
      }
    } catch (error) {
      console.error('Erro ao abrir a loja de aplicativos:', error);
    } finally {
      this.loading.hide();
    }
  }

  // Verifica se é Android
  isAndroid(): boolean {
    return /android/i.test(navigator.userAgent);
  }

  // Verifica se é iOS
  isIos(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !this.isMSStream();
  }

  // Verifica se o navegador é legado com MSStream
  isMSStream(): boolean {
    return typeof (window as any).MSStream !== 'undefined';
  }


  noteVideoUrl() {
    if (Utils.isNullOrUndefined(this.note)) {
      return;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.note.url_video);
  }

  closeView() {
    // Retorna à página anterior
    this.router.navigate(['..']);
  }

  dismiss(save: boolean) {
    console.log('Dismiss with save:', save);
    // Adicione a lógica necessária para o encerramento ou salvamento
  }

}
