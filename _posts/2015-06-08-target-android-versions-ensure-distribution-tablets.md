---
layout: post
title: Target Android Versions to ensure distribution to tablets
categories: [Android, GooglePlay, PhoneGapBuild]
tags: [SdkVersion, config.xml, tablets]
author: Victor Dias
---
Maybe after submiting your apk to Google Play you've seen the tip message "Design your app for tablets".
![dbyll-screenshot]({{ site.BASE_PATH }}/assets/media/Optimization_Tips_-_Triunfo_RI_-_Google_Play_Developer_Console.png)

If occured it means that targeted Android Versions should not support tablets. If it was not your intention to discard tablets support then you should target Android Versions Properly.

# Android Optimization Tip: "Design your app for tablets"
Designing your app for tablets can help you reach more customers on a wider variety of devices. Apps that are designed for tablets are showcased in the 'Designed for tablets' list in the Play Store.



# Target Android Versions
Initial support for tablets was added in [Android 3.0](http://developer.android.com/about/versions/android-3.0-highlights.html) (API level 11). Unified UI framework support for tablets, phones, and other devices was introduced in [Android 4.0](http://developer.android.com/about/versions/android-4.0-highlights.html) (API level 14). See [Android API levels](http://developer.android.com/guide/topics/manifest/uses-sdk-element.html#ApiLevels) if you need to know the correct level number you target.
  
Then, to ensure the broadest possible distribution to tablets, the **minimum Android version** OR **target Android version** need to support tablets:

- targetSdkVersion is declared with value 11 or higher (14 or higher is recommended), OR
- minSdkVersion is declared with value 11 or higher. 

# Configure properly your App
If you use phonegap to build your Android App, check following [PhoneGap Build Preferences] on your config.xml
android-targetSdkVersion is unset by default, in which case the default value matches that of minSdkVersion.
[Configuring Remote Builds](http://docs.phonegap.com/en/edge/config_ref_pgb_config.md.html)


This is a phonegap 3.5 / cordova 3 android app. In www/config.xml I have:

```xml
<preference name="android-minSdkVersion" value="17" />
<preference name="android-targetSdkVersion" value="19" />
```
However, when I build it, it creates an AndroidManifest.xml with:

```xml
<uses-sdk android:minSdkVersion="17" android:targetSdkVersion="19" />
```

# iPhone Deployment Target 
A similar feature exists for iOS, you can set it on your PGB config.xml

```xml
<preference name="deployment-target" value="7.0" />
```

[PhoneGap Build Preferences]: http://docs.build.phonegap.com/en_US/configuring_preferences.md.html#Preferences