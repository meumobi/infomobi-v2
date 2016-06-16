# Release Notes

## Update Release Notes
### Get Resume of changes commits
Update these notes using: git log --pretty=format:'* %s' --no-merges rel-2.6.3..HEAD

#### Commit Release Notes
Use Resume of Changes from previous command on commit message

1. $ git add RELEASENOTES.md 
2. $ git commit 

### Tag and Push Release

1. $ git tag rel-2.6.4
2. $ git push origin rel-2.6.4 

## rel-1.5.1 (20160616)
* ENHANCEMENT: Improve /files page if empty
* ENHANCEMENT: Closes #171, display thumbnail of media
* FEATURE: Closes #193, Add App Rate if enabled on config.json
* FIX: Closes #180, customize bg color of clicked button
* FIX: Closes #181, download doesn't work on Android 5.1
* FIX: Closes #192, requests to create/update device on launch are duplicated
* FIX: Closes #197, on login device is not saved
* FIX: Closes #198, FATAL EXCEPTION on andwhen register device on Android
* FIX: Closes #74, Closes #157 request timeout doesn't fire
* HOTFIX: Closes #162, replace  legacy promise deprecated methods success and error by standard method then
* HOTFIX: Closes #199, homogenize callback functions
* HOTFIX: Prevent download of images declared as media, display them on top of article
* HOTFIX: Remove unused project phonegap
* HOTFIX: rename files to homogenize
* HOTFIX: Update config.json format to homogenize with IRmobi
* HOTFIX: Update translations tokens
* HOTFIX: Update translations tokens
* HOTFIX: homogenize layout of /files page
* HOTFIX: Replace suffix of sharing title to #InfoMobiApp
* UPGRADE: Closes #161, upgrade imgcache.js

## rel-1.5.0 (20160502)
* FEATURE: Closes #178, customize logged area with site's skin
* PROJECTS: Update bundle Id of condmobi and infomobi, then udpate signing identities

## rel-1.4.2 (20160415)
* ENHANCEMENT: Closes #147, allows visitor to reset password, instead of sending email to contact
* ENHANCEMENT: Closes #167, Polls, manage status closed (end_date expired)
* FIX: Closes #146, login form inputs appears as invalid on load
* HOTFIX, function go: handle missing transition
* HOTFIX: Closes #141, disable Build version check
* PROJECTS: udpate condmobi push credentials
* HOTFIX: remove margin on welcome page
* PROJECTS: update certificates of condmobi and infomobi

## rel-1.4.1 (20160411)
* ENHANCEMENT: add flip trnasition on welcome page
* ENHANCEMENT: Closes #73, manage images on offline mode
* FEATURE: Closes #159, add polls
* HOTFIX: Closes #165, Use gulp-load-plugins to lazy load plugins
* HOTFIX: remove AppFunc, replaced by UtilsService
* HOTFIX: rename android splash screen, remove first Upper case
* PROJECTS: add condmobi project
* PROJECTS: udpate infomobi assets
* PROJECTS: udpate visa assets
* PROJECTS: update condmobi and infomobi logo on launch-image
* PROJECTS: update condmobi pw_appid and profile
* PROJECTS: update credentials to match new bundle id
* PROJECTS: update headers and welcome images
* PROJECTS: update infomobi iOS credentials
* PROJECTS: update welcome/description of projects and add uppercase of first letter of Apps
* UPGRADE, migrate to pushwoosh 4.2.2 using new package name
* UPGRADE: Closes #155, Closes #99, Closes #125, upgrade phonegap version to 6.0
* UPGRADE: Closes #164, update iOS splash file names

## rel-1.3.0 (20151214)
* BUG: Close #129, upgrade angular to prevent iOS9 infinite  loop
* BUG: Close #89, remove warning on gulp command when uglify js
* FIX: Close #130, prevent js error when uglify preventing renaming of functions with mangle:false setting
* FIX: Close #131, ladda loading broken due to unordered load of js libs
* UPDATE: Close #124 and Close #103, upgrade PhoneGap version to latest(cli-5.2.0) and migrate cordova plugins to npm sources
* update c-se config and assets
* add multi-language support
* Bug FIX, send Object on forgot password POST instead of JSON