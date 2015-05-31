CImobi
=========

CImobi allows companies to push important information and content (multimedia and documents) to their employees.

- news feed, including rich media
- add events to calendar
- download documents to read offline
- important communications (news or event) can be delivered by mobile push notification
- role specific targeting: define groups and restrict access to specific content based on these groups

Give organization the ability to manage content, users and customize interface through the cloud CMS [meumobi].

> Streamline Internal Communications and Increase Employee Engagement,&nbsp;put CImobi in the pocket of your employees.

Version
----

Beta 0.1

Tech
-----------

CImobi uses a number of open source projects to work properly:

* [MobileAngularUI] - awesome mobile UI framework
* [PhoneGap] - open source framework to create mobile apps using standardized web APIs
* [meumobi] - mobile site builder

PhoneGap Plugins:
* [com.jcjee.plugins.emailcomposer] - Email Composer with Attachments
* [org.apache.cordova.device] - Cordova Device Plugin
* [org.apache.cordova.file] - Cordova File Plugin
* [org.apache.cordova.file-transfer] - Cordova FileTransfer Plugin
* [io.github.pwlin.cordova.plugins.fileopener2] - File Opener2 Plugin
* [nl.x-services.plugins.toast] - Toast PhoneGap Plugin

Installation
--------------

```sh
# Installing required tools
sudo npm install -g bower gulp phonegap

# Clone Repository
git clone "https://github.com/meumobi/infobox.git" && cd infobox

# Install dependencies
bower install
sudo npm install

# Build your project for the first time
gulp build

# Test/Debug in a Web Browser
gulp

```

Testing meumobi API
----
Example of visitor login and GET list of latest items (using a valid Token)

```sh
$ curl --request POST http://int-meumobi.com/api/infobox.int-meumobi.com/visitors/login --data 'email=username@mail.com&password=PASSWORD'

$ curl http://int-meumobi.com/api/infobox.int-meumobi.com/items/latest -H "X-Visitor-Token: 530d35effbb421d395e212d7d0d70890fe834286"
```

Contributing
----

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

License
----

MIT

**Free Software**

[org.apache.cordova.device]:https://github.com/apache/cordova-plugin-device
[org.apache.cordova.file]:https://github.com/apache/cordova-plugin-file
[org.apache.cordova.file-transfer]:https://github.com/apache/cordova-plugin-file-transfer
[io.github.pwlin.cordova.plugins.fileopener2]:https://github.com/pwlin/cordova-plugin-file-opener2
[nl.x-services.plugins.toast]:https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
[meumobi]:http://enterprise.meumobilesite.com/
[@meumobi]:http://twitter.com/meumobi
[MobileAngularUI]:http://mobileangularui.com
[PhoneGap]:http://phonegap.com
[com.jcjee.plugins.emailcomposer]:https://github.com/jcjee/email-composer.git 
