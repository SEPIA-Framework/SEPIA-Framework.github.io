//ACCOUNT - Login, logout, login-popup etc. ...	
function sepiaFW_build_account(sepiaSessionId){
	var Account = {};
	
	var userId = "";
	var userToken = "";
	var userTokenValidUntil = 0;
	var userName = "Boss";
	var language = SepiaFW.config.appLanguage;
	//TODO: add 'regionCode'?	currently an app-settings property: SepiaFW.config.appRegionCode
	var clientFirstVisit = true;

	var userRoles = undefined;
	var userPreferredTempUnit = undefined;

	var sharedAccessPermissions = undefined;
	
	var pwdIsToken = false;
	var defaultIdPrefix = "uid";

	var demoAccounts = {
		"appstore": "eval20192X",
		"test": "test123",
		"test2": "test123",
		"setup": "setup123"
	}
	Account.getTestUserType = function(){
		if (SepiaFW.client.isDemoMode()){
			if (Account.getUserRoles() && (Account.getUserRoles()[0] == "setup" || Account.getUserRoles()[0] == "test2")){
				//type 2 has reduces automic stuff during test-mode
				return 2;
			}else{
				return 1;
			}
		}else{
			return 0;
		}
	}
	Account.isSetupMode = function(){
		return (SepiaFW.client.isDemoMode() && Account.getUserRoles() && Account.getUserRoles()[0] == "setup");
		//NOTE: check for demoId or '== "setup"' as well when looking for references in code
	}
	
	//---- Account settings mapping (to simplify access) and options ----//
	Account.USER_NAME = "uname";
	Account.NICK_NAME = "nick";
	Account.FIRST_NAME = "first";
	Account.LAST_NAME = "last";
	
	Account.INFOS = "infos";
	Account.LANGUAGE_PREF = "lang_code";
	Account.BIRTH = "birth";
	Account.GENDER = "gender";
	Account.APP_SETTINGS = "app_settings";
	Account.UNIT_PREF_TEMP = "unit_pref_temp";

	Account.SHARED_ACCESS_PERMISSIONS = "shared_access";
	
	Account.LISTS = "lists";
	Account.ADDRESSES = "addresses";
	Account.ADDRESS_TAG_HOME = "user_home";
	Account.ADDRESS_TAG_WORK = "user_work";
	Account.CONTACTS = "contacts";

	Account.OPTIONS_TEMPERATURE = [{value:"C", name:"Celsius"}, {value:"F", name:"Fahrenheit"}];
	Account.OPTIONS_TEMPERATURE_DEFAULT = "C";

	function transferAccountDataToUI(){
		//first app visit of this user?
		checkClientFirstVisit();
		//set user ID indicator
		$('#sepiaFW-menu-account-my-id').text(userId);
		//show/hide some stuff depending on user roles (note that this is just cosmetics, NOT about security)
		if (userRoles){
			if ($.inArray("developer", userRoles) == -1 && $.inArray("tinkerer", userRoles) == -1 && $.inArray("smarthomeadmin", userRoles) == -1){
				//hide Control HUB entry
				$('#sepiaFW-menu-btn-control-hub').hide();
			}
		}
		if (userPreferredTempUnit){
			//set selector
			$('#sepiaFW-menu-account-preftempunit-dropdown').val(userPreferredTempUnit);
		}
		if (sharedAccessPermissions){
			//NOTE: 'set input fields' moved to shared-access settings view
		}
	}
	
	//---- broadcasting ----
	
	function broadcastEnterWithoutLogin(){
		clearInterval(loginRetryIntervalTimer);
		loginRetryFailed = 0;
		//TODO: this should prepare demo-mode ...
		SepiaFW.client.setDemoMode(true);
		//set user ID indicator
		$('#sepiaFW-menu-account-my-id').text("Demo");
		//play sound?
		if (Account.isSetupMode()){
			//TODO: should we play another sound when CLEXI connected?
			SepiaFW.client.addOnActiveOneTimeAction(function(){ SepiaFW.audio.playURL("sounds/setup.mp3"); }, "setup");
		}
	}
	
	function broadcastLoginRestored(){
		transferAccountDataToUI();
		var event = new CustomEvent('sepia_login_event', { detail: {
			note: "loginRestored"
		}});
		document.dispatchEvent(event);
	}
	
	function broadcastLoginSuccess(){
		clearInterval(loginRetryIntervalTimer);
		loginRetryFailed = 0;
		transferAccountDataToUI();
		var event = new CustomEvent('sepia_login_event', { detail: {
			note: "loginSuccess"
		}});
		document.dispatchEvent(event);
	}

	function broadcastLoginFail(errorText, errorCode){
		var event = new CustomEvent('sepia_login_event', { detail: {
			note: "loginFail",
			error: errorText,
			code: errorCode
		}});
		document.dispatchEvent(event);
	}
	
	function broadcastLogoutTry(){
		//close all menues
		SepiaFW.ui.closeAllMenus();
		
		//reset background events
		SepiaFW.debug.log("Logout: Removing all background events.");
		if (SepiaFW.events){
			SepiaFW.events.resetAllBackgroundEvents(function(state){
				Account.finishedLogoutActionSection('Background-events', state);
			});
		}else{
			Account.finishedLogoutActionSection('Background-events', true);
		}
		
		//clear all view histories
		SepiaFW.debug.log("Logout: Clearing all views.");
		SepiaFW.ui.clearAllOutputViews();
		
		//delete all other data we can find
		SepiaFW.debug.log("Logout: Deleting all cached app data.");
		SepiaFW.data.clearAppCache(function(status){
			//Success
			//clear all other data except permanent (e.g. host-name and device ID)
			var keepPermanent = true;
			SepiaFW.data.clearAll(keepPermanent, function(){
				//delayed call
				Account.finishedLogoutActionSection('App-data', true);
			});
		}, function(status) {
			//Error
			//clear all other data except permanent (e.g. host-name and device ID)
			var keepPermanent = true;
			SepiaFW.data.clearAll(keepPermanent, function(){
				//delayed call
				Account.finishedLogoutActionSection('App-data', false);
			});
		});
				
		//close websocket connection
		/*
		if (SepiaFW.webSocket && SepiaFW.webSocket.client){
			SepiaFW.webSocket.client.closeConnection();
		}
		*/
	}
	function broadcastLogoutSuccess(){
		SepiaFW.client.closeClient();
		var event = new CustomEvent('sepia_login_event', { detail: {
			note: "logoutSuccess"
		}});
		document.dispatchEvent(event);
	}
	function broadcastLogoutFail(){
		SepiaFW.client.closeClient();
		var event = new CustomEvent('sepia_login_event', { detail: {
			note: "logoutFail"
		}});
		document.dispatchEvent(event);
	}

	function broadcastAccountError(errorText, errorCode){
		/* Error codes:
			0 - ???
			1 - data transfer
		*/
		if (errorCode == undefined) errorCode = 0;
		var event = new CustomEvent('sepia_account_error', { detail: {
			error: errorText,
			code: errorCode
		}});
		document.dispatchEvent(event);
	}
	
	//----------------------
	
	//track first visit status
	function checkClientFirstVisit(){
		//check if this is the users first visit
		clientFirstVisit = SepiaFW.data.getPermanent('first-app-start-' + userId);
		if (clientFirstVisit == undefined) clientFirstVisit = true;
		SepiaFW.debug.info('Is first recorded visit of this client for "' + userId + '"? ' + clientFirstVisit);
	}
	Account.setClientFirstVisit = function(value){
		if (userId){
			SepiaFW.data.setPermanent('first-app-start-' + userId, value);
		}
	}
	
	//----------------------

	//get general ID prefix
	Account.getIdPrefix = function(){
		if (userId){
			return userId.split(/\d/,2)[0];
		}else{
			return defaultIdPrefix;
		}
	}
	//does the given string look like an ID
	Account.stringLooksLikeAnID = function(str){
		return !!str.match(new RegExp("^" + Account.getIdPrefix().toLowerCase() + "\\d+$"));
	}
	
	//get user id
	Account.getUserId = function(){
		return userId;
	}
	Account.isAssistantUser = function(){
		var roles = SepiaFW.account.getUserRoles();
		if (!roles){
			return false;
		}else{
			return $.inArray("assistant", roles) >= 0;
		}
	}
	//get user name
	Account.getUserName = function(){
		return userName;
	}
	//get key
	Account.getKey = function(sessionId){
		if (sessionId != sepiaSessionId){
			console.error("A function requested the login key with WRONG session ID! Request was refused.");
			alert("A function requested the login key with WRONG session ID! Request was refused.");
			return "";
		}
		return getKey();
	}
	function getKey(){
		return (userId + ";" + userToken);
	}
	//get token
	Account.getToken = function(sessionId){
		if (sessionId != sepiaSessionId){
			console.error("A function requested the login token with WRONG session ID! Request was refused.");
			alert("A function requested the login token with WRONG session ID! Request was refused.");
			return "";
		}
		return userToken;
	}
	Account.getTokenValidUntil = function(){
		return userTokenValidUntil;
	}
	//get language
	Account.getLanguage = function(){
		return language;
	}
	//get client first visit
	Account.getClientFirstVisit = function(){
		return clientFirstVisit;
	}
	//get user roles
	Account.getUserRoles = function(){
		return userRoles;
	}

	//get preferred unit of temperature (part of INFOS, not loaded with login)
	Account.getUserPreferredTemperatureUnit = function(){
		return userPreferredTempUnit;
	}
	Account.setUserPreferredTemperatureUnit = function(newValue){
		userPreferredTempUnit = newValue;
		SepiaFW.data.updateAccount('userPreferredTempUnit', userPreferredTempUnit);
		SepiaFW.debug.log('Account: set userPreferredTempUnit=' + userPreferredTempUnit);
	}

	//get shared access permission
	Account.getSharedAccessPermissions = function(){
		return sharedAccessPermissions;
	}
	Account.setSharedAccessPermissions = function(newValue){
		//TODO: update or replace?
		sharedAccessPermissions = newValue;
		SepiaFW.data.updateAccount('sharedAccessPermissions', sharedAccessPermissions);
		SepiaFW.debug.log('Account: set sharedAccessPermissions=' + JSON.stringify(sharedAccessPermissions));
	}
	
	//load data from account
	//TODO: test and errorCallback
	Account.loadAccountData = function(fieldArray, successCallback, errorCallback){
		getAccountData("", fieldArray, function(data){
			SepiaFW.debug.log('Account - successfully loaded account data.');
			if (successCallback){
				if (data.get_result){
					successCallback(data.get_result);
				}else{
					if (errorCallback) errorCallback("Unexpected error in Account.loadAccountData.");
				}
			}
		}, function(msg){
			SepiaFW.ui.showPopup(msg);
			//errorCallback
		});
	}
	//save account settings value
	//TODO: add callbacks?
	Account.saveAccountData = function(dataBody, successCallback, errorCallback){
		setAccountData("", dataBody, function(data){
			if (successCallback){
				successCallback(data);
			}else{
				SepiaFW.debug.log('Account - successfully stored account data.');
			}
		}, function(msg){
			if (errorCallback){
				errorCallback(msg);
			}else{
				SepiaFW.ui.showPopup(msg);
			}
		});
	}
	//delete data from account
	//TODO: test and errorCallback (in many cases this behaves different than expected because it cannot delete objects ... I think)
	Account.deleteAccountData = function(fieldArray, successCallback, errorCallback){
		deleteAccountData("", fieldArray, function(data){
			SepiaFW.debug.log('Account - successfully deleted account data.');
			if (successCallback){
				if (data.delete_result){
					successCallback(data.delete_result);
				}else{
					if (errorCallback) errorCallback("Unexpected error in Account.deleteAccountData.");
				}
			}
		}, function(msg){
			SepiaFW.ui.showPopup(msg);
			//errorCallback
		});
	}
	
	//Store and load app settings from account
	Account.encryptAndSaveAppSettings = function(){
		var deviceId = SepiaFW.config.getDeviceId();
		var appData = SepiaFW.data.getAll();
		delete appData["account"];
		SepiaFW.ui.showPopup("This will store your custom settings for this device (ID) on the server.<br><br>"
				+ "Please define a security key or PIN to encrypt the data.", {
			inputLabelOne: "Key or PIN",
			buttonOneName: "OK",
			buttonOneAction: function(btn, pwd){
				if (pwd){
					var encryptedData = SepiaFW.tools.encryptBasic(pwd, appData);
					if (encryptedData){
						saveAppSettings(deviceId, encryptedData, function(){
							SepiaFW.ui.showPopup('Successfully stored app settings.');
						}, function(msg){
							SepiaFW.ui.showPopup('Error while trying to store app settings: ' + msg);
						});
					}
				}
			},
			buttonTwoName: "ABORT",
			buttonTwoAction: function(btn, input1){}
		});
	}
	Account.loadAndDecryptAppSettings = function(){
		var deviceId = SepiaFW.config.getDeviceId();
		SepiaFW.ui.showPopup("This will load your custom settings for this device (ID) from the server.<br><br>"
				+ "Please enter the security key or PIN to decrypt the data.", {
			inputLabelOne: "Key or PIN",
			buttonOneName: "OK",
			buttonOneAction: function(btn, pwd){
				if (pwd){
					loadAppSettings(deviceId, function(res){
						if (res){
							//Success
							var decryptedData = SepiaFW.tools.decryptBasic(pwd, res);
							if (decryptedData && typeof decryptedData == "object"){
								//console.log(decryptedData);
								$.each(decryptedData, function(key, entry){
									//console.log(key + " - " + entry);
									SepiaFW.data.set(key, entry);
								})
								//window.location.reload(true);
								SepiaFW.ui.showPopup('Successfully loaded app settings. Please reload interface to see effects.');
							}else{
								//Error
								SepiaFW.ui.showPopup("Sorry, could not load app settings, wrong key/PIN or corrupted data!");
							}
						}else{
							//Error
							SepiaFW.ui.showPopup("Sorry, could not load app settings, there seems to be no data or data was not accessible!");
						}
					}, function(err){
						//Error
						SepiaFW.ui.showPopup("Sorry, could not load app settings! Error: " + err);
					});
				}
			},
			buttonTwoName: "ABORT",
			buttonTwoAction: function(btn, input1){}
		});
	}
	function saveAppSettings(deviceIdOrNull, settingsData, successCallback, errorCallback){
		if (!deviceIdOrNull) deviceIdOrNull = "commonSettings";
		//Account.INFOS -> Account.APP_SETTINGS -> deviceIdOrNull
		var data = {}; data[deviceIdOrNull] = settingsData;
		var infos = {}; infos[Account.APP_SETTINGS] = data;
		Account.saveAccountData({
			infos: infos
		}, function(){
			if (successCallback) successCallback();
		}, function(msg){
			if (errorCallback) errorCallback(msg);
		});
	}
	function loadAppSettings(deviceIdOrNull, successCallback, errorCallback){
		if (!deviceIdOrNull) deviceIdOrNull = "commonSettings";
		var appSettingsPath = Account.INFOS + "." + Account.APP_SETTINGS + "." + deviceIdOrNull;
		Account.loadAccountData([appSettingsPath], function(data){
			//Success
			var res = data[appSettingsPath];
			if (successCallback) successCallback(res);
		}, function(e){
			//Error
			if (errorCallback) errorCallback(e);
		});
	}

	//load address from account
	Account.loadAddressByTag = function(tag, successCallback, errorCallback){
		if (Array.isArray(tag)){
			SepiaFW.debug.log('Account.loadAddressByTag warning! Requesting via array is possible but with this method '
				+ 'you will only get back the result of the first request in the array!');
			tag = tag[0];
		}
		//TODO: change from tag to tags
		if (tag === Account.ADDRESS_TAG_HOME || tag === Account.ADDRESS_TAG_WORK){
			var dataBody = {};
			var adr = new Object();
			adr.specialTag = tag;
			dataBody[Account.ADDRESSES] = [adr];
			//load
			getUserData("", dataBody, function(data){
				SepiaFW.debug.log('Account - successfully loaded address with tag: ' + tag);
				if (successCallback){
					//we only return the result of the first request
					if (data.get_result){
						var addresses = data.get_result[Account.ADDRESSES];
						if (addresses && addresses.length > 0 && addresses[0].length > 0){
							//we only take one address (expecting one result for one tag)
							successCallback(addresses[0][0]);
						}else{
							successCallback({});
						}
					}else{
						if (errorCallback) errorCallback("Unexpected error in Account.loadAddressByTag.");
					}
				}
			}, function(msg){
				if (errorCallback) errorCallback(msg);
			});
		}else{
			SepiaFW.debug.err("Account - cannot load address with tag '" + tag + "' yet");
			if (errorCallback) errorCallback('Address tag unknown.');
		}
	}
	//save address to account
	Account.saveAddressWithTag = function(tag, street, streetNbr, city, zip, country){
		if (tag === Account.ADDRESS_TAG_HOME || tag === Account.ADDRESS_TAG_WORK){
			//build address object
			var adr = new Object();
			adr.specialTag = tag;
			adr.city = city || '';
			adr.country = country || '';
			adr.code = zip || '';
			adr.street = street || '';
			adr.s_nbr = streetNbr || '';
			adr.latitude = '';
			adr.longitude = '';
			var dataBody = {};
			dataBody[Account.ADDRESSES] = [adr];
			//store data
			setUserData("", dataBody, function(data){
				SepiaFW.debug.log('Account - successfully stored address with tag: ' + tag);
			}, function(msg){
				SepiaFW.ui.showPopup(msg);
			});
			
		}else{
			SepiaFW.debug.err("Account - cannot store address with tag '" + tag + "' yet");
		}
	}
	//delete address from account
	Account.deleteAddress = function(adrData){
		var dataBody = {};
		if (Array.isArray(adrData)){
			/*$.each(adrData, function(index, a){
				delete a....;		//<- remove stuff to save some space, it is not necessary to identify the address (everything except id and tag?)
			});*/
			dataBody[Account.ADDRESSES] = adrData;
		}else{
			//delete adrData...;		//<- remove stuff to save some space, it is not necessary to identify the address
			dataBody[Account.ADDRESSES] = [adrData];
		}
		deleteUserData("", dataBody, function(data){
			if (successCallback){ successCallback(data); }
		}, function(data){
			if (errorCallback){ errorCallback(data) }
		});
	}
	
	//save list (shopping, todo, alarms, timers, ...)
	Account.saveList = function(listData, successCallback, errorCallback){
		var dataBody = {};
		if (Array.isArray(listData)){
			dataBody[Account.LISTS] = listData;
		}else{
			dataBody[Account.LISTS] = [listData];
		}
		setUserData("", dataBody, function(data){
			if (successCallback){ successCallback(data); }
		}, function(data){
			if (errorCallback){ errorCallback(data) }
		});
	}
	//load list - actually it loads an array of lists that fit to the request 
	//(or an array of arrays if the request itself is an array)
	Account.loadList = function(listData, successCallback, errorCallback){
		var dataBody = {};
		if (Array.isArray(listData)){
			SepiaFW.debug.log('Account.loadList warning! Requesting via array is possible but with this method '
				+ 'you will only get back the result of the first request in the array!');
			dataBody[Account.LISTS] = listData;
		}else{
			dataBody[Account.LISTS] = [listData];
		}
		getUserData("", dataBody, function(data){
			if (successCallback){
				//we only return the result of the first request
				if (data.get_result){
					var lists = data.get_result[Account.LISTS];
					if (lists && lists.length > 0){
						successCallback({
							"lists" : lists[0]
						});
					}else{
						successCallback({
							"lists" : []
						});
					}
				}else{
					if (errorCallback) errorCallback("Unexpected error in Account.loadList.");
				}
			}
		}, function(data){
			if (errorCallback){ errorCallback(data) }
		});
	}
	//delete list
	Account.deleteList = function(listData, successCallback, errorCallback){
		var dataBody = {};
		if (Array.isArray(listData)){
			$.each(listData, function(index, lst){
				delete lst.data;		//<- remove data to save some space, it is not necessary to identify the list
			});
			dataBody[Account.LISTS] = listData;
		}else{
			delete listData.data;		//<- remove data to save some space, it is not necessary to identify the list
			dataBody[Account.LISTS] = [listData];
		}
		deleteUserData("", dataBody, function(data){
			if (successCallback){ successCallback(data); }
		}, function(data){
			if (errorCallback){ errorCallback(data) }
		});
	}
	
	//-------------------------------------------------

	var loginRetryIntervalTimer;
	var loginRetryMaxDelay = 1000*60*5;
	var loginRetryBaseDelay = 3000;
	var loginRetryFailed = 0;
	
	//Show form inside login box and hide "wait" message etc.
	Account.hideSplashscreen = function(){
		if ("splashscreen" in navigator){
            navigator.splashscreen.hide();
        }
	}
	Account.prepareLoginBoxForInput = function(aniTime){
		Account.hideSplashscreen();
		if (aniTime == undefined) aniTime = 600;
		$('#sepiaFW-login-wait').hide();
		$('#sepiaFW-login-form').fadeIn(aniTime);
		$('#sepiaFW-login-links').fadeIn(aniTime);
		//$('#sepiaFW-login-extend-box').css({visibility: "visible"});
		$('#sepiaFW-login-extend-btn').show();
		clearInterval(loginRetryIntervalTimer);
	}
	
	//Setup login-box
	Account.setupLoginBox = function(){
		clearInterval(loginRetryIntervalTimer);
		loginRetryFailed = 0;
		//demo login?
		var demoLogin = SepiaFW.data.get('isDemoLogin');
		if (demoLogin){
			userRoles = [demoLogin];
			skipLogin(demoLogin);
			return;
		}
		//try restore from data-storage to avoid login popup - refresh required after e.g. 1 day = 1000*60*60*24
		var account = SepiaFW.data.get('account');
		var safe = false;
		var hostnameChange = false;
		if (account && account.hostname && account.hostname == SepiaFW.config.host){
			safe = true;		//login can be restored since we send data to the same host we got login in the first place
		}else if (account && account.hostname){
			SepiaFW.debug.log('Account: preventing auto-login due to changed hostname ... please login again if you trust the host!');
			hostnameChange = true;
		}
		var clientIdChanged = false;
		if (account && account.clientDeviceId && account.clientDeviceId != SepiaFW.config.getClientDeviceInfo()){
			clientIdChanged = true;
		}
		//use existing token - skip refresh
		var now = new Date().getTime();
		var isFresh = (account && account.lastRefresh && ((now - account.lastRefresh) < (1000*60*60*12)));
		var isExpired = (account && account.userTokenValidUntil && ((account.userTokenValidUntil - now) <= 0));
		if (isExpired) isFresh = false;
		if (safe && account && account.userToken && account.lastRefresh && isFresh && !clientIdChanged){
			//primary
			userId = account.userId;
			userToken = account.userToken;
			userTokenValidUntil = account.userTokenValidUntil;
			userName = account.userName;	
			if (userName) SepiaFW.config.broadcastUserName(userName);
			language = account.language;
			if (language) SepiaFW.config.broadcastLanguage(language);	//TODO: add region?

			//secondary
			userRoles = account.userRoles;
			userPreferredTempUnit = account.userPreferredTempUnit;
			sharedAccessPermissions = account.sharedAccessPermissions;

			SepiaFW.debug.log('Account: login restored');
			
			var lBox = document.getElementById("sepiaFW-login-box");
			if (lBox && lBox.style.display != 'none'){
				Account.toggleLoginBox();
			}else{
				$('#sepiaFW-login-retry').off().hide();		//prevent abuse of retry button!
			}
			broadcastLoginRestored();
			Account.afterLogin();

		//try refresh
		}else if (safe && account && account.userToken && !isExpired && !clientIdChanged){
			SepiaFW.debug.log('Account: trying login auto-refresh with token');
			pwdIsToken = true;
			//indicated ID
			$('#sepiaFW-login-id').val(account.userId);
			//send to refresh token
			Account.login(account.userId, account.userToken, onLoginSuccess, onLoginError, onLoginDebug);

		//warn about expired
		}else if (isExpired){
			onLoginError(SepiaFW.local.g('loginFailedExpired'), 5);

		//warn about changed host
		}else if (hostnameChange){
			onLoginError(SepiaFW.local.g('loginFailedHost'), 6);

		//warn about client-device-id change
		}else if (clientIdChanged){
			onLoginError(SepiaFW.local.g('loginFailedClientId'), 6);

		}else{
			Account.prepareLoginBoxForInput();
		}
		
		//add language selector
		var langSelBox = document.getElementById("sepiaFW-language-selector");
		if (langSelBox){
			langSelBox.appendChild(SepiaFW.ui.build.languageSelector("sepiaFW-login-language-dropdown", function(selectedLanguage){
				SepiaFW.data.set('app-language', selectedLanguage);
				var url = SepiaFW.tools.setParameterInURL(window.location.href, 'lang', selectedLanguage);
				setTimeout(function(){
				    window.location.href = url;
				}, 2000);
				Account.toggleLoginBox();
				SepiaFW.ui.showPopup(SepiaFW.local.g('oneMoment'));
			}));
		}
		//login box menu button
		$("#sepiaFW-login-box-menu-btn").off().on('click', function(){
			Account.toggleLoginBox();
			setTimeout(function(){
				SepiaFW.ui.toggleSettings(1, function(){ Account.toggleLoginBox(); });
			}, 200);
		});
		
		//login-button
		var logSendBtn = $("#sepiaFW-login-send").off().on("click", function(){
			sendLoginFromBox();
		});
		//id placeholder
		var idInput = document.getElementById("sepiaFW-login-id");
		idInput.placeholder = SepiaFW.local.g('username');
		$(idInput).off().on("keydown", function(e){
			if (e.key == "Enter") { pwdInput.focus(); }
		});
		//keypress on pwd
		var pwdInput = document.getElementById("sepiaFW-login-pwd");
		pwdInput.placeholder = SepiaFW.local.g('password');
		$(pwdInput).off().on("keydown", function (e) {
			if (e.key == "Enter") { sendLoginFromBox(); }
		});
		//create-account-button
		var $createAccBtn = $('#sepiaFW-login-create').off().on("click", function(){
			Account.toggleLoginBox();
			setTimeout(function(){
				SepiaFW.frames.open({pageUrl: "create-account.html", onClose: Account.toggleLoginBox});
			}, 200);
		});
		//close-button
		var $clsBtn = $("#sepiaFW-login-close").off().on("click", function(){
			skipLogin();
		});
		//retry-button
		var $retryBtn = $('#sepiaFW-login-retry').off().on("click", function(){
			sendLoginFromBox();
		});
		//hostname input field
		var $hostInput = $("#sepiaFW-login-host-name");
		$hostInput.val(SepiaFW.config.host);
		SepiaFW.ui.onKeyboardInput($hostInput.get(0), undefined, function(ele){
			SepiaFW.config.setHostName($hostInput.val());
			setTimeout(function(){
				Account.toggleLoginBox();
			}, 450);
		});
		$("#sepiaFW-login-host-details").off().on('click', function(){
			Account.toggleLoginBox();
			setTimeout(function(){
				SepiaFW.config.openEndPointsSettings();
			}, 500);
		});
		//license
		var licBtn = $("#sepiaFW-login-license-btn").off().on("click", function(event){
			event.preventDefault();
			SepiaFW.ui.actions.openUrlAutoTarget(SepiaFW.config.clientLicenseUrl);
		});
		//data privacy policy
		var policyBtn = $("#sepiaFW-login-policy-btn").off().on("click", function(event){
			event.preventDefault();
			var policyUrl = SepiaFW.config.privacyPolicyUrl + "?host=" + encodeURIComponent(SepiaFW.config.host);
			SepiaFW.ui.actions.openUrlAutoTarget(policyUrl);
		});
		
		//extend button
		var $extendBtn = $('#sepiaFW-login-extend-btn');
		$extendBtn.off().on("click", function(){
			var isVisible = ($extendBtn.find('i').html() == 'arrow_drop_up');
			$('#sepiaFW-login-box').find('.extended-controls').each(function(){
				if (isVisible){
					$(this).fadeOut(150);
					$('#sepiaFW-login-help-btn').fadeOut(150);
				}else{
					$(this).fadeIn(300);
					$('#sepiaFW-login-help-btn').fadeIn(300);
				}
			});
			if (isVisible){
				$extendBtn.find('i').html('arrow_drop_down');
			}else{
				$extendBtn.find('i').html('arrow_drop_up');
			}
			//$('#sepiaFW-login-extend-box').hide();
		});
	}
	function skipLogin(demoId){
		userId = "";		//demo logins don't have an ID (reset here if a test account was used to login)
		if (demoId && demoId == "setup"){
			//temporarily disabled
			SepiaFW.speech.skipTTS = true;
			SepiaFW.wakeTriggers.useWakeWord = false;
			SepiaFW.debug.log("Deactivated for setup: TTS, Wake-Word");
		}
		Account.toggleLoginBox();
		broadcastEnterWithoutLogin();
		Account.afterLogin();
	}
	function sendLoginFromBox(forceId, forcePwd){
		clearInterval(loginRetryIntervalTimer);
		$('#sepiaFW-login-retry').off().hide();
		loginRetryFailed = 0;
		pwdIsToken = false;
		var id;
		if (forceId){
			document.getElementById("sepiaFW-login-id").value = forceId;
			id = forceId;
		}else{
			id = document.getElementById("sepiaFW-login-id").value;
		}
		var pwdField = document.getElementById("sepiaFW-login-pwd");
		var pwd = forcePwd || pwdField.value;
		pwdField.value = '';
		if (id && pwd && (id.length > 3) && (pwd.length > 5)) {
			userId = id;
			Account.login(userId, pwd, onLoginSuccess, function(errorText, errorCode, retryAction){
				//prevent automatic retry
				if (retryAction){
					$('#sepiaFW-login-retry').show().off().on("click", function(){
						clearInterval(loginRetryIntervalTimer);
						retryAction();
					});
				}
				onLoginError(errorText, errorCode, undefined);
			}, onLoginDebug);
		}else{
			onLoginError(SepiaFW.local.g('loginFailedPlain'), 0);
		}
	}
	function onLoginSuccess(data){
		var lBox = document.getElementById("sepiaFW-login-box");
		if (lBox && lBox.style.display != 'none'){
			Account.toggleLoginBox();
		}else{
			$('#sepiaFW-login-retry').off().hide();		//prevent abuse of retry button!
		}
		//console.log(data);		//DEBUG
		
		//NOTE: we use the generalized top-level fields here that are different to the default "account" ones (see Java: Authenticator class)
		//uid, email, phone
		//user_roles
		//user_name
		//user_lang_code
		//user_birth
		//bot_character
		//unit_pref_temp
		
		userToken = data.keyToken;
		userTokenValidUntil = data.validUntil;
		userId = data.uid;
		//get call name
		if (data["user_name"]){
			var uname = data["user_name"];
			var unn = uname[Account.NICK_NAME];
			var unf = uname[Account.FIRST_NAME];
			if (unn && unn.length>1){
				userName = unn;
			}else if (unf && unf.length>1){
				userName = unf;
			}
			//SepiaFW.debug.info(unn  + ", " + unf + ", " + uname);
			//broadcast
			SepiaFW.config.broadcastUserName(userName);
		}
		//get preferred language
		if (data['user_lang_code'] && data['user_lang_code'].length > 1){
			language = data['user_lang_code'];
			SepiaFW.config.broadcastLanguage(language);		//TODO: add region?
		}
		//get user roles
		userRoles = data['user_roles'];
		//get preferred temperature unit
		if (data['unit_pref_temp']){
			userPreferredTempUnit = data['unit_pref_temp'];
		}
		//get shared access permissions
		if (data['shared_access']){
			sharedAccessPermissions = data['shared_access'];
		}
		
		//store data
		var account = new Object();
		account.userId = userId;
		account.userToken = userToken;
		account.userTokenValidUntil = userTokenValidUntil;
		account.userName = userName;
		account.language = language;
		account.lastRefresh = new Date().getTime();
		account.hostname = SepiaFW.config.host;
		account.clientDeviceId = SepiaFW.config.getClientDeviceInfo();
		//secondary infos (not necessarily in login-data)
		account.userRoles = userRoles;
		account.userPreferredTempUnit = userPreferredTempUnit;
		account.sharedAccessPermissions = sharedAccessPermissions;

		//write
		SepiaFW.data.set('account', account);
		
		//what happens next? typically this is used by a client implementation to continue
		broadcastLoginSuccess();
		Account.afterLogin();
	}
	function onLoginError(errorText, errorCode, retryAction){
		/* Error codes:
			0 - wrong input
			1 - offline
			2 - no server answer
			3 - login failed
			4 - login blocked
			5 - login token correct but expired
			6 - hostname or client changed
			7 - internal server error (wrong input format?)
			10 - unknown error
		*/
		clearInterval(loginRetryIntervalTimer);
		loginRetryFailed++;
		Account.prepareLoginBoxForInput(0);
		var lBoxError = document.getElementById("sepiaFW-login-status");
		if(lBoxError){
			lBoxError.textContent = errorText;
			SepiaFW.animate.flash("sepiaFW-login-status", 150);
		}else{
			SepiaFW.debug.err('Login: ' + errorText);
		}
		if (retryAction && (errorCode == 1 || errorCode == 2)){
			var targetDelay = Math.min(loginRetryBaseDelay * (loginRetryFailed*loginRetryFailed), loginRetryMaxDelay);
			if (retryAction){
				$('#sepiaFW-login-retry').show().off().on("click", function(){
					clearInterval(loginRetryIntervalTimer);
					retryAction();
				});
			}
			loginRetryIntervalTimer = setInterval(function(){
				targetDelay = targetDelay - 1000;
				if (SepiaFW.client.isActive() || SepiaFW.client.isDemoMode()){
					clearInterval(loginRetryIntervalTimer);
				}else if (retryAction && targetDelay > 0){
					if(lBoxError){
						lBoxError.textContent = errorText.replace(/:-\(/, "").replace(/\s\(.*?\)$/, "") + " (" + (Math.round(targetDelay/1000)) + "s)";
					}
				}else{
					if(lBoxError){
						lBoxError.textContent = SepiaFW.local.g("sendLogin") + "...";
					}
					clearInterval(loginRetryIntervalTimer);
					SepiaFW.debug.info("Automatic login retry ...");
					if (retryAction) retryAction();
				}
			}, 1000);
		}
		broadcastLoginFail(errorText, errorCode);
	}
	function onLoginDebug(data){
		//SepiaFW.debug.log('Account debug: ' + JSON.stringify(data));
	}
	
	//toggle login box on off
	Account.toggleLoginBox = function(){
		Account.hideSplashscreen();
		clearInterval(loginRetryIntervalTimer);
		$('#sepiaFW-login-retry').off().hide();		//prevent abuse of retry button!
		//reset status text and auto-setup
		$("#sepiaFW-login-status").html("");
		//reset extra info block
		$("#sepiaFW-login-extra-info").html("");
		//reset auto-setup
		var box = document.getElementById("sepiaFW-login-box");
		box.classList.remove("pending-setup-mode");
		//toggle
		if (box && box.style.display == 'none'){
			$("#sepiaFW-main-window").addClass("sepiaFW-translucent-10 no-interaction");
			$(box).fadeIn(300, function(){
				$(box).css({'opacity': 1.0});
			});
		}else if (box){
			//box.style.display = 'none';
			$(box).stop().fadeOut(300, function(){
				$(box).css({'opacity': 1.0});
			});
			$("#sepiaFW-main-window").removeClass("sepiaFW-translucent-10 no-interaction");
		}
	}
	Account.isLoginBoxOpen = function(){
		var box = document.getElementById("sepiaFW-login-box");
		if (box && box.style.display != 'none') return true;
		else return false;
	}
	
	//Logout action e.g. for button
	Account.logoutAction = function(logoutAll){
		logoutSectionsFinished = 0;
		listenForLogoutActions = true;
		//info message
		var config = {
			buttonOneName : "Ok I will wait",
			buttonOneAction : function(){},
			buttonTwoName : "Skip (unsafe)",
			buttonTwoAction : function(){ location.reload(); },
		};
		SepiaFW.ui.showPopup('Signing out ...', config);

		//stop some running stuff
		SepiaFW.speech.stopSpeech();
		SepiaFW.audio.stop();
		
		//try logout - fails silently (low prio, good idea???)
		if (userId && userToken){
			if (logoutAll){
				Account.logoutAll(getKey(), onLogoutSuccess, onLogoutFail, onLogoutDebug);
			}else{
				Account.logout(getKey(), onLogoutSuccess, onLogoutFail, onLogoutDebug);
			}
		}else{
			Account.finishedLogoutActionSection('Server-logout', true);
		}
		//remove account data
		SepiaFW.data.del('account');
		//broadcast try and remove more data
		broadcastLogoutTry();
		
		//do other user/client actions
		Account.duringLogout();
		Account.finishedLogoutActionSection('Custom-action', true);
		
		//open box
		/*
		var lBox = document.getElementById("sepiaFW-login-box");
		if (lBox && lBox.style.display == 'none'){
			Account.toggleLoginBox();
		}
		*/
	}
	function onLogoutSuccess(data){
		SepiaFW.debug.log('Account: logout successful');
		broadcastLogoutSuccess();
		Account.finishedLogoutActionSection('Server-logout', true);
	}
	function onLogoutFail(data){
		SepiaFW.debug.err('Account: complete logout failed! But local data has been removed.');
		broadcastLogoutFail();
		Account.finishedLogoutActionSection('Server-logout', false);
	}
	function onLogoutDebug(data){
		//SepiaFW.debug.log('Account debug: ' + JSON.stringify(data));
	}
	
	//Finish logout try by letting all 'sections' report in
	var logoutSectionsToFinish = 4;		//1:Server-logout, 2:App-data, 3:Background-events, 4:Custom-action
	var logoutSectionsFinished = 0;
	var listenForLogoutActions = false;
	//TODO: add a timeout, count true/false
	Account.finishedLogoutActionSection = function(sectionName, sectionSuccess){
		if (listenForLogoutActions){
			//console.log('Section: ' + sectionName + "; success: " + sectionSuccess); 		//DEBUG
			logoutSectionsFinished++;
			if (logoutSectionsFinished >= logoutSectionsToFinish){
				//final clean-ups
				userId = "";
				userToken = "";
				userTokenValidUntil = 0;
				userName = "";
				SepiaFW.client.setDemoMode(false);
				//done
				listenForLogoutActions = false;
				logoutSectionsFinished = 0;
				//info message
				var config = {
					buttonOneName : "Return to sign in",
					buttonOneAction : function(){
						setTimeout(function(){
							window.location.reload();
						}, 1000);
					}
				};
				SepiaFW.ui.showPopup('Sign-out done!', config);
				Account.afterLogout();
			}
		}
	}
	
	//---- API communication ----

	//LOGIN
	Account.loginViaForm = function(id, pwd){
		if (SepiaFW.client.isDemoMode() || Account.getUserId()){
			SepiaFW.debug.error("Called login via form but client is active. Logout first! "
					+ "(UserID: " + SepiaFW.account.getUserId() + ", Demo: " + SepiaFW.client.isDemoMode() + ")");
			return false;
		}else{
			sendLoginFromBox(id, pwd);
			return true;
		}
	}
	Account.login = function(userid, pwd, successCallback, errorCallback, debugCallback){
		SepiaFW.ui.showLoader();
		//demo login?
		if (demoAccounts[userid] && pwd == demoAccounts[userid]){
			SepiaFW.data.set('isDemoLogin', userid);
			userRoles = [userid];
			SepiaFW.ui.hideLoader();
			skipLogin(userid);
			return;
		}
		//hash password
		var pwTokenOrHash;
		if (pwd && !pwdIsToken){
			//encrypt
			pwTokenOrHash = getSHA256(pwd);
		}else{
			pwTokenOrHash = pwd;
		}
		//call authentication API for validation
		var api_url = SepiaFW.config.assistAPI + "authentication";
		var dataBody = new Object();
		dataBody.action = "validate";
		dataBody.KEY = userid + ";" + pwTokenOrHash;
		//dataBody.GUUID = userid;		//<-- DONT USE THAT IF ITS NOT ABSOLUTELY NECESSARY (its bad practice and a much heavier load for the server!)
		//dataBody.PWD = pwd;
		dataBody.client = SepiaFW.config.getClientDeviceInfo(); //SepiaFW.config.clientInfo;
		//SepiaFW.debug.info('URL: ' + api_url);
		clearInterval(loginRetryIntervalTimer);
		var retryAction = function(){
			Account.login(userid, pwd, successCallback, errorCallback, debugCallback);
		};
		$.ajax({
			url: api_url,
			timeout: 8000,
			type: "POST",
			data: JSON.stringify(dataBody),
			headers: {
				"content-type": "application/json",
				"cache-control": "no-cache"
			},
			success: function(data) {
				SepiaFW.ui.hideLoader();
				if (debugCallback) debugCallback(data);
				if (data && data.result){
					var status = data.result;
					if (status == "fail"){
						//error code remapping
						if (data.code && data.code == 3){
							if (errorCallback) errorCallback(SepiaFW.local.g('loginFailedServer'), 7, retryAction);
						}else if (data.code && data.code == 10){
							if (errorCallback) errorCallback(SepiaFW.local.g('loginFailedBlocked'), 4, retryAction);
						}else if (data.code && data.code == 5){
							if (errorCallback) errorCallback(SepiaFW.local.g('loginFailedExpired'), 5, retryAction);	//token was correct but expired
						}else{
							if (errorCallback) errorCallback(SepiaFW.local.g('loginFailedUser'), 3, retryAction);
						}
						return;
					}
					//assume success
					else{
						if(data.keyToken && (data.keyToken.length > 7)){
							//----callback----
							//console.log(JSON.stringify(data)); 		//DEBUG
							if (successCallback) successCallback(data);
						}
					}		
				}else{
					if (errorCallback) errorCallback("Login failed! Sorry, but there seems to be an unknown error :-(", 10, retryAction);
				}
			},
			error: function(data) {
				SepiaFW.ui.hideLoader();
				SepiaFW.client.checkNetwork(function(){
					if (errorCallback) errorCallback("Login failed! Sorry, but it seems the server does not answer :-(", 2, retryAction);
				}, function(){
					if (errorCallback) errorCallback("Login failed! Sorry, but it seems you are offline :-(", 1, retryAction);
				});
				if (debugCallback) debugCallback(data);
			}
		});
	}
	Account.afterLogin = function(){};
	
	//LOGOUT
	Account.logout = function(key, successCallback, errorCallback, debugCallback){
		var modifiedErrorCallback = function(err){
			if (errorCallback && typeof err == 'object'){
				errorCallback('Sorry, but the log-out process failed! Please log-in again to overwrite old token.');
			}else if (errorCallback){
				errorCallback(err);
			}
		}
		authApiCall("logout", key, '', successCallback, modifiedErrorCallback, debugCallback);
	}
	Account.logoutAll = function(key, successCallback, errorCallback, debugCallback){
		var modifiedErrorCallback = function(err){
			if (errorCallback && typeof err == 'object'){
				errorCallback('Sorry, but the log-out process failed! Please log-in again to overwrite old token.');
			}else if (errorCallback){
				errorCallback(err);
			}
		}
		authApiCall("logoutAllClients", key, '', successCallback, modifiedErrorCallback, debugCallback);
	}
	Account.requestPasswordChange = function(data, successCallback, errorCallback, debugCallback){
		var requestBody = {
			userid: data.targetUserId,
			type: "oldPassword",
			authKey: data.authKey
		}
		authApiCall("requestPasswordChange", getKey(), requestBody, successCallback, errorCallback, debugCallback);
	}
	Account.changePassword = function(data, successCallback, errorCallback, debugCallback){
		authApiCall("changePassword", '', data, successCallback, errorCallback, debugCallback);
	}
	function authApiCall(action, key, requestBody, successCallback, errorCallback, debugCallback){
		SepiaFW.ui.showLoader();
		var apiUrl = SepiaFW.config.assistAPI + "authentication";
		var dataBody = requestBody || new Object();
		dataBody.action = action;
		dataBody.KEY = key;
		dataBody.client = SepiaFW.config.getClientDeviceInfo(); //SepiaFW.config.clientInfo;
		$.ajax({
			url: apiUrl,
			timeout: 8000,
			type: "POST",
			data: JSON.stringify(dataBody),
			headers: {
				"content-type": "application/json",
				"cache-control": "no-cache"
			},
			success: function(data) {
				SepiaFW.ui.hideLoader();
				if (debugCallback) debugCallback(data);
				if (data.result && data.result === "fail"){
					if (errorCallback) errorCallback(data);
					return;
				}
				//--callback--
				if (successCallback) successCallback(data);
			},
			error: function(data) {
				SepiaFW.ui.hideLoader();
				SepiaFW.client.checkNetwork(function(){
					if (errorCallback) errorCallback('Sorry, but the process failed because the server could not be reached :-( Please wait a bit and then try again!');
				}, function(){
					if (errorCallback) errorCallback('Sorry, but the process failed because it seems you are offline :-( Please wait for a connection and then try again.');
				});
				if (debugCallback) debugCallback(data);
			}
		});
	}
	
	Account.afterLogout = function(){}; 		//executed after all logout sections finished
	Account.duringLogout = function(){};		//executed before finish message, blocks sections-complete if synchronous
	
	//-------------------
	
	//GET ACCOUNT-DATA
	function getAccountData(key, fieldArray, successCallback, errorCallback, debugCallback){
		var apiUrl = SepiaFW.config.assistAPI + "account";
		var data = {
			"get" : fieldArray
		};
		dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback);
	}
	//SET ACCOUNT-DATA
	function setAccountData(key, accountData, successCallback, errorCallback, debugCallback){
		var apiUrl = SepiaFW.config.assistAPI + "account";
		var data = {
			"set" : accountData
		};
		dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback);
	}
	//DELETE ACCOUNT-DATA
	function deleteAccountData(key, fieldArray, successCallback, errorCallback, debugCallback){
		var apiUrl = SepiaFW.config.assistAPI + "account";
		var data = {
			"delete" : fieldArray
		};
		dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback);
	}
	
	//GET USER-DATA
	function getUserData(key, userData, successCallback, errorCallback, debugCallback){
		var apiUrl = SepiaFW.config.assistAPI + "userdata";
		var data = {
			"get" : userData
		};
		dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback);
	}
	//SET USER-DATA
	function setUserData(key, userData, successCallback, errorCallback, debugCallback){
		var apiUrl = SepiaFW.config.assistAPI + "userdata";
		var data = {
			"set" : userData
		};
		dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback);
	}
	//DELETE USER-DATA
	function deleteUserData(key, userData, successCallback, errorCallback, debugCallback){
		var apiUrl = SepiaFW.config.assistAPI + "userdata";
		var data = {
			"delete" : userData
		};
		dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback);
	}
	//set, get or delete data
	function dataTransfer(apiUrl, key, data, successCallback, errorCallback, debugCallback){
		SepiaFW.ui.showLoader();
		//Demo mode?
		if (SepiaFW.client.isDemoMode()){
			setTimeout(function(){
				SepiaFW.ui.showPopup(SepiaFW.local.g('notPossibleInDemoMode'));
			}, 606);
			SepiaFW.ui.hideLoader();
			return;
		}
		//Authenticated?
		if (key){
			data.KEY = key;
		}else if (userId && userToken){
			data.KEY = getKey();
		}else{
			SepiaFW.ui.hideLoader();
			if (errorCallback) errorCallback("Data transfer failed! Not authorized or missing 'KEY'");
			return;
		}
		data.client = SepiaFW.config.getClientDeviceInfo(); //SepiaFW.config.clientInfo;
		data.device_id = SepiaFW.config.getDeviceId();
		//SepiaFW.debug.log('URL: ' + apiUrl);
		//SepiaFW.debug.log('Body: ' + JSON.stringify(data));
		$.ajax({
			url: apiUrl,
			timeout: 15000,
			type: "POST",
			data: JSON.stringify(data),
			headers: {
				"content-type": "application/json",
				"cache-control": "no-cache"
			},
			success: function(data) {
				SepiaFW.ui.hideLoader();
				if (debugCallback) debugCallback(data);
				if (data && data.result){
					var status = data.result;
					if (status == "fail"){
						var errMsg;
						if ((data.code || data.result_code) && (data.code == 3 || data.result_code == 3)){
							errMsg = "Data transfer failed! Communication error(?) - Msg: " + data.error;
						}else{
							errMsg = "Data transfer failed! Msg: " + data.error;
						}
						if (errorCallback) errorCallback(errMsg);
						broadcastAccountError(errMsg, 1);
						return;
					}
					//assume success
					else{
						//SepiaFW.debug.log('Data result: ' + JSON.stringify(data));
						if (successCallback) successCallback(data);
					}		
				}else{
					var errMsg = "Data transfer failed! Sorry, but there seems to be an unknown error :-(";
					if (errorCallback) errorCallback(errMsg);
					broadcastAccountError(errMsg, 1);
				}
			},
			error: function(data) {
				SepiaFW.ui.hideLoader();
				SepiaFW.client.checkNetwork(function(){
					var errMsg = "Data transfer failed! Sorry, but it seems you are offline :-(";
					if (errorCallback) errorCallback(errMsg);
					broadcastAccountError(errMsg, 1);
				}, function(){
					var errMsg = "Data transfer failed! Sorry, but it seems the network or the server do not answer :-(";
					if (errorCallback) errorCallback(errMsg);
					broadcastAccountError(errMsg, 1);
				});
				if (debugCallback) debugCallback(data);
			}
		});
	}
	
	//------------- helpers ---------------
	
	//sha256 hash + salt
	function getSHA256(data){
		return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data + "salty1"));
	}
	Account.hashPassword = function(pwd){
		return getSHA256(pwd);
	}
	
	//-------------------------------------
	
	return Account;
}