# SEPIA Cross-Platform-Client release

## Release History

### v0.24.2 - 2022.05.08

- Added virtual keyboard for DIY clients with touchscreen + 'virtualKeyboard' URL parameter
- Remember media player volume and added option 'playerVolume' to settings file
- Added support for remote media volume control with new slider component
- Added volume control for Youtube player widget
- Added Teach-UI basic command import/export + support for file drag & drop
- Added new settings option for 'defaultNewsRegion' + append 'defaultNewsRegion' and 'appRegionCode' to assistant requests
- New avatar 'Proto' + improved avatar code
- New skins 'Blue Canary', 'Odyssey AI' and 'Vectors Reloaded' + style tweaks
- New URL parameter 'skinId'
- Improved 'awaitDialog' timer to reset properly and increased awaitDialog time from 15s to 20s
- Added CLEXI GPIO events for audio 'eventEffectsOn' and 'eventEffectsOff' + fixed a bug in LED control
- Fixed a shared remote-actions bug for 'play-on' music-cards
- Fixed a bug in 'stt-socket-worker' to properly handle 'no-speech' events
- Fixed a bug in microphone test function for invalid rms values
- Updated Porcupine to v2.1 (replaced v2.0)
- Added pages for Porcupine wake-word format conversion and activation restore ('xtensions' folder)
- Improved settings import/export with new 'UI.showFileImportAndViewPopup' component
- Improved storing and loading of app-settings from server (account-data)
- Added 'environment' to settings file and read at start (if no URL parameter is given)
- Improved login-retry timer
- Updated web-audio lib to v0.9.11 with better pre-load cache and error handling
- Updated CLEXI lib to v0.9.1 and implemented basic 'clexi.requestStateRefresh'
- Improved iOS build script (still beta)
- Smaller fixes and code tweaks (credits, dual-screen, onchange listeners, input events, etc.)

### v0.24.1 - 2022.01.30

- Added support for new 'shared-access' permissions and new settings page to allow other users limited access to specific devices and remote-actions
- Added new 'remote media player' buttons to quickly control media on other clients (start, stop, skip)
- Added support for Porcupine 2.0 and custom wake-words. Create wake-words via Porcupine console and use with free-tier access key + updated wake-word settings page
- Updated web-audio lib and speech module to respond a bit more snappy and better handle timeouts, connection issues and no-speech events
- Updated CLEXI client to v0.9.0 and introduced GPIO interface to control for example LED arrays or read hardware buttons + added "clexiGpioInterface" section to settings.js
- Added remote terminal functions (CLEXI) to set/get/test microphone (gain, mictest) + added new debug page to STT settings
- Implemented 'Config.appRegionCode' to enable region specific service actions for same languages
- Improved avatar and app styles for example to better indicate wake-word activate state
- Updated input-controls view and improved Bluetooth BLE beacon security with "known addresses" check 
- New skins: 'Funky Sunrise' and 'The Vectors'
- Improved landscape, big-screen and tiny mode + better handling of screen-size changes
- Send optional 'info.data' to frame functions 'onOpen' and 'onFinishSetup'
- Android: Updated app to meet the new Play Store requirements and adapt to Android 11 intent restrictions. NOTE: Some custom intents might not be allowed anymore :-/.
- Fixed a bug that made expired timers disappear and return in UI unwantedly
- Added new 'hasTouch' URL parameter to force touch-UI tweaks
- Smaller bug fixes and tweaks

### v0.24.0 - 2021.10.14

