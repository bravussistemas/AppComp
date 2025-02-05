import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root', // Torna o serviço globalmente acessível
})
export class LoadingHelper {
  private loading: HTMLIonLoadingElement | null = null;
  private loadingItems = {};
  private hideTimeout: any;

  constructor(private loadingCtrl: LoadingController) {}

  async show(message: string = '', timeout: number = 120000) {
    // Evita criar múltiplos loadings
    if (!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message, // Substitui `content` por `message`
      });
      await this.loading.present();

      // Configura o timeout para esconder o loading
      if (timeout) {
        this.hideTimeout = setTimeout(() => {
          this.hide();
        }, timeout);
      }
    }
  }

  async hide() {
    // Esconde o loading atual
    if (this.loading) {
      try {
        await this.loading.dismiss();
        this.loading = null; // Libera o recurso
      } catch (error) {
        console.error('Error dismissing loading:', error);
        setTimeout(() => this.hide(), 2000); // Tenta novamente em caso de erro
      }
    }

    // Limpa o timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  setLoading(loadingId: string, loading: boolean) {
    this.loadingItems[loadingId] = loading;
  }

  isLoading(loadingId: string): boolean {
    return !!this.loadingItems[loadingId];
  }

  clear() {
    this.loadingItems = {};
  }

  isLoadingAny(): boolean {
    return Object.values(this.loadingItems).some((item) => item === true);
  }
}
