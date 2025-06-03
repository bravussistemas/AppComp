// const utils = require("./utils"),
// { version } = require("../package.json"),
// fs = require("fs"),
// path = require("path"),
// os = require("os"),
// exec = require("child_process").execSync;

const { execSync } = require("child_process");
const { version } = require("../package.json");
const fs = require("fs");
const path = require("path");

// Configurações do Keystore
const KEYSTORE_PATH = "ohmybread.keystore";
const KEYSTORE_PASS = "Ohmybread32#@";
const KEY_ALIAS = "ohmybread";

// Caminhos do SDK Android
const ANDROID_SDK_VERSION = "36.0.0";
const ANDROID_HOME = "C:/Users/wever/AppData/Local/Android/Sdk";
const BUILD_TOOLS = `${ANDROID_HOME}/build-tools/${ANDROID_SDK_VERSION}`;
// const APK_PATH = "platforms/android/app/build/outputs/bundle/release/";
// Caminhos do AAB
const APK_PATH = "android/app/build/outputs/bundle/release/";
const APK_UNSIGNED_PATH = `${APK_PATH}app-release.aab`;
const APK_ALIGNED_PATH = `${APK_PATH}app-unsigned-aligned.aab`;
const APK_SIGNED_PATH = `${APK_PATH}app-release-signed.aab`;

// Gradle correto para cada SO
const isWindows = process.platform === "win32";
const GRADLE_CMD = isWindows ? "gradlew.bat" : "./gradlew";

// Comandos
const ALIGN_CMD = `${BUILD_TOOLS}/zipalign -v -p 4 ${APK_UNSIGNED_PATH} ${APK_ALIGNED_PATH}`;
const SIGN_CMD = `${BUILD_TOOLS}/apksigner sign --min-sdk-version 30 --ks ${KEYSTORE_PATH} --ks-pass pass:${KEYSTORE_PASS} --ks-key-alias ${KEY_ALIAS} --out ${APK_SIGNED_PATH} ${APK_ALIGNED_PATH}`;
const VERIFY_CMD = `jarsigner -verify -verbose -certs ${APK_SIGNED_PATH}`;

const APP_VERSION = version;

console.log("\n📦 Iniciando build de produção...\n");

// 1. Apagar arquivos antigos
if (fs.existsSync(APK_SIGNED_PATH)) {
  console.log("🧹 Removendo APK assinado anterior...");
  fs.unlinkSync(APK_SIGNED_PATH);
}
if (fs.existsSync(APK_ALIGNED_PATH)) {
  console.log("🧹 Removendo APK alinhado anterior...");
  fs.unlinkSync(APK_ALIGNED_PATH);
}

// 2. Sincronizar Capacitor com Android
console.log("🔄 Sincronizando projeto com Android (npx cap sync)...");
execSync("npx cap sync android", { stdio: "inherit" });

// 3. Gerar bundle .aab (release)
console.log("🏗️ Gerando bundle .aab (Gradle Release)...");
execSync(`cd android && ${GRADLE_CMD} bundleRelease`, { stdio: "inherit" });

// 4. Alinhar AAB
console.log("📐 Alinhando AAB...");
execSync(ALIGN_CMD, { stdio: "inherit" });

// 5. Assinar AAB
console.log("🔏 Assinando AAB...");
execSync(SIGN_CMD, { stdio: "inherit" });

// 6. Verificar assinatura
console.log("✅ Verificando assinatura...");
execSync(VERIFY_CMD, { stdio: "inherit" });

console.log(
  `\n🎉 AAB assinado com sucesso! Arquivo final: ${APK_SIGNED_PATH}\n`
);

// const AAB_UNSIGNED = path.join(APK_PATH, "app-release.aab");
// const AAB_SIGNED = path.join(APK_PATH, "app-release-signed.aab");

// const APK_UNSIGNED_PATH = APK_PATH + "app-release.aab";
// const APK_RELEASE_PATH = APK_PATH + "app-release-signed.aab";
// const APK_UNSIGNED_ALIGNED_PATH = APK_PATH + "app-unsigned-aligned.aab";

// const ANDROID_SDK_HOME =
//   ANDROID_HOME + "/build-tools/" + ANDROID_SDK_VERSION + "/";

// COMMANDS
// /Users/bravussistemas/Library/Android/sdk/build-tools/32.0.0/zipalign -v 4 platforms/android/app/build/outputs/bundle/release/app-release.aab platforms/android/app/build/outputs/bundle/release/app-unsigned-aligned.aab
// const ALIGN_APK_CMD =
//   ANDROID_SDK_HOME +
//   "zipalign -v -p 4 " +
//   APK_UNSIGNED_PATH +
//   " " +
//   APK_UNSIGNED_ALIGNED_PATH;
// /Users/bravussistemas/Library/Android/sdk/build-tools/32.0.0/apksigner sign --min-sdk-version 30 --ks ohmybread.keystore --ks-pass pass:Ohmybread32#@ --out platforms/android/app/build/outputs/bundle/release/app-release-signed.aab platforms/android/app/build/outputs/bundle/release/app-unsigned-aligned.aab
// const SIGN_APK_CMD =
//   ANDROID_SDK_HOME +
//   "apksigner sign --min-sdk-version 30 --ks " +
//   KEYSTORE_PATH +
//   " --ks-pass pass:" +
//   KEYSTORE_PASS +
//   " --out " +
//   APK_RELEASE_PATH +
//   " " +
//   APK_UNSIGNED_ALIGNED_PATH;
// /Users/bravussistemas/Library/Android/sdk/build-tools/32.0.0/apksigner verify platforms/android/app/build/outputs/bundle/release/app-release-signed.aab
// const VERIFY_APK_CMD =
//   ANDROID_SDK_HOME + "apksigner verify " + APK_RELEASE_PATH;

// REMOVE OLD RELEASE APK
// if (fs.existsSync(APK_RELEASE_PATH)) {
//   console.log("Removing old release apk file: " + APK_RELEASE_PATH);
//   fs.unlinkSync(APK_RELEASE_PATH);
// }

// // REMOVE OLD UNSIGNED APK
// if (fs.existsSync(APK_UNSIGNED_ALIGNED_PATH)) {
//   console.log(
//     "Removing old unsigned release apk file: " + APK_UNSIGNED_ALIGNED_PATH
//   );
//   fs.unlinkSync(APK_UNSIGNED_ALIGNED_PATH);
// }

// // EXECUTE THE BUILD
// exec("ionic cordova build android --prod --release", { stdio: [0, 1, 2] });
// exec(ALIGN_APK_CMD, { stdio: [0, 1, 2] });
// exec(SIGN_APK_CMD, { stdio: [0, 1, 2] });
// exec(VERIFY_APK_CMD, { stdio: [0, 1, 2] });
