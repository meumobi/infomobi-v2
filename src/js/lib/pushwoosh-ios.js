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

// PushWoosh Application Code
var pw_application_code = "@@applicationCode";

function registerPushwooshIOS() {
  var pushNotification = window.plugins.pushNotification;

  // Set push notification callback before we initialize the plugin
  document.addEventListener('push-notification',
    function(event) {
      var pushNotification = window.plugins.pushNotification;

      // Get the notification
      var notification = event.notification;

      // Display the notification
      //navigator.notification.alert(notification.aps.alert,function() {console.log("Notification success")},"Notification","Close");

      // View full push payload
      //alert(JSON.stringify(notification));

      // Clear the App badge
      pushNotification.setApplicationIconBadgeNumber(0);
    }
  );

  // Trigger pending push notifications
  pushNotification.onDeviceReady({
    pw_appid: pw_application_code
  });

  // Register for pushes
  pushNotification.registerDevice(
    function(status) {
      var deviceToken = status['deviceToken'];
      localStorage['push_id'] = deviceToken;
      console.warn('registerDevice: ' + deviceToken);
      //onPushwooshiOSInitialized(deviceToken);
    },
    function(status) {
      console.warn('failed to register : ' + JSON.stringify(status));
      //alert(JSON.stringify(['failed to register ', status]));
    }
  );

  // Reset badges on start
  pushNotification.setApplicationIconBadgeNumber(0);
}

/*
function unregisterPushwooshIOS() {
	var pushNotification = window.plugins.pushNotification;

	// Trigger pending push notifications
	pushNotification.onDeviceReady();
	// Unregister for pushes
	pushNotification.unregisterDevice({pw_appid:pw_application_code},
		function(status) {

			var deviceToken = status['deviceToken'];
			console.warn('unregisterDevice: ' + deviceToken);
		},
		function(status) {
			console.warn('failed to unregister : ' + JSON.stringify(status));
			alert(JSON.stringify(['failed to unregister ', status]));
		}
	);

}
*/

function onPushwooshiOSInitialized(pushToken) {
  var pushNotification = window.plugins.pushNotification;
  // Retrieve the tags for the device
  pushNotification.getTags(
    function(tags) {
      console.warn('tags for the device: ' + JSON.stringify(tags));
    },
    function(error) {
      console.warn('get tags error: ' + JSON.stringify(error));
    }
  );
}
