import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.ohmybread', // ID do aplicativo
  appName: 'Oh My Bread!', // Nome do aplicativo
  webDir: 'www', // Diretório onde o build é gerado

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Tempo em milissegundos (2 segundos)
      launchAutoHide: true, // Oculta automaticamente após tempo
      backgroundColor: '#000000', // Cor de fundo do splash
      splashFullScreen: true,
      androidScaleType: 'CENTER_CROP',
      iosContentMode: 'ScaleAspectFill',
      showSpinner: false, // Esconde spinner de carregamento
    },
  },

  // bundledWebRuntime: false, // Runtime do Capacitor no WebView

  // Configurações específicas de servidor
  // server: {
  //   // url: 'http://localhost',
  //   url: 'http://10.0.2.2:8100',
  //   cleartext: true,
  //   // allowNavigation: [
  //   //   '*', // Permite navegação para qualquer origem
  //   //   'http://ionic.local/*',
  //   //   'http://192.168.0.2:8100',
  //   //   'http://192.168.0.2:8101',
  //   //   'http://192.168.0.6:8100',
  //   //   'http://192.168.0.7:8100',
  //   //   'http://192.168.0.7:8101',
  //   //   'http://192.168.0.11:8100',
  //   //   'http://192.168.0.11:8101',
  //   // ],

  //   allowNavigation: [
  //     '*', // Permite navegação para qualquer origem
  //     'http://ionic.local/*',
  //     'http://192.168.0.2:8100',
  //     'http://192.168.0.2:8101',
  //     'http://192.168.0.6:8100',
  //     'http://192.168.0.7:8100',
  //     'http://192.168.0.7:8101',
  //     'http://192.168.0.11:8100',
  //     'http://192.168.0.11:8101',
  //     `http://192.168.15.5:8100`, // Adiciona o IP da sua máquina
  //     `http://192.168.15.5:8101`, // Adiciona o IP da sua máquina
  //     // Adicionando a URL do servidor de desenvolvimento
  //     'http://10.0.2.2:8100', // Endereço do servidor no emulador
  //     'http://10.0.2.2:8101', // Endereço do servidor no emulador
  //   ],
  //   // hostname: 'localhost',
  //   // androidScheme: 'https',
  // },

  // Configurações para Android
  // android: {
  //   //minVersion: '21',         // android-minSdkVersion
  //   //targetSdkVersion: '34',   // android-targetSdkVersion
  //   allowMixedContent: true, // Permite conteúdo misto (HTTP e HTTPS)
  //   appendUserAgent: ' Capacitor/Android',
  //   webContentsDebuggingEnabled: true, // Habilita depuração do WebView
  //   overrideUserAgent:
  //     'Mozilla/5.0 (Linux; Android 10; WebView) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',

  //   //splashScreenSpinnerEnabled: false, // Desativa spinner no SplashScreen
  //   backgroundColor: '#ffffff', // Define a cor de fundo
  // },

  // ios: {
  //   // ... additional configuration
  //   // cordovaLinkerFlags: ['-ObjC'], // Compatibilidade com plugins Cordova
  //   //splashScreenSpinnerEnabled: false, // Desativa spinner no SplashScreen
  //   backgroundColor: '#ffffff', // Define a cor de fundo
  //   handleApplicationNotifications: false,
  //   allowsLinkPreview: false, // Desativa preview de links
  //   overrideUserAgent:
  //     'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Mobile/15E148',
  //   appendUserAgent: ' Capacitor/iOS',
  // },
};

export default config;
