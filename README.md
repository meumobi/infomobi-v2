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

Installation
--------------

```sh
# Installing required tools
sudo npm install -g bower yo gulp generator-mobileangularui
sudo npm install -g phonegap

# Scaffold the project
phonegap create --name cimobi --id com.meumobi.cimobi cimobi && cd cimobi
yo mobileangularui
git clone "https://github.com/meumobi/infobox.git"

sudo npm install

# Build your project for the first time
gulp build

# Run the Application
phonegap run ios # or android, or whatever is your target

# Test/Debug in a Web Browser
gulp

```

License
----

MIT

**Free Software**

[meumobi]:http://enterprise.meumobilesite.com/
[@meumobi]:http://twitter.com/meumobi
[MobileAngularUI]:http://mobileangularui.com
[PhoneGap]:http://phonegap.com
[com.jcjee.plugins.emailcomposer]:https://github.com/jcjee/email-composer.git 