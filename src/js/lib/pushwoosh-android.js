/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Google Project Number
var google_project_number = "@@googleProjectNumber";
// PushWoosh Application Code
var pw_application_code = "@@applicationCode";

function registerPushwooshAndroid() {

  var pushNotification = window.plugins.pushNotification;

  // Set push notifications handler
  /*document.addEventListener('push-notification',
      function(event) {

          var title = event.notification.title;
          var userData = event.notification.userdata;

          //dump custom data to the console if it exists
          if (typeof (userData) !== "undefined") {
              console.warn('user data: ' + JSON.stringify(userData));
          }

          // Display the notification
          //navigator.notification.alert(title,function() {console.log("Notification success")},"Notification","Close");

          // Stopping geopushes
          //pushNotification.stopGeoPushes();
      }
  );*/

  // Trigger pending push notifications
  pushNotification.onDeviceReady({
    projectid: google_project_number,
    appid: pw_application_code
  });

  // Register for pushes
  pushNotification.registerDevice(
    function(status) {
      var pushToken = status;
      localStorage['push_id'] = pushToken;
      // Callback when pushwoosh is ready
      //onPushwooshAndroidInitialized(token);
    },
    function(status) {
      alert("failed to register: " + status);
      console.warn(JSON.stringify(['failed to register ', status]));
    }
  );
}

/*
function unregisterPushwooshAndroid() {

	var pushNotification = window.plugins.pushNotification;

	// Trigger pending push notifications
    pushNotification.onDeviceReady();

	// Register for pushes
    pushNotification.unregisterDevice({projectid: google_project_number, appid : pw_application_code},
        function(status) {
            var pushToken = status;
            // Callback when pushwoosh is ready
			onPushwooshAndroidInitialized(token);
        },
        function(status) {
            alert("failed to register: " +  status);
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}
*/

function onPushwooshAndroidInitialized(pushToken) {
  // Output the token to the console
  console.warn('push token: ' + pushToken);

  var pushNotification = window.plugins.pushNotification;

  pushNotification.getTags(
    function(tags) {
      console.warn('tags for the device: ' + JSON.stringify(tags));
    },
    function(error) {
      console.warn('get tags error: ' + JSON.stringify(error));
    }
  );

  // Set multi notification mode
  //pushNotification.setMultiNotificationMode();
  //pushNotification.setEnableLED(true);

  // Set single notification mode
  //pushNotification.setSingleNotificationMode();

  // Disable sound and vibration
  //pushNotification.setSoundType(1);
  //pushNotification.setVibrateType(1);

  // pushNotification.setLightScreenOnNotification(false);

  // Goal with count
  //pushNotification.sendGoalAchieved({goal:'purchase', count:3});

  // Goal with no count
  //pushNotification.sendGoalAchieved({goal:'registration'});

  // Setting list tags
  //pushNotification.setTags({"MyTag":["hello", "world"]});

  // Settings tags
  //pushNotification.setTags({deviceName:"hello", deviceId:10},
  //function(status) {
  //console.warn('setTags success');
  //},
  //function(status) {
  //console.warn('setTags failed');
  //}
  //);

  // Pushwoosh Android specific method that cares for the battery
  // pushNotification.startGeoPushes();
}
