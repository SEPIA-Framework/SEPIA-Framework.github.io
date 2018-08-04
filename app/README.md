# SEPIA Cross-Platform-Client release

## Release History

### v0.12.1 beta - 2018.08.04

- Added official support for custom speech recognition via settings menu (ASR engine, ASR server). See SEPIA STT-Server in GitHub for more info.
- Fixed a bug where the swipe areas were broken after returning from a frame-view and settings menu was open
- Fixed a minor bug in the data interface

### v0.12.0 beta - 2018.07.19

- Added Cordova NativeStorage plugin to make on-device storage more reliable (iOS and Android)
- Replaced Google geo-coder with OpenStreetMap and fixed some GPS related bugs
- Improved network-connection check
- Improved security during login, auto-login will be blocked now when hostname changed
- Improved hostname handling for links that start with 'http'
- Fixed TeachUI for iOS
- Added URL parameters "host" and "q" and implemented request-via-url handling for browser
- Preparations for notification on-click events and deeplink actions
- Minor fixes

### v0.11.3 beta - 2018.07.03

- Log-in on multiple devices of same type at the same time using different device IDs
- Preparation of app-admin view to better control active log-ins
- Updated local-notifications plugin for Android 8.0 (including some tweaks for older versions too)
- Increased overall support for Android 8.0
- Added Cordova file plugin to support iOS local page load

### v0.11.2 beta - 2018.06.24

- Added first version of demo-mode when skipping login
- Improved log-in menu with drop-down for hostname
- Added new skin "Essential", a black-and-white version of SEPIA

### v0.11.1 beta - 2018.06.22

Added improved privacy policy handling and updated tutorial with test-buttons.

### v0.11.0 beta - 2018.06.19

First public release of the new WebSocket based S.E.P.I.A. client for Android, iOS and browser.