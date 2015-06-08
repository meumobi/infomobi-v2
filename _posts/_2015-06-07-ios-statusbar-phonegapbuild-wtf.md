---
layout: post
title: How to face iOS StatusBar issues on PhoneGapBuild
categories: [iOS, PhoneGapBuild]
tags: [StatusBar, config.xml]
---

I've spent hours testing what should be a simple feature and very well documented. I recommend the [PhoneGap Developer's Guide to the iOS Status Bar] to handle this feature, seems to be the best documentation about.

# Handling and Customizing the iOS Status Bar
## Getting Started on PhoneGap Build and... arrrggg!!@
I didn't find any issues on phonegap CLI (didn't test cordova CLI), I've spent my time on PhoneGap Build (PGB) issues.

## Customizing via Configuration Settings

If you not use PhoneGap Build I think you are safe. I've tested on phonegap CLI and seems to work fine 

- [Inconsistent iOS 7 Status Bar using org.apache.cordova.statusbar plugin]
- [iOS Status bar overlay and PhoneGap build]
- [StatusBar preferences not working: phonegap version 3.6.3]

The plugin cordova-plugin-statusbar not works correctly on PGB.

```xml
<gap:plugin name="cordova-plugin-statusbar" source="npm" />
```
Some configuration preferences are not considered on build. I've setted on config.xml following common preferences:

```xml
<preference name="StatusBarOverlaysWebView" value="false" />
<preference name="StatusBarBackgroundColor" value="#0ff000" />
<preference name="StatusBarStyle" value="default" />
```
I've tested on phonegap CLI, it works fine.

On PGB the iOS StatusBar overlays the webview. But if I turn off the overlays programmatically using the plugin's API, it works fine, and I can see the green StatusBar as setted on preferences,... but not the style default (dark text) also setted on preferences.

I've also tested the previous plugin source but it raises same results:

```xml
<gap:plugin name="org.apache.cordova.statusbar" source="pgb" />
```
I've created an App HelloWorld only for that purpose: 1493471

FYI, I've also tested the deprecated Plugin com.phonegap.plugin.statusbar, it considers the StatusBarOverlaysWebView preference but not the others...

[Inconsistent iOS 7 Status Bar using org.apache.cordova.statusbar plugin]:
http://community.phonegap.com/nitobi/topics/inconsistent_ios_7_status_bar_using_org_apache_cordova_statusbar_plugin
[iOS Status bar overlay and PhoneGap build]:
http://stackoverflow.com/questions/29967628/ios-status-bar-overlay-and-phonegap-build/30687568#30687568
[StatusBar preferences not working: phonegap version 3.6.3]:
https://stackoverflow.com/questions/26839436/statusbar-preferences-not-working-phonegap-version-3-6-3/30697940#30697940
[PhoneGap Developer's Guide to the iOS Status Bar]: http://devgirl.org/2014/07/31/phonegap-developers-guid/