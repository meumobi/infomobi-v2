---
layout: post
title: Avoid PhoneGap iOS App to backup webstorage and downloaded files
categories: [PhoneGap]
tags: [localStorage, Download Files, WebStorage, config.xml]
author:
  name: Victor Dias
  email: victor.dias@meumobi.com
  github: elbidone
  twitter: meumobi
  bio: Sharing mobile Experiences
  email_md5: 1cd012be2382e755aa763c66acc7cfa6
---
After months developing mobile Apps, using PhoneGap, we've experienced today our first Rejection by Apple.:
> On launch and content download (i.e. presentations), your app stores 15.85 MB, which does not comply with the iOS Data Storage Guidelines.  

> Please verify that only the content that the user creates using your app, e.g., documents, new files, edits, etc. is backed up by iCloud as required by the iOS Data Storage Guidelines.

# Avoid iOS App downloaded files to be backuped
Humm.. that's right. Our PhoneGap App uses [Cordova File Plugin] to store downloaded files on cordova.file.documentsDirectory. And as correctly explained on [Cordova File Plugin] doc, the documentsDirectory is Synced.
We've checked it following these instructions: 

- Install and launch your app
- Go to Settings > iCloud > Storage & Backup > Manage Storage
- If necessary, tap "Show all apps"
- Check your app's storage, download files to see it growing

## How to fix it
**we've replaced cordova.file.documentsDirectory by cordova.file.dataDirectory**

Et voila!! Our [infoMobi] users will enjoy downloading files for offline read.

# Avoid iOS App WebStorage to be backuped
During our investigation we've seen that localStorage by default is also backuped on cloud, see [Cordova iOS Configuration]. It can lead to an issue if localStorage of app is synced between multiples devices. [Apple's Q&A] explains

> only user data may be stored to the iCloud. Data that is needed for offline purposes may not be stored in the iCloud. 

More details about [localStorage management on iOS]:

> localStorage in iOS is just a SQLite db file that is stored somewhere on the device.

> Phonegap writes the localStorage.db file into the Documents directory for your app.

> Specifically: Documents/Backups/localstorage.appdata.db

> Since the Documents directory is specific for each app, it will be automatically saved to iCloud.

## How to fix it
To disable web storage backup to iCloud, set the BackupWebStorage preference to "local" in the config.xml file.

```xml
<preference name="BackupWebStorage" value="local"/ >
```
OBS: An issue is open about:

- PhoneGap Build GitHub: https://github.com/phonegap/build/issues/338
- PhoneGap Build Community issue: http://community.phonegap.com/nitobi/topics/backupwebstorage_and_ios

[Apple's Q&A]: https://developer.apple.com/library/ios/qa/qa1719/_index.html
[Cordova iOS Configuration]: https://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_config.md.html
[localStorage management on iOS]: http://stackoverflow.com/questions/7813258/does-phonegap-localstorage-save-to-icloud
[Cordova File Plugin]: https://github.com/apache/cordova-plugin-file
[infoMobi]: http://infomobi.strikingly.com
