CImobi
=========

CImobi allows companies to push important information and content (multimedia and documents) to their employees.

- news feed, including rich media
- add events to calendar
- download documents to read offline
- important communications (news or event) can be delivered by mobile push notification
- role specific targeting: define groups and restrict access to specific content based on these groups

GIve organization the ability to manage content, users and customize interface through the cloud CMS [meumobi].

> Streamline Internal Communications and Increase Employee Engagement, put CImobi in the pocket of your employees.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.  

Version
----

Beta 0.1

Tech
-----------

CImobi uses a number of open source projects to work properly:

* [MobileAngularUI] - awesome mobile UI framework
* [PhoneGap] - open source framework to create mobile apps using standardized web APIs
* [meumobi] - mobile site builder

Installation
--------------

```sh
# Installing required tools
npm install -g bower yo gulp generator-mobileangularui
sudo  npm install -g phonegap

# Scaffold the project
phonegap create --name cimobi --id com.meumobi.cimobi cimobi && cd cimobi
yo mobileangularui
git clone "https://github.com/meumobi/infobox.git"

# Build your project for the first time
gulp build

# Run the Application
phonegap run ios # or android, or whatever is your target

# Test/Debug in a Web Browser
gulp

# Test/Debug in Phonegap
phonegap run ios # or any other target
```

License
----

MIT

**Free Software**

[meumobi]:http://entreprise.meumobi.com
[@meumobi]:http://twitter.com/meumobi
[MobileAngularUI]:http://mobileangularui.com
[PhoneGap]:http://phonegap.com