- Complete rework of audio system and switch to new **SEPIA Web-Audio library**:
  - Split old, monolithic speech library into smaller, more specific files + completely new, modular audio recorder
  - Handle audio processing in 'AudioWorklets' and 'Worker' threads
  - Support for new **SEPIA STT Server v2** with many new features (Docker container for all platforms available)
  - New WebRTC VAD (voice-activity-detection) module and experimental custom VAD module
  - Replaced old Porcupine wake-word library with new module to support v1.4-1.9
  - Support for many new Porcupine wake-words like Computer, Jarvis, Alexa, Hey Siri, Hey Edison, etc.
  - Support for external TTS server (Mary-TTS compatible API)
  - Added support for media-device selection (set 'sinkId' for mic and speaker) + media-devices settings view
  - Added microphone test-page
  - New audio.effects library (e.g. for TTS filter effects etc.)
  - Support for 'one-time' language option in TTS (switch to specific language for just one output)
  - Global recorder events
  - Support for MediaSession API
- Greatly improved features and support for custom voice-widgets (aka custom views/frames) including handling of speech events, input and animations (build your own voice interface)
- Added demo custom voice-widget: clock (use client demo-mode to get a first impression)
- Improved Teach-UI commands overview + new search field
- Added support for Teach-UI service 'music' (music search)
- Implemented remote action 'notify' and updated 'broadcast' interface and button (broadcast TTS messages to clients with same account)
- Improved media-control actions + optional 'delayUntilIdle' for client-control actions
- Completely new embedded media-player with custom widget support and powerful interface (build your own audio players)
- New 'Cards.embed' library for embedded card widgets + new YouTube embedded player + YouTube URL detection
- Added a few extra sounds for mic-trigger (original: coin, new: blob, chirp, bleeb, click)
- Fixes and ASR support for Microsoft Edge and Apple's Safari browser
- Added 'sections' to my-view
- Improved card context-menus, e.g. send music to other clients via media-player share button (new 'embedded_player' remote media action) etc.
- Style tweaks for big-screen mode + landscape mode for smaller screens
- Implemented screen orientation API and added setting to choose between landscape, portrait and automatic mode
- Added µPlot (lazy) library for visualizations and graph cards
- Added 'Cards' functions for WAV and line plot
- Added new 'UI.myView' module and improved 'add to my-view' feature
- Improved old skins and added new: 'Alabaster' (3 variants), 'Essential' (green + orange), 'Orange Style 2.0' (OS2)
- New avatars: 'The Dots', 'Classy', ILA O-Five (3 variants), 'S-Tech'
- New create-account info view and optimized labels of login box
- Improved list items and added properties 'id', 'lastEdit', 'eleType'
- Added ability to reload/refresh basic lists via context menu button
- Always remove old timer cards on sync + improved stability of 'Events.syncTimeEvents'
- Many style and UI improvements + updated icon-set
- Improved main menu (settings view)
- Updated tutorial
- Optimized 'UI.setup' and 'Config.loadAppSettings' to handle async. ready events
- Added support for a general 'sepia-info-event' dispatch (e.g. for CLEXI log)
- Added button to export (show) client settings as JSON (handy for headless client setup)
- Made experimental languages accessible via language selector
- Introduced new URL path variable '<sepia_website>' (in addition to existing '<assist_server>' etc.)
- Improved service-worker handling + offline page and disabled service-worker by default (use new URL param. 'pwa' to enable)
- Android: Added 'android.intent.action.VOICE_COMMAND' handling
- Improved security checks for URLs and actions

### v0.23.1 - 2020.10.22 - (Android only)

- Hot-fix to improve microphone error messages e.g. when no speech was detected or input was canceled

### v0.23.0 - 2020.10.21

