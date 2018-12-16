# SEPIA Cross-Platform-Client release

## Release History

### v0.15.2 beta - 2018.12.16

- Added drag & drop module and applied it to shopping and to-do list for sorting (activate via long-press on item check-button)
- Added 3-states support for to-do lists (similar to Kanban-cards: open/in-progress/done)
- Updated to-do/shopping list design and list context-menu in general
- Added embedded module with (very) basic offline NLU and services (currently only used for demo-mode e.g. to load a demo list)
- Added skin 'Professional' (with less rounded corners ^^), improved Neo-Sepia-Dark skin and tweaked some other designs
- Updated tutorial with new list features and generally more info
- Added a help and support button to settings menu (pointing to SEPIA docs page)

### v0.15.1 beta - 2018.11.18

- Improved alarms during AlwaysOn-mode
- Introduced smart-microphone toggle (enable in settings) that auto-activates mic on voice based questions (beta)
- Added new skins 'Study', 'Odyssey1', 'Odyssey2', reworked 'NeoSepiaDark' and changed old one to 'Malachite', updated 'Grid' and tweaked other styles
- Fixed some bugs in GPS event handling
- Improved handling of large lists to show them more often in 'big-results'-view and sorted time-events by date
- Split Alarms/Timers button in shortcuts into 2 buttons
- Introduced upper limit for maximal visible chat entries (to improve performance)
- Added mood indicator to AlwaysOn-mode avatar (mouth angle ^_^)
- Fixed a bug that crashed app when a Bluetooth devices was (dis)connected
- Improved hotkeys/gamepad config menu
- Reworked AudioRecorder module to support different recorder types
- Introduced new WakeTriggers module and added new config options (e.g. (dis)allow remote hotkey)
- Improved file reader to handle array-buffers so that we can import WebAssembly code
- Added Porcupine JS wake-word tool as 'xtension' and beta-test view to experiment with 'Hey SEPIA' (access from settings)
- Updated demo mode with offline custom buttons and fixed some tutorial issues

### v0.14.3 beta - 2018.11.07

- Power-events e.g. open Always-On mode on power plugin
- Updates and refinements to AO mode and hotkeys
- Bugfixes in e.g. voice control of radio and timer deactivation

### v0.14.1 beta - 2018.11.03

- Define custom button for your own commands via the Teach-UI
- Add music stream commands via Teach-UI
- Always-On view with animated avatar and controls (beta)
- Added cordova-plugin https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git
- Gamepad and hotkey support for remote microphone trigger and other controls (beta)
- Design update of quick-access menu (bottom left) and additional smaller changes (skins etc.)
- Fixed bug where radio won't turn off via voice
- Many smaller fixes

### v0.12.2 beta - 2018.08.05

- Added phonegap-plugin-media-stream to fix MediaDevices interface on Android.
- Added cordova-plugin-audioinput to fix MediaDevices interface on iOS.

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