# SEPIA Cross-Platform-Client release

## Release History

### v0.18.0 beta - 2019.05.31

- Added new 'music-search' and 'media' function to client-controls with Android MEDIA_BUTTON Intent support
- Added selector for default music app including YouTube, Spotify, Apple Music (Browser/Mobile) and VLC (Android only)
- Added music-search as link-card type and added support for YouTube embedded videos (including stop and next command interface)
- Added new skins "Spots" and "DarkCanary"
- Added new context menu for cards to link and timer cards with buttons like 'share' and 'copy' (link)
- Added 'add to Android calendar' and 'add to Android alarms' buttons to timer cards
- Improved link-cards
- New and upgraded implementation for universal deeplinks (e.g. share reminders, requests, links, etc.)
- Filled Teach-UI help button with many examples and info for each command
- Added Teach-UI support for flex-parameters in sentence_connect (see new help for more info)
- Added new platform_controls command to Teach-UI (one sentence - device dependent actions like URL-call or Android-Intent)
- Added new client info to server requests (deviceId, platform, default music app etc.)
- Fixed and improved 'Hey SEPIA' code (still some issues left)
- Added Android ASSIST Intent listener to allow SEPIA to become default system assistant (long-press on home button)
- Added Android Intent plugin
- Added Android navigation bar plugin for colored soft-keys (bottom of screen)
- Added button to store/load app settings to/from account after login
- Support for follow-up messages from server (received after initial service 'completion')
- Improved reconnect behavior after lost connection
- Added server version check and incompatibility warning to start-up sequence 
- Added onActive and onBeforeActive event queue
- Updated CLEXI client library to v0.8.0 (with support for CLEXI http events)
- Added CLEXI connection status indicator
- Improved my-view updates
- Fixed some issues related to active chat-channel and messages
- Improved handling of well-being/pro-active notifications (e.g.: inform server of received notes to prevent duplicated messages, deliver when active, etc.)
- Improved list scrolling on footer minimize-click
- Improved audio player animation
- Improvements to pop-up messages

### v0.17.0 beta - 2019.03.24

- Added support for Bluetooth LE beacons to be used as remote control triggers
- Added Node.js CLEXI integration to handle BLE support on e.g. Desktop browsers
- Improved remote control settings (aka gamepad settings) to support BLE beacons
- Added new client-controls function including new Teach-UI command (use e.g. to control volume or call Mesh-Nodes and CLEXI form client)
- New wake-word settings, fixed wake-word for AO-mode, proper settings storing and auto-load of engine
- Store and load selected voice (per language)
- New 'view' URL parameter to e.g. launch Always-On mode ('aomode') directly on start
- New 'isTiny' URL parameter to be able to handle very small screens (e.g. 240x240) via sepiaFW-style-tiny.css file
- New Always-On animations (mouth). AO-mode can be activated via double-tap on SEPIA label (center top)
- UX tweaks (mic press stops alarm, bigger shortcuts button area etc.) and skin improvements
- Renamed 'Chatty reminders' to 'Well-being reminders' (and made them opt-in by default) ;-)
- New idle-time action queue (used e.g. in client-control to get voice feedback on error)
- Custom environmental variable during AO-mode: avatar_display (use for services)
- Fixed a bug in Chrome TTS and other minor bug- and UX-fixes

### v0.16.0 beta - 2019.01.31

- Added new 'plugin' command (mesh_node_plugin) to the Teach-UI to easily interface with SEPIA Mesh-Nodes (see above)
- Added speech-to-text output to AlwaysOn-mode
- Automatically close await-dialog state (yellow mic) after 15s
- Improved my-view automatic refresh (e.g. after wake-up from background)
- Fixed link-cards for dark skins and added new 'Nightlife' skin
- Translated tutorial to German (and added language support to Frames)
- Added ACTION "switch_language" to experiment with custom services in non-default languages
- Fixed a bug in the mic-reset function
- Fixed a bug in Teach-UI for unsupported commands

### v0.15.3 beta - 2018.12.xx (internal release)

- Improved demo-mode with timers, event-buttons, shortcuts menu and more
- Fixed scroll-into-view bug that shifted slider
- Fixed links color

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