- Added support for PWA (progressive web app) feature of browsers/OS via new basic service worker and PWA manifest file
- Android 10 support aka set 'targetSdkVersion' to 29, updated Cordova to v9, android-platform plugin to v8.1.0 and several other plugins
- Implemented context menu for every result card, e.g. radio/music-stream (+ playlist button, if available), news (read or copy), weather, etc.
- Improved presentation of weather results and added more mini icons
- Greatly extended capabilities of custom view frames with proper integration of microphone, new scoped functions (e.g. 'handleSpeechToTextInput') and secure loading from SEPIA client (folder available in Android as well) or server (SEPIA web-server folder)
- New folders for HTML 'templates', 'custom-data' and 'local_data' + automatic file path expansion for the tags '<custom_data>/', '<local_data>/', '<app_data>/' (root folder), '<assist_server>/' (URL to SEPIA web-server), '<teach_server>/' and '<chat_server>/'
- Added example custom view to new 'xtensions/custom-data/' folder
- Support for new service-actions 'open_settings', 'frames_view_action', 'close_frames_view' and 'switch_stt_engine'
- Support for new service-action 'custom_event' to trigger internal events that can e.g. be captured in the new custom view frames (works very well with SDK services)
- Added new remote-action type 'sync' for remote my-view, list and time-event updates and implemented it to update timers instantly across active devices
- Start and stop audio streams via new remote-action type 'audio_stream' + 'control' and changed data type 'music' to 'media'
- Added functions to get and show user clients and to send remote-actions via WebSocket chat-server
- Added 'connect', 'disconnect', 'wakeWordOn', 'wakeWordOff' and 'reload' to remote-action "hotkeys" (shortcuts: 'co', 'dc', 'ww', 'wm', 'F5')
- Added request source check to some remote-actions to allow e.g. 'mic' or 'connect' only if source is "protected" (aka coming from 'sepia-chat-server' or 'clexi-remote' + clexi-ID)
- Automatically mark open lists as out-of-date if any active client changes the data
- New client event 'sepia_alarm_event' that will be broadcasted (to CLEXI) when an alarm is triggered/removed/stopped
- New client event 'sepia-audio-player-event' that will inform about audio streams (start/stop/URL etc.)
- Additional client events for 'sepia-account-error' and 'sepia-client-error' + 'sepia-state' event will now inform about 'connection' state (active, closed, etc.)
- Increased maximal number of custom buttons from 16 to 42 and in addition load custom buttons that were stored via assistant user (this way admins can create buttons for all users at once)
- Updated icon-set for custom command buttons and improved material-icons loading procedure
- Improved login-restore procedure on app start and added automatic login-retry after connection or server error
- Improved checks and handling of expired login tokens and prevent login-refresh try if client-ID was changed
- Added settings button to login-box to quickly change device ID etc. before login
- New touch-bar control style selectable via settings that uses only the bottom of the screen for swipe and automatically minimizes text input field (double-tap triggers back button)
- New animations for speech input (speech-bubble-box 'processing')
- Very basic dual-screen support (e.g. Surface-Duo, wip)
- Added (very) basic big-screen mode to optionally remove size-limit of client window (settings)
- Added 'deviceId' to all account related API calls
- Interpret double-space as line-break in chat messages
- Added support for automatic-actions to UI pop-up and used it to trigger several retry-button actions automatically after few seconds delay (e.g. after connection loss)
- Fixed a bug that could sometimes crash the event queue after an empty speech result so that the client would not return to idle state
- Fixed a bug in Android speech recognition that could crash the app when the service was not supported/activated
- Added an auto-reset trigger if client is in 'loading' state for more than 45s and (if enabled) made sure that the wake-word listener will restart reliably
- Added 'keywords' field to remote terminal cmd 'get wakeword'
- Improved audio-player error handling
- Made the client more secure by adding 'DOMPurify' library and better sanitizing injected HTML code in cards, actions and chat
- Improved demo mode with new test actions (e.g. for 'open_frames_view' action via "action frame_1")
- Added some more language codes to the experimental ASR settings
- Improved audio recorder code + added ability to define custom sound for mic activation confirm and default recorder buffer length (hidden in "Hey SEPIA" settings page)
- Added settings option to select avatar independently from skin, made possible by splitting CSS files for skin and avatar + added ability to load 'base' skins and avatars when adding new skins
- New skins "flaming squirrel" and "flaming squirrel dark"
- Added support for "alive-ping" messages from WebSocket chat-server
- Send device info (device local-site etc.) to chat-server ('userOrDeviceInfo' via 'Client.sendOrRequestDataUpdate')
- Added new smart-home room types to local device-site menu
- Added support for 'userPreferredSearchEngine' and search-engine selector to settings
- Added new 'Assistant.waitForOpportunitySayLocalTextAndRunAction' function to make it easier to trigger text + action etc. via custom views
- Fixed an occasional render bug in chat (Chromium only)
- Improved support for storage-access API (web-dev)
- UI + UX improvements, better error messages, fixes and smaller improvements for very old browsers (e.g. IE11 and old Androids)

