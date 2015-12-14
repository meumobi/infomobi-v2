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

## rel-1.3.0 (20151214)
* BUG: Close #129, upgrade angular to prevent iOS9 infinite  loop
* BUG: Close #89, remove warning on gulp command when uglify js
* FIX: Close #130, prevent js error when uglify preventing renaming of functions with mangle:false setting
* FIX: Close #131, ladda loading broken due to unordered load of js libs
* UPDATE: Close #124 and Close #103, upgrade PhoneGap version to latest(cli-5.2.0) and migrate cordova plugins to npm sources
* update c-se config and assets
* add multi-language support
* Bug FIX, send Object on forgot password POST instead of JSON