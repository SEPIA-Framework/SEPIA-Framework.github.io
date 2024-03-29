//CONFIG
function sepiaFW_build_config(){
	var Config = {};
	
	Config.clientInfo = "web_app_v1.0.0";	//defined by client properties
	var deviceId = "";						//set in settings and chosen by user to address his devices directly (only numbers and letters, space is replaced by '-', lower-case)
	
	Config.environment = SepiaFW.tools.getURLParameter("env") || SepiaFW.data.getPermanent("environment") || "default";		
	//'default' supports all features, other options: 'speaker', 'smart_display', 'silent_display', 'car_display'
	//NOTE: switches to "avatar_display" in AO-Mode !

	function isIE11(){return!(!(0<window.navigator.userAgent.indexOf("MSIE "))&&!navigator.userAgent.match(/Trident.*rv\:11\./))}
	Config.uiIsIE11 = isIE11();
	
	//set client info
	Config.setClientInfo = function(clientInfo){
		Config.clientInfo = clientInfo;
		SepiaFW.debug.log('Config: clientInfo=' + Config.clientInfo);
	}
	//get client-device info (for server communication etc.)
	Config.getClientDeviceInfo = function(){
		if (deviceId){
			return (deviceId.toLowerCase() + "_" + Config.clientInfo);
		}else{
			return (Config.clientInfo);
		}
	}
	//set device ID			
	Config.setDeviceId = function(newDeviceId, skipReload){
		newDeviceId = newDeviceId.replace(/[\W]+/g, " ").replace(/\s+/g, " ").trim().split(" ").join("-").toLowerCase();
		if (deviceId == newDeviceId){
			return;
		}
		deviceId = newDeviceId;
		if (deviceId.length > 8) deviceId = deviceId.substring(0, 8);
		if (newDeviceId != deviceId){
			SepiaFW.ui.showPopup("Please note: Your device ID has been modified due to new format conventions. Your new ID is: " + deviceId
				+ ". If you plan to change your ID please use only lower-case letters, numbers, '-' and keep it short (2-8 characters)!"); 		//TODO: translate
		}
		//NOTE: because deviceId is used to store app settings some values are not allowed like 'commonSettings'
		SepiaFW.data.setPermanent('deviceId', deviceId);
		Config.broadcastDeviceId(deviceId);
		if (!skipReload){
			logoutAndReload();
		}
	}
	//get device ID
	Config.getDeviceId = function(){
		return deviceId;
	}
	//get app root
	Config.getAppRootUrl = function(){
		return (location.origin + location.pathname.replace(/\/index.html.*/, "/")).trim();
	}
	//set hostname
	Config.setHostName = function(hostName, skipReload){
		if (hostName != undefined){
			Config.host = hostName;
			SepiaFW.data.setPermanent("host-name", Config.host);
			Config.broadcastHostName(Config.host);
			if (!skipReload){
				logoutAndReload();
			}
		}
	}
	//check any URL if its from server
	Config.urlIsSepiaFileHost = function(url){
		//return SepiaFW.tools.isSameOrigin(url, Config.assistAPI); 		//protocol + host + port
		return (url.indexOf(Config.assistAPI) == 0);
	}
	//replace specific path
	Config.replacePathTagWithActualPath = function(path){
		//server paths
		path = path
			.replace("<assist_server>/", Config.assistAPI)
			.replace("<teach_server>/", Config.teachAPI)
			.replace("<chat_server>/", Config.webSocketAPI)
			.replace("<sepia_website>/", Config.sepiaWebsite)
		;
		//local app paths - e.g. <custom_data>, <local_data>, <app_data>
		path = SepiaFW.files.replaceSystemFilePath(path);
		return path;
	}
	
	//language (Note: account settings will overwrite URL param)
	var lang = SepiaFW.tools.getURLParameter("lang") || SepiaFW.data.get('app-language') || navigator.language || navigator.userLanguage || "en";
	lang = lang.toLowerCase().replace(/-.*/, "");
	Config.appLanguage = lang; 
	SepiaFW.debug.log('Config: language=' + Config.appLanguage);

	//region (Note: account settings will overwrite URL param)
	var regionCode = SepiaFW.tools.getURLParameter("rc") || SepiaFW.data.get('app-regionCode') || navigator.language || navigator.userLanguage || "";
	if (!regionCode || regionCode.indexOf("-") < 0 || regionCode.indexOf(Config.appLanguage + "-") < 0) regionCode = "";
	Config.appRegionCode = regionCode; 
	SepiaFW.debug.log('Config: regionCode=' + (Config.appRegionCode || "default"));

	//Hard-coded URLs
	Config.sepiaWebsite = "https://sepia-framework.github.io/";
	
	//set API URLs
	Config.host = "localhost:20726/sepia"; 	//location.hostname + ":" + location.port
	Config.assistAPI = "http://" + Config.host + "/assist/";
	Config.teachAPI = "http://" + Config.host + "/teach/";
	Config.webSocketURI = "ws://" + Config.host + "/chat/messages/";
	Config.webSocketAPI = "http://" + Config.host + "/chat/";
		
	//set base URLs to end-points
	Config.setEndPoints = function(hostname, customData, isTest){
		//test config
		if (isTest){
			Config.assistAPI = "http://" + "localhost" + ":20721/";
			Config.teachAPI = "http://" + "localhost" + ":20722/";
			Config.webSocketURI = "ws://" + "localhost" + ":20723/messages/";
			Config.webSocketAPI = "http://" + "localhost" + ":20723/";
		//custom server config with proxy or IP (uses SSL when explicitly defined or hostname ends with '/sepia')
		}else{
			//get stored
			var serverAccess = customData || SepiaFW.data.getPermanent("server-access");
			if (serverAccess && Object.keys(serverAccess)){
				if (serverAccess.forHost == hostname){
					Config.assistAPI = serverAccess.assist;
					Config.teachAPI = serverAccess.teach;
					Config.webSocketAPI = serverAccess.chat;
					Config.webSocketURI = serverAccess.chatSocket;
					return;
				}else{
					SepiaFW.data.delPermanent("server-access");
					SepiaFW.debug.log("Config: cleaned-up old 'server-access' data");
				}
			}

			//get protocol
			var http = "https://";
			var ws = "wss://";
			var cleanHost = hostname.trim().replace(/\/$/, '').replace(/:20721/, '');
			if (SepiaFW.tools.startsWith(cleanHost, "http://")){
				cleanHost = cleanHost.replace(/^http:\/\//,'');
				http = "http://";
				ws = "ws://";
			}else if (SepiaFW.tools.startsWith(cleanHost, "https://")){
				cleanHost = cleanHost.replace(/^https:\/\//,'');
			}else if (!SepiaFW.tools.endsWith(cleanHost, "/sepia")){
				//hostnames without protocol will only keep 'https' if they end with "/sepia"
				http = "http://";
				ws = "ws://";
			}
			//set default
			if (SepiaFW.tools.endsWith(cleanHost, "/sepia")){
				//proxy
				Config.assistAPI = http + cleanHost + "/assist/";
				Config.teachAPI = http + cleanHost + "/teach/";
				Config.webSocketAPI = http + cleanHost + "/chat/";
				Config.webSocketURI = ws + cleanHost + "/chat/messages/";
			}else{
				Config.assistAPI = http + cleanHost + ":20721/";
				Config.teachAPI = http + cleanHost + ":20722/";
				Config.webSocketAPI = http + cleanHost + ":20723/";
				Config.webSocketURI = ws + cleanHost + ":20723/messages/";
			}
		}
		SepiaFW.debug.log('Config: assistAPI=' + Config.assistAPI);
	}
	Config.openEndPointsSettings = function(){
		SepiaFW.frames.open({ 
			pageUrl: "server-access.html",
			onClose: function(){
				if (!SepiaFW.account.getUserId() && !SepiaFW.client.isDemoMode()){
					SepiaFW.account.toggleLoginBox();
				}
			}
		});
	}
	
	//set policy and license links
	Config.privacyPolicyUrl = "https://sepia-framework.github.io/privacy-policy.html";
	Config.clientLicenseUrl = "license.html";
	
	//some settings require app-reload
	function logoutAndReload() {
		setTimeout(function(){
			var config = {
				buttonOneName : SepiaFW.local.g('doit'),
				buttonOneAction : function(){ 
					SepiaFW.account.afterLogout = function(){
						setTimeout(function(){
							window.location.reload();
						}, 500);
					}
					SepiaFW.account.logoutAction();
				},
				buttonTwoName : SepiaFW.local.g('back'),
				buttonTwoAction : function(){}
			};
			SepiaFW.ui.showPopup(SepiaFW.local.g("logoutAndReload"), config);
		}, 500);
	}
	
	//------------ broadcasting functions --------------
	//TODO: they are sometimes called from other modules which makes them 
	//kind of setter functions too, ... we should change that
	
	//add everything here that needs to be refreshed after host change
	Config.broadcastHostName = function(hostName){
		//log
		SepiaFW.debug.log('Config: broadcasted host=' + hostName);
	}
	//add everything here that needs to be refreshed after language change
	Config.broadcastLanguage = function(language, region, skipSave){
		//app
		Config.appLanguage = language; 		//TODO: interface reload to set texts?
		//speech
		if (SepiaFW.speech)	SepiaFW.speech.setLanguage(language);
		//geocoder
		if (SepiaFW.geocoder) SepiaFW.geocoder.setLanguage(language);
		//menue
		$('#sepiaFW-menu-account-language-li').find('select').val(language);
		//consider regionCode change as well if you change language
		if (region && region.indexOf(language) == 0){
			//set region
			Config.broadcastRegionCode(region, skipSave);
		}else if (Config.appRegionCode && Config.appRegionCode.indexOf(language) != 0){
			//reset region
			Config.broadcastRegionCode("", skipSave);
		}
		//NOTE: does this need to be somwhere else? - ps.: we need to add all IDs here manually
		SepiaFW.ui.build.updateRegionCodeSelector("sepiaFW-menu-account-region-dropdown");
		//URL
		if (window.history && window.history.replaceState && SepiaFW.tools.getURLParameter("lang")){
			var url = SepiaFW.tools.setParameterInURL(window.location.href, "lang", language);
			window.history.replaceState(history.state, document.title, url);
		}
		//log and save
		if (!skipSave){
			SepiaFW.data.updateAccount('language', language);
			SepiaFW.data.set('app-language', language);
		}
		SepiaFW.debug.log('Config: broadcasted language=' + language);
	}
	//add everything here that needs to be refreshed after language-region change
	Config.broadcastRegionCode = function(regionCode, skipSave){
		//app
		Config.appRegionCode = regionCode;
		//speech
		if (SepiaFW.speech)	SepiaFW.speech.setCountryCode(regionCode);
		//menue
		$('#sepiaFW-menu-account-region-li').find('select').val(regionCode);
		//URL
		if (window.history && window.history.replaceState && SepiaFW.tools.getURLParameter("rc")){
			var url;
			if (regionCode){
				url = SepiaFW.tools.setParameterInURL(window.location.href, "rc", regionCode);
			}else{
				url = SepiaFW.tools.removeParameterFromURL(window.location.href, "rc");
			}
			window.history.replaceState(history.state, document.title, url);
		}
		//log and save
		if (!skipSave){
			//SepiaFW.data.updateAccount('regionCode', regionCode);		//TODO: add?
			SepiaFW.data.set('app-regionCode', regionCode);
		}
		SepiaFW.debug.log('Config: broadcasted regionCode=' + (regionCode || "default"));
	}
	//broadcast-event when userName (really the name not the id) is changed
	Config.broadcastUserName = function(userName){
		//menue
		$('#sepiaFW-menu-account-nickname').val(userName);
		//log and save
		SepiaFW.data.updateAccount('userName', userName);
		SepiaFW.debug.log('Config: broadcasted userName=' + userName);
	}
	//broadcast-event when deviceId changed
	Config.broadcastDeviceId = function(newDeviceId){
		//menue
		$('#sepiaFW-menu-deviceId').val(newDeviceId);
		//log
		SepiaFW.debug.log('Config: broadcasted deviceId=' + newDeviceId);
	}

	//------------ PLATFORM & APP CONNECTORS -------------

	var deviceLocalSiteData = {
		location: "",		//e.g.: "home", "mobile", empty
		type: "",			//e.g.: "room" (location=home), empty
		name: "unassigned",	//e.g.: "office" (type=room), "unassigned"
		index: "",			//e.g.: 1, 2, 212, ...
		updates: "off"		//e.g.: "off", "auto" (not supported yet)
	};
	Config.setDeviceLocalSiteData = function(data, skipStorageWrite){
		if (data.location != undefined) deviceLocalSiteData.location = data.location;
		if (data.type != undefined) deviceLocalSiteData.type = data.type;
		if (data.name != undefined) deviceLocalSiteData.name = data.name;
		if (data.index != undefined) deviceLocalSiteData.index = data.index;
		if (data.updates != undefined) deviceLocalSiteData.updates = data.updates;
		if (!skipStorageWrite){
			SepiaFW.data.setPermanent('deviceLocalSiteData', deviceLocalSiteData);
			//publish to chat server
			if (SepiaFW.client.isActive() && !SepiaFW.client.isDemoMode()){
				SepiaFW.client.sendOrRequestDataUpdate("userOrDeviceInfo", {
					deviceLocalSite: deviceLocalSiteData
				});
			}
		}
	}
	Config.getDeviceLocalSiteData = function(){
		return deviceLocalSiteData;
	}
	//SEE: Config.deviceLocalSiteOptions in frames file - TODO: we should load this data from server

	var deviceGlobalLocation = {
		latitude: "",
		longitude: ""
	}
	Config.setDeviceGlobalLocation = function(data, skipStorageWrite){
		if (data.latitude != undefined) deviceGlobalLocation.latitude = data.latitude;
		if (data.longitude != undefined) deviceGlobalLocation.longitude = data.longitude;
		if (!skipStorageWrite){
			SepiaFW.data.setPermanent('deviceGlobalLocation', deviceGlobalLocation);
			//publish to chat server
			if (SepiaFW.client.isActive() && !SepiaFW.client.isDemoMode()){
				SepiaFW.client.sendOrRequestDataUpdate("userOrDeviceInfo", {
					deviceGlobalLocation: deviceGlobalLocation
				});
			}
		}
	}
	Config.getDeviceGlobalLocation = function(){
		return deviceGlobalLocation;
	}

	//Collection of selectable search engines
	Config.webSearchEngines = {
		"google": {name: "Google"},
		"bing": {name: "Bing"},
		"yahoo": {name: "Yahoo"},
		"duck duck go": {name: "Duck Duck Go"},
		"qwant": {name: "Qwant"},
		"ecosia": {name: "Ecosia"}
	}
	Config.getPreferredSearchEngine = function(){
		return prefSearchEngine;
	}
	Config.setPreferredSearchEngine = function(engine){
		if (engine && Config.webSearchEngines[engine]){
			prefSearchEngine = engine;
			SepiaFW.debug.info("Preferred web search engine set to " + engine);
			SepiaFW.data.set('prefSearchEngine', engine);
		}else{
			SepiaFW.debug.error("Preferred web search engine NOT found in list: " + engine);
		}
	}
	var prefSearchEngine = "google";

	//Collection of universally supported apps and their names
    Config.musicApps = {
		//NOTE: _link services will skip 'Controls.searchForMusic' action (server will not send it)
		"embedded": {name: "Embedded Player"},
		"youtube_link": {name: "YouTube Web"},
		"youtube_embedded": {name: "YouTube Widget"},
		"spotify_link": {name: "Spotify Web"},
		"spotify_embedded": {name: "Spotify Widget"},
		"apple_music_link": {name: "Apple Music Web"},
		"apple_music_embedded": {name: "Apple Music Widget"}
		//"soundcloud_embedded": {name: "SoundCloud Widget"}
    }
	var defaultMusicApp = "youtube_embedded";

	Config.getMusicAppCollection = function(){
		if (SepiaFW.ui.isAndroid){
			return SepiaFW.android.musicApps;
		}else{
			return Config.musicApps;
		}
	}
	Config.setDefaultMusicApp = function(appTag){
        if (Config.getMusicAppCollection()[appTag]){
            defaultMusicApp = appTag;
            SepiaFW.data.set('defaultMusicApp', appTag);
			SepiaFW.debug.info("Default music app is set to " + appTag);
        }else{
            SepiaFW.debug.error("Music app-name NOT found in list: " + appTag);
        }
    }
    Config.getDefaultMusicApp = function(){
        return defaultMusicApp;
	}

	//Preferred news region
	Config.getDefaultNewsRegion = function(){
		return defaultNewsRegion;
	}
	Config.setDefaultNewsRegion = function(region){
		defaultNewsRegion = region;
		SepiaFW.debug.info("Default new region set to " + region);
		SepiaFW.data.set('defaultNewsRegion', region);
	}
	var defaultNewsRegion = "";
	
	//----------------------------------------------

	//link to URL parameter functions - TODO: can we remove this?
	Config.getURLParameter = SepiaFW.tools.getURLParameter;
	Config.setParameterInURL = SepiaFW.tools.setParameterInURL;

	//------------ LOAD SETTINGS -------------

	Config.autoSetup = false;		//set by URL parameter 'autoSetup=true'
	Config.isUiHeadless = false;	//set by URL parameter 'isHeadless=true'
	Config.setupModeDelay = 10000;	//delay in ms until client jumps into setup mode (auto or headless)

	//is one of the automatic setup modes enabled?
	Config.isAutoSetupModeEnabled = function(){
		return Config.autoSetup || Config.isUiHeadless;
	}

	//load headless settings
	Config.loadSettingsForHeadlessMode = function(){
		if (SepiaFW.settings && SepiaFW.settings.headless){
			//device
			if (SepiaFW.settings.headless.device){
				SepiaFW.debug.log("Loading headless settings for device ...");
				Object.keys(SepiaFW.settings.headless.device).forEach(function(key){
					//SepiaFW.debug.log("* " + key);
					console.log("* " + key);
					SepiaFW.data.setPermanent(key, SepiaFW.settings.headless.device[key]);
				});
				//TODO: Note that this will usually come too late for this session and requires client reload to take effect!
			}
			//user
			if (SepiaFW.settings.headless.user){
				SepiaFW.debug.log("Loading headless settings for user ...");
				Object.keys(SepiaFW.settings.headless.user).forEach(function(key){
					//SepiaFW.debug.log("* " + key);
					console.log("* " + key);
					SepiaFW.data.set(key, SepiaFW.settings.headless.user[key]);
				});
			}
		}
	}
	Config.loadHeadlessModeSetup = function(){
		if (SepiaFW.settings && SepiaFW.settings.headless){
			//location
			if (SepiaFW.settings.headless.location &&
					SepiaFW.settings.headless.location.latitude && SepiaFW.settings.headless.location.longitude){
				SepiaFW.client.addOnActiveOneTimeAction(function(){
					//Get address for GPS location
					if (SepiaFW.geocoder.isSupported && !SepiaFW.geocoder.autoGPS){
						SepiaFW.geocoder.getAddress(undefined, undefined, 
							SepiaFW.settings.headless.location.latitude, SepiaFW.settings.headless.location.longitude, 
						true);
					}
				});
			}
			//other
			if (SepiaFW.settings.headless.broadcast){
				SepiaFW.inputControls.cmdl.broadcasters = SepiaFW.settings.headless.broadcast;
			}
		}
	}
	//NOTE: see SepiaFW.account #skipLogin for temporary setup settings (e.g. TTS off)

	Config.exportSettingsForHeadlessMode = function(){
		//build
		var headlessConfigJson;
		if (SepiaFW.settings && SepiaFW.settings.headless){
			headlessConfigJson = JSON.parse(JSON.stringify(SepiaFW.settings));	//copy
		}else{
			headlessConfigJson = {headless: {}};
		}
		headlessConfigJson.headless.device = SepiaFW.data.getAllPermanent();
		headlessConfigJson.headless.user = SepiaFW.data.getAll();
		//filter account
		delete headlessConfigJson.headless.user["account"];
		delete headlessConfigJson.headless.user["contacts-from-chat"];
		delete headlessConfigJson.headless.user["lastChannelMessageTimestamps"];
		delete headlessConfigJson.headless.user["isDemoLogin"];
		//... more?
		//show
		var jsonBox = SepiaFW.ui.showJsonInfoPopup("Device Settings JSON",
			"Download as file or copy JSON to your SEPIA client settings.js:",
			headlessConfigJson, {
				buttonOneName: "Download",
				buttonOneAction: function(){
					//download as file
					JSON.parse(jsonBox.value);	//just to validate JSON
					var blob = new Blob([jsonBox.value], {type: "application/json"});
					var filename = "settings-export.json";
					SepiaFW.files.saveBlobAs(filename, blob, jsonBox.parentElement);
				},
				buttonTwoName: SepiaFW.local.g("close"),
				buttonTwoAction: function(){},
			}
		);
	}
	Config.showHeadlessModeSettingsImportPopup = function(){
		var titleBox = document.createElement("div");
		titleBox.innerHTML = "<h3>Device Settings JSON</h3><p>Load previously exported settings file (drag & drop/select) or copy JSON data:</p>";
		SepiaFW.ui.showFileImportAndViewPopup(titleBox, {
				addFileSelect: true,
				accept: ".json",
				buttonOneName: "Import",
				buttonTwoName: "Abort",
				initialPreviewValue: "- Settings JSON -"
			}, 
			function(readRes, viewTxtArea){
				//read
				if (readRes){
					var parsedData = JSON.parse(readRes);
					viewTxtArea.value = JSON.stringify(parsedData, null, 4);
				}
			}, function(viewTxtAreaValue, viewTxtArea){
				//confirm and close
				if (viewTxtAreaValue){
					try {
						var parsedData = JSON.parse(viewTxtAreaValue);
						//use headless settings import feature
						if (!SepiaFW.settings) SepiaFW.settings = {};
						SepiaFW.settings.headless = parsedData.headless;
						Config.loadSettingsForHeadlessMode();
						//TODO: show confirm message
						setTimeout(function(){
							SepiaFW.ui.showPopup("Imported 'device' and 'user' settings. Please reload app to refresh settings.");
						}, 300);
					}catch(err){
						viewTxtArea.value = "ERROR - Failed to import: " 
							+ (err? (err.message || err.name || err) : "?");
						throw err;
					}
				}
			}, function(err, viewTxtArea){
				//read error
				viewTxtArea.value = "ERROR - Failed to read: " 
					+ (err? (err.message || err.name || err) : "?");
			}
		);
	}

	Config.loadAppSettings = function(readyCallback){
		//TODO: this should be simplified with a service! ...
		addAppSettingsReadyCallback(readyCallback);
		addAppSettingsReadyCondition("app-settings-tasks");
		
		//TTS
		if (SepiaFW.speech){
			var storedValue = SepiaFW.data.get('skipTTS');
			if (typeof storedValue != 'undefined') SepiaFW.speech.skipTTS = storedValue;
			SepiaFW.debug.info("TTS is " + ((SepiaFW.speech.skipTTS)? "OFF" : "ON"));
		}
		//GPS
		if (SepiaFW.geocoder){
			var storedValue = SepiaFW.data.get('autoGPS');
			if (typeof storedValue != 'undefined') SepiaFW.geocoder.autoGPS = storedValue;
			SepiaFW.debug.info("GPS is in " + ((SepiaFW.geocoder.autoGPS)? "AUTO" : "MANUAL") + " mode.");
			//pre-defined location?
			var dglData = SepiaFW.data.getPermanent('deviceGlobalLocation'); 
			if (dglData){
				Config.setDeviceGlobalLocation(dglData, true);
				if (dglData.latitude && dglData.longitude){
					SepiaFW.client.addOnActiveOneTimeAction(function(){
						//Get address for GPS location
						if (SepiaFW.geocoder.isSupported && !SepiaFW.geocoder.autoGPS){
							SepiaFW.geocoder.getAddress(undefined, undefined, 
								dglData.latitude, dglData.longitude, 
							true);
						}
					});
				}
			}
		}
		//Proactive notes
		if (SepiaFW.assistant){
			var storedValue = SepiaFW.data.get('proactiveNotes');
			if (typeof storedValue != 'undefined') SepiaFW.assistant.isProActive = storedValue;
			SepiaFW.debug.info("Proactive notes are " + ((SepiaFW.assistant.isProActive)? "ON" : "OFF"));
		}
		//Channel status messages
		SepiaFW.ui.showChannelStatusMessages = SepiaFW.data.get('channelStatusMessages');
			if (typeof SepiaFW.ui.showChannelStatusMessages == 'undefined') SepiaFW.ui.showChannelStatusMessages = false;
			SepiaFW.debug.info("Channel status messages are " + ((SepiaFW.ui.showChannelStatusMessages)? "ON" : "OFF"));
		//Allow background connection
		if (SepiaFW.client){
			SepiaFW.client.allowBackgroundConnection = SepiaFW.data.get('allowBackgroundConnection');
			if (typeof SepiaFW.client.allowBackgroundConnection == 'undefined') SepiaFW.client.allowBackgroundConnection = false;
			SepiaFW.debug.info("Background connections are " + ((SepiaFW.client.allowBackgroundConnection)? "ALLOWED" : "NOT ALLOWED"));
		}
		//Allow power status tracking (e.g. power plugIn event)
		if (SepiaFW.alwaysOn){
			SepiaFW.alwaysOn.trackPowerStatus = SepiaFW.data.get('trackPowerStatus');
			if (typeof SepiaFW.alwaysOn.trackPowerStatus == 'undefined') SepiaFW.alwaysOn.trackPowerStatus = false;
			if (SepiaFW.alwaysOn.trackPowerStatus){
				SepiaFW.alwaysOn.setupBatteryStatus();
			}
			SepiaFW.debug.info("Power-status tracking is " + ((SepiaFW.alwaysOn.trackPowerStatus)? "ALLOWED" : "NOT ALLOWED"));
		}
		//Gamepad, Hotkeys and BLE-Beacon support
		if (SepiaFW.inputControls){
			SepiaFW.inputControls.initializeGamepads();
			SepiaFW.inputControls.initializeBluetoothBeacons();
		}
		//Remote commandline interface
		if (SepiaFW.inputControls && SepiaFW.inputControls.cmdl){
			SepiaFW.inputControls.cmdl.initialize();
		}
		//Wake-word trigger
		if (SepiaFW.wakeTriggers){
			SepiaFW.wakeTriggers.initialize();
		}
		//Smart microphone toggle
		if (SepiaFW.speech){
			SepiaFW.speech.useSmartMicToggle = SepiaFW.data.get('useSmartMicToggle');
			if (typeof SepiaFW.speech.useSmartMicToggle == 'undefined') SepiaFW.speech.useSmartMicToggle = true;
			SepiaFW.debug.info("Smart microphone toggle is " + ((SepiaFW.speech.useSmartMicToggle)? "ON" : "OFF"));
		}
		//CLEXI.js support
		if (SepiaFW.clexi){
			SepiaFW.clexi.initialize();
		}

		//Device local site configuration
		var dlsData = SepiaFW.data.getPermanent('deviceLocalSiteData'); 
		if (dlsData){
			Config.setDeviceLocalSiteData(dlsData, true);
		}

		//Default music app
		var defaultMusicAppStored = SepiaFW.data.get('defaultMusicApp');
		if (defaultMusicAppStored){
			Config.setDefaultMusicApp(defaultMusicAppStored);
		}

		//Preferred search engine
		var prefSearchEngineStored = SepiaFW.data.get('prefSearchEngine');
		if (prefSearchEngineStored){
			Config.setPreferredSearchEngine(prefSearchEngineStored);
		}

		//Default news region
		var defaultNewsRegionStored = SepiaFW.data.get('defaultNewsRegion');
		if (defaultNewsRegionStored){
			Config.setDefaultNewsRegion(defaultNewsRegionStored);
		}

		finishAppSettingsConditionAndCheckReadyState("app-settings-tasks");
	}
	function addAppSettingsReadyCallback(readyFun){
		appSettingsReadyCallback = readyFun;
	}
	function addAppSettingsReadyCondition(conditionName){
		appSettingsReadyConditions[conditionName] = "pending";
	}
	function finishAppSettingsConditionAndCheckReadyState(finishConditionName){
		delete appSettingsReadyConditions[finishConditionName];
		SepiaFW.debug.log("App settings finished condition: " + finishConditionName);
		if (Object.keys(appSettingsReadyConditions).length == 0){
			SepiaFW.debug.log("App settings complete");
			if (appSettingsReadyCallback) appSettingsReadyCallback();
			appSettingsReadyCallback = null;
		}
	}
	var appSettingsReadyCallback;
	var appSettingsReadyConditions = {};
	
	return Config;
}