### v0.22.0 - 2020.06.06

- Major updates to Teach-UI to make creation of custom commands easier and more intuitive including examples and input pop-up for parameter data
- Added function to open Teach-UI via long-press on custom command button to edit command (uses new server endpoint, see below)
- Exported **wake-word** configuration to 'wakeWord.js' file (folder 'xtensions'), implemented switching of Porcupine engine (v1.4-1.6) and added all free wake-words (>40). Instructions included in folder.
- Updates for new weather service including new icons, styles and card updates
- Load new TTS voices list from SEPIA server (TTS endpoint) + smaller TTS fixes
- New skin 'historic future' as homage to 80s science fiction including **new avatar** for always-on mode 
- Fixed bugs in 'geocoder' module and related errors in my-view page update
- Fixed a bug in speech recognition that could sometimes prevent the result from loading at first try
- Updated CLEXI lib to v0.8.2, added support for 'runtime-commands' (e.g to handle DIY client reboot and shutdown) and fixed a bug in CLEXI connection
- Added broadcasting of speech events via CLEXI connection (intended for DIY client e.g. to set LED status lights)
- Added support for integrated speech recognition in Firefox Nightly (currently requires activation of 'media.webspeech.recognition.enable' and 'media.webspeech.recognition.force_enable' flags in FF)
- Improved security by restricting access to certain SEPIA library functions via session token and by escaping all HTML code inside plain chat messages (includes adjustments to handle new chat server behavior)
- Improved 'inputControls' module, fixed gamepad support and remote trigger
- Improved handling of 'lastAudioStream' and stream title
- Added proper chat labels (indicators that show when messages were posted) for 'today' and improved 'UI.showInfo'
- Improved 'intent://' handling of Android inApp browser
- Added URL param 'autoSetup' (similar to headless-mode) to load settings.js at start and enter setup mode after 8s if no user is logged in
- Added basic web-worker interface that can be used to run code in background thread
- Optimized app start-up, initial page and skin loading
- Improved logger (for dev tools console)
- Smaller and bigger skin and style tweaks all over the place (skin upgrades, Firefox scrollbar support, etc.)

### v0.21.0 - 2020.02.17

- Introduced new headless mode (URL param. 'isHeadless=true') with support for 'settings.js' file and new remote commandline module (using CLEXI server)
- Client will automatically switch into setup state after few seconds when in headless mode and no login is given (+ audio notification ^^)
- Integrated new TTS engine that streams data from SEPIA server (switch via new voice engine selector in settings)
- Added new 'ILA-Legacy' skin with custom avatar for Always-On mode :-)
- Added new 'server-access' page for detailed connection configuration (accessible from login and settings, replaces hostname field)
- Improved automatic hostname recognition
- Created new icon selection popup and applied it to Teach-UI custom button field
- Added custom GPS location to device site settings
- Slightly improved visibility of missed chat messages
- Improved alarm sound player to better manage other audio sources
- New CSS options to better control status bar and navigation bar color in Android (and probably iOS)
- Fixed bugs in view scrolling and 'switchLanguage' service-action
- Added URL param. 'logout' to start client with automatic logout
- Improved Teach-UI start-up to allow more pre-filled teach fields
- Added more debug/help info for insecure-origin (SSL stuff) issues like microphone access restrictions
- Updated CLEXI lib to v0.8.1
- Added some IE11 polyfills

### v0.20.0 - 2019.12.30

