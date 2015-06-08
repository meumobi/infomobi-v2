---
layout: post
title: Create mobile app with PhoneGap
categories: [PhoneGapBuild, PhoneGap]
tags: [ios-sim, hybrid App]
---
You can develop applications intended for running on various mobile platforms, including iOS and Android, using the [PhoneGap], [Apache Cordova], and [Ionic] frameworks. When using any of these frameworks, an app can be built without any native code (Java, Objective-C, etc) from the app developer. Instead, web technologies are used, and they are hosted in the app itself locally.

[PhoneGap]: http://phonegap.com
[Apache Cordova]: http://cordova.apache.org
[Ionic]: http://ionicframework.com

# Installing PhoneGap
## Requirements
There are a few simple requirements you'll need prior to installing the PhoneGap CLI:

- [Node.js] - a JavaScript runtime to build your JavaScript code
- [ios-sim] - an iOS simulator for iOS development (Mac only)
- [git] - used in the background by the CLI to download assets. It comes pre-installed on some operating systems, to see if you already have it installed, type git from the command line.

[ios-sim]: https://github.com/phonegap/ios-sim#installation
[git]: http://git-scm.com

## Install steps
Packages can be installed in command line mode.

```sh
$ sudo npm install -g phonegap
```
The -g flag above tells npm to install the package globally so it can be accessed from anywhere on your machine (defaults to /usr/local/lib/node_modules/phonegap on Mac). Otherwise it will be installed in the node_modules subdirectory of the current working directory.

Test to ensure the PhoneGap CLI is properly installed by typing phonegap on the command line. You should see the help text output displayed.

# Create the App
Go to the directory where you maintain your source code, and run a command such as the following:

```sh
$ phonegap create hello com.example.hello HelloWorld
```
- The first argument hello specifies a directory to be generated for your project. This directory should not already exist, Cordova will create it for you.
- The second argument com.example.hello provides your project with a reverse domain-style identifier.
- The third argument HelloWorld provides the application's display title.

# Add Platforms

```sh
$ cd hello
$ phonegap platform add ios --save
```
Using --save flag results in Saving ios@^3.8.0 into config.xml file.

# Build the App

```sh
$ phonegap build ios
```

$ ios-sim launch platforms/ios/build/emulator/HelloWorld.app --devicetypeid iPhone-6

ios-sim allows to choose the devicetype to emulate. To list devicetypes run the showdevicetypes command
```sh
$ ios-sim showdevicetypes
```

[Node.js]: http://nodejs.org
