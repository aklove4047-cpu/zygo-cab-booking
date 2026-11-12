const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = __dirname;
const TEMPLATE_WRAPPER_DIR = 'C:/Users/annu bhai/Desktop/subh game/Disawar Guru/Disawar Guru Android User App';
const ANDROID_SDK_DIR = 'C:/Users/annu bhai/AppData/Local/Android/Sdk';

function copyDir(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    if (exclude.includes(item)) continue;
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d, exclude);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function createAndroidProject({ projectDir, packageName, appName, isDriver }) {
  console.log(`\n========================================`);
  console.log(`Creating Project: ${appName} (${packageName})`);
  console.log(`Directory: ${projectDir}`);
  console.log(`========================================`);

  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });

  // 1. Copy Gradle wrapper
  const wrapperDest = path.join(projectDir, 'gradle', 'wrapper');
  fs.mkdirSync(wrapperDest, { recursive: true });
  fs.copyFileSync(path.join(TEMPLATE_WRAPPER_DIR, 'gradlew.bat'), path.join(projectDir, 'gradlew.bat'));
  fs.copyFileSync(path.join(TEMPLATE_WRAPPER_DIR, 'gradlew'), path.join(projectDir, 'gradlew'));
  fs.copyFileSync(path.join(TEMPLATE_WRAPPER_DIR, 'gradle/wrapper/gradle-wrapper.jar'), path.join(wrapperDest, 'gradle-wrapper.jar'));
  fs.copyFileSync(path.join(TEMPLATE_WRAPPER_DIR, 'gradle/wrapper/gradle-wrapper.properties'), path.join(wrapperDest, 'gradle-wrapper.properties'));

  // 2. local.properties
  fs.writeFileSync(path.join(projectDir, 'local.properties'), `sdk.dir=${ANDROID_SDK_DIR.replace(/\//g, '\\\\')}\n`);

  // 3. gradle.properties
  fs.writeFileSync(path.join(projectDir, 'gradle.properties'), 
`org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
android.enableJetifier=true
`);

  // 4. settings.gradle.kts
  fs.writeFileSync(path.join(projectDir, 'settings.gradle.kts'),
`pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${appName.replace(/\s+/g, '')}"
include(":app")
`);

  // 5. root build.gradle.kts
  fs.writeFileSync(path.join(projectDir, 'build.gradle.kts'),
`plugins {
    id("com.android.application") version "8.5.2" apply false
}
`);

  // 6. app/build.gradle.kts
  const appDir = path.join(projectDir, 'app');
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, 'build.gradle.kts'),
`plugins {
    id("com.android.application")
}

android {
    namespace = "${packageName}"
    compileSdk = 34

    defaultConfig {
        applicationId = "${packageName}"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        viewBinding = false
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("com.google.android.material:material:1.12.0")
}
`);

  // 7. AndroidManifest.xml
  const srcMain = path.join(appDir, 'src', 'main');
  fs.mkdirSync(srcMain, { recursive: true });
  fs.writeFileSync(path.join(srcMain, 'AndroidManifest.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="${appName}"
        android:roundIcon="@drawable/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZygoApp"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`);

  // 8. Resources: values (strings, colors, styles)
  const resDir = path.join(srcMain, 'res');
  const valuesDir = path.join(resDir, 'values');
  const drawableDir = path.join(resDir, 'drawable');
  const layoutDir = path.join(resDir, 'layout');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.mkdirSync(drawableDir, { recursive: true });
  fs.mkdirSync(layoutDir, { recursive: true });

  fs.writeFileSync(path.join(valuesDir, 'strings.xml'),
`<resources>
    <string name="app_name">${appName}</string>
</resources>
`);

  const primaryColor = isDriver ? "#1FB6A6" : "#1FB6A6";
  const primaryDark = isDriver ? "#0B1120" : "#0E5CAD";

  fs.writeFileSync(path.join(valuesDir, 'colors.xml'),
`<resources>
    <color name="primary">${primaryColor}</color>
    <color name="primary_dark">${primaryDark}</color>
    <color name="accent">#F4C430</color>
    <color name="bg_dark">#0F172A</color>
</resources>
`);

  fs.writeFileSync(path.join(valuesDir, 'styles.xml'),
`<resources>
    <style name="Theme.ZygoApp" parent="Theme.MaterialComponents.Light.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
        <item name="android:statusBarColor">@color/primary_dark</item>
        <item name="android:windowBackground">@color/bg_dark</item>
    </style>
</resources>
`);

  // 9. Copy icon
  const iconSource = path.join(BASE_DIR, 'zygo-website', 'assets', 'images', 'icon.png');
  if (fs.existsSync(iconSource)) {
    fs.copyFileSync(iconSource, path.join(drawableDir, 'ic_launcher.png'));
  }

  // 10. Layout activity_main.xml
  fs.writeFileSync(path.join(layoutDir, 'activity_main.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<androidx.swiperefreshlayout.widget.SwipeRefreshLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/swipeRefresh"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.swiperefreshlayout.widget.SwipeRefreshLayout>
`);

  // 11. Java Code MainActivity.java
  const pkgPath = packageName.replace(/\./g, '/');
  const javaDir = path.join(srcMain, 'java', pkgPath);
  fs.mkdirSync(javaDir, { recursive: true });

  const startAsset = isDriver ? 'driver.html' : 'index.html';

  fs.writeFileSync(path.join(javaDir, 'MainActivity.java'),
`package ${packageName};

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private ValueCallback<Uri[]> uploadMessage;
    private static final int PERMISSION_REQ_CODE = 101;
    private static final String LOCAL_URL = "file:///android_asset/www/${startAsset}";

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        swipeRefresh = findViewById(R.id.swipeRefresh);

        setupWebView();
        requestAppPermissions();

        swipeRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webView.reload();
            }
        });

        webView.loadUrl(LOCAL_URL);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return handleUrl(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(url);
            }

            private boolean handleUrl(String url) {
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || url.startsWith("sms:") || url.startsWith("upi:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "App not available for this action", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                swipeRefresh.setRefreshing(false);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    request.grant(request.getResources());
                }
            }
        });
    }

    private void requestAppPermissions() {
        String[] permissions = new String[]{
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.CAMERA
        };

        boolean needPermission = false;
        for (String p : permissions) {
            if (ContextCompat.checkSelfPermission(this, p) != PackageManager.PERMISSION_GRANTED) {
                needPermission = true;
                break;
            }
        }

        if (needPermission) {
            ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQ_CODE);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`);

  // 12. Copy website bundle to assets/www
  const assetsDir = path.join(srcMain, 'assets', 'www');
  console.log(`Copying website bundle to assets/www...`);
  copyDir(path.join(BASE_DIR, 'zygo-website'), assetsDir, ['downloads', '.git']);
  console.log(`Assets copied successfully.`);
}

// 1. Create Customer App project
const customerDir = path.join(BASE_DIR, 'android-apps', 'zygo-customer-app');
createAndroidProject({
  projectDir: customerDir,
  packageName: 'com.zygo.customer',
  appName: 'Zygo Cabs',
  isDriver: false
});

// 2. Create Driver App project
const driverDir = path.join(BASE_DIR, 'android-apps', 'zygo-driver-app');
createAndroidProject({
  projectDir: driverDir,
  packageName: 'com.zygo.driver',
  appName: 'Zygo Driver',
  isDriver: true
});

console.log('\n========================================');
console.log('Both Android projects created successfully!');
console.log('========================================\n');

