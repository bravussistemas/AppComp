import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.ohmybread', // ID do aplicativo
  appName: 'Oh My Bread!',  // Nome do aplicativo
  webDir: 'src',            // Diretório onde o build é gerado
  bundledWebRuntime: false, // Runtime do Capacitor no WebView

  // Configurações específicas de servidor
  server: {
    allowNavigation: [
      '*', // Permite navegação para qualquer origem
      'http://ionic.local/*',
      'http://192.168.0.2:8100',
      'http://192.168.0.2:8101',
      'http://192.168.0.6:8100',
      'http://192.168.0.7:8100',
      'http://192.168.0.7:8101',
      'http://192.168.0.11:8100',
      'http://192.168.0.11:8101',
    ],    
    hostname: "localhost",
    androidScheme: "https"
  },

  // Configurações para Android
  android: {
    //minVersion: '21',         // android-minSdkVersion
    //targetSdkVersion: '34',   // android-targetSdkVersion
    allowMixedContent: true,  // Permite conteúdo misto (HTTP e HTTPS)
    //splashScreenSpinnerEnabled: false, // Desativa spinner no SplashScreen
    backgroundColor: '#ffffff', // Define a cor de fundo
  },
  
  ios: {
    // ... additional configuration
    cordovaLinkerFlags: ['-ObjC'],  // Compatibilidade com plugins Cordova
    //splashScreenSpinnerEnabled: false, // Desativa spinner no SplashScreen
    backgroundColor: '#ffffff', // Define a cor de fundo
    handleApplicationNotifications: false
  },
};

export default config;