- Integrated SEPIA Control HUB into settings frontpage of app (will show when user has certain role, e.g. 'tinkerer' or 'smarthomeadmin')
- New setting for preferred temperature unit (Celsius/Fahrenheit) that can be accessed in services via user account or device settings
- Added new page for 'device local site' to set a specific location for the client like 'home:living-room' that can be read by any smart service on the server
- Load up to 16 custom command buttons to my-view by default (up from 10)
- Load services config of Teach-UI from new teach-server endpoint
- Added a help button for extended login box that redirects to SEPIA docs
- Auto-assign a 'dark-skin' or 'light-skin' class when selecting a skin to better handle certain CSS rules
- Basic post-message interface for apps that run inside IFrames (to be extended soon)
- Tweaked TTS voice selection indicator depending on platform
- Added 'env' parameter to launcher page

### v0.19.1 - 2019.10.14

- Custom-buttons (defined via Teach-UI) work properly now in group-chats
- Show a colored bell in AO mode to indicate 'you have a message in another channel'
- Fixed some bugs related to channel-history feature, e.g. a few seconds scrolling-lock and missing/wrong day tags in chat
- Improved audio-events tracking and handling in connection to 'hey SEPIA' wake-word
- Added option to allow/prevent wake-word while music is playing (default: prevent, to avoid audio artifacts in some mobile clients)
- Improved audio recorder performance and stability and fixed dynamic downsampling
- Fixed some issues with YouTube player (sometimes 'pause music' wasn't working)
- Added 'env' URL parameter to be able to set custom value for 'environment' variable (client info sent to server)
- Fixed deprecated code in iOS audio processing to make build process work again (iOS 12.4, Swift 5 - native ASR still broken, but restored open-source ASR support)
- Improved some error messages after failed login
- Prevent multiple queued follow-up messages of same 'type' (only one will show)
- Prevent chat names that look like user IDs to prevent accidental private messages to wrong receiver
- Prevent auto-scrolling of chat when hidden channel-status message was added
- Updated jquery to 3.4.1
- Added library for voice-activity-detection (VAD, though it is not used yet)

### v0.19.0 beta - 2019.09.06

- Partially reworked and greatly improved messenger features and UI to support channel create, join, invite (via URL), missed messages, history and more
- Added option to change login password from settings menu (via old password)
- Improved messaging between devices with same login but different device-ID
- Improved handling of SEPIA universal links when posted inside SEPIA chat channels
- Improved UX and security when interacting with SEPIA in group chats (public SEPIA messages will not automatically execute actions or play music anymore)
- Keep keyboard open in mobile apps when 'send'-button is pressed
- Forget last command after 60s (to prevent 'I just told you' kind of SEPIA comments after long idle time)
- Automatically select user-preferred color scheme (read from OS) and set light or dark skin when no skin was selected before
- Optimized 'switch-language' action 
- Renamed 'saythis' button to 'broadcast'
- New 'updateData' message-event handler to support arbitrary data sharing via WebSocket connection
- Fixed a rare crash due to outdated splash-screen plugin in Android
- Minor UI, bug and style fixes

### v0.18.1 beta - 2019.07.18

- Improved data store/load script to reduce number of writes
- Added onChatOutputHandler for views like AO-Mode (e.g. see SEPIA answer as text in AO)
- Added pause/resume client control for audio players and tweaked YouTube music to properly pause audio when STT is activated
- Added support for new input command 'i18n:XY' to dynamically set input language (e.g. 'i18n:de Guten Tag' will trigger the German 'Hello' even when app language is english)
- New share-menu activated by a long-press on the sender name in a chat message
- Made BLE Beacon remote URL more flexible
- Improved auto-scaling below 300px window width and tweaked tiny-mode
- New launcher.html page to configure launch-options and automatically redirect (handy for app in browser kiosk-mode)
- Reactivated 'application/ld+json' tag in index.html
- Set Android target SDK to 28 (Android 9.0) and improved support including new 'network security config'

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