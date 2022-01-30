//v2.0.3 minified - See https://github.com/SEPIA-Framework/sepia-web-audio/tree/main/src/resources for original files
var PorcupineBuilder = function(wasmFileArrayBufferOrBase64Str, defaultWasmBinaryFile, moduleLoadCallback) {
	//@picovoice/porcupine-web-en-factory - v2.0.3 - 2021.12.05 - LICENSE: Apache-2.0
	//Modified for SEPIA Framework
	
	var PORCUPINE_WASM_BASE64;
	var PORCUPINE_WASM_ARRAY;
	
	//called at the end when '.create' is available
	function finalize(Porcupine){
		if (!Porcupine){
			console.error("PorcupineBuilder - 'Porcupine' module not found.");
			if (moduleLoadCallback) moduleLoadCallback();
			return
		}
		if (wasmFileArrayBufferOrBase64Str){
			if (typeof wasmFileArrayBufferOrBase64Str == "string"){
				//pre-loaded base64
				PORCUPINE_WASM_BASE64 = wasmFileArrayBufferOrBase64Str;
			}else if (wasmFileArrayBufferOrBase64Str instanceof ArrayBuffer){
				//pre-loaded array buffer
				PORCUPINE_WASM_ARRAY = wasmFileArrayBufferOrBase64Str;
			}else{
				console.error("PorcupineBuilder - 'wasmFileArrayBufferOrBase64Str' is wrong/unknown type.");
				if (moduleLoadCallback) moduleLoadCallback();
				return
			}
			if (moduleLoadCallback) moduleLoadCallback(Porcupine);
		}else{
			if (!defaultWasmBinaryFile){
				if (typeof SepiaFW == "object" && SepiaFW.wakeTriggers){
					//SEPIA file path
					defaultWasmBinaryFile = SepiaFW.wakeTriggers.getPorcupineWwData().engineFile;
				}else{
					//DEFAULT file path
					defaultWasmBinaryFile = "pv_porcupine.wasm";
				}
			}
			//load file (array buffer)
			if (typeof SepiaFW == "object" && SepiaFW.webAudio){
				SepiaFW.webAudio.readFileAsBuffer(defaultWasmBinaryFile, function(fileArrayBuffer){
					//finish
					PORCUPINE_WASM_ARRAY = wasmFileArrayBufferOrBase64Str;
					if (moduleLoadCallback) moduleLoadCallback(Porcupine);
				}, function(err){
					console.error("PorcupineBuilder - 'defaultWasmBinaryFile' failed to load. Path: " + defaultWasmBinaryFile);
					if (moduleLoadCallback) moduleLoadCallback();
				});
			}else{
				console.error("PorcupineBuilder - 'defaultWasmBinaryFile' loading not implemented.");
				if (moduleLoadCallback) moduleLoadCallback();
			}
		}
	}

	/**
	 * Copyright 2021 Picovoice Inc.
	 * Licensed under the Apache License, Version 2.0 found in the
	 * LICENSE file in the root directory of this source tree
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	var PorcupineWebFactory = (function(exports) {
		'use strict';
		
		function createCommonjsModule(a){var b={exports:{}};return a(b,b.exports),b.exports}var _typeof_1=createCommonjsModule(function(a){function b(c){"@babel/helpers - typeof";return a.exports="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?b=function(a){return typeof a}:b=function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},b(c)}a.exports=b});
		/**
		 * Copyright (c) 2014-present, Facebook, Inc.
		 * This source code is licensed under the MIT license found in the
		 * LICENSE file in the root directory of this source tree.
		 */
		var runtime_1=createCommonjsModule(function(a){var b=function(a){function b(a,b,c){return Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}),a[b]}function c(a,b,c,d){var f=b&&b.prototype instanceof e?b:e,g=Object.create(f.prototype),h=new n(d||[]);return g._invoke=j(a,c,h),g}function d(a,b,c){try{return{type:"normal",arg:a.call(b,c)}}catch(a){return{type:"throw",arg:a}}}function e(){}function f(){}function g(){}function h(a){["next","throw","return"].forEach(function(c){b(a,c,function(a){return this._invoke(c,a)})})}function i(a,b){function c(e,f,g,h){var i=d(a[e],a,f);if("throw"===i.type)h(i.arg);else{var j=i.arg,k=j.value;return k&&"object"==typeof k&&s.call(k,"__await")?b.resolve(k.__await).then(function(a){c("next",a,g,h)},function(a){c("throw",a,g,h)}):b.resolve(k).then(function(a){j.value=a,g(j)},function(a){return c("throw",a,g,h)})}}function e(a,d){function e(){return new b(function(b,e){c(a,d,b,e)})}return f=f?f.then(e,e):e()}var f;this._invoke=e}function j(a,b,c){var e="suspendedStart";return function(f,g){if("executing"===e)throw new Error("Generator is already running");if("completed"===e){if("throw"===f)throw g;return p()}for(c.method=f,c.arg=g;;){var h=c.delegate;if(h){var i=k(h,c);if(i){if(i===x)continue;return i}}if("next"===c.method)c.sent=c._sent=c.arg;else if("throw"===c.method){if("suspendedStart"===e)throw e="completed",c.arg;c.dispatchException(c.arg)}else"return"===c.method&&c.abrupt("return",c.arg);e="executing";var j=d(a,b,c);if("normal"===j.type){if(e=c.done?"completed":"suspendedYield",j.arg===x)continue;return{value:j.arg,done:c.done}}"throw"===j.type&&(e="completed",c.method="throw",c.arg=j.arg)}}}function k(a,b){var c=a.iterator[b.method];if(c===q){if(b.delegate=null,"throw"===b.method){if(a.iterator["return"]&&(b.method="return",b.arg=q,k(a,b),"throw"===b.method))return x;b.method="throw",b.arg=new TypeError("The iterator does not provide a 'throw' method")}return x}var e=d(c,a.iterator,b.arg);if("throw"===e.type)return b.method="throw",b.arg=e.arg,b.delegate=null,x;var f=e.arg;if(!f)return b.method="throw",b.arg=new TypeError("iterator result is not an object"),b.delegate=null,x;if(f.done)b[a.resultName]=f.value,b.next=a.nextLoc,"return"!==b.method&&(b.method="next",b.arg=q);else return f;return b.delegate=null,x}function l(a){var b={tryLoc:a[0]};1 in a&&(b.catchLoc=a[1]),2 in a&&(b.finallyLoc=a[2],b.afterLoc=a[3]),this.tryEntries.push(b)}function m(a){var b=a.completion||{};b.type="normal",delete b.arg,a.completion=b}function n(a){this.tryEntries=[{tryLoc:"root"}],a.forEach(l,this),this.reset(!0)}function o(a){if(a){var b=a[u];if(b)return b.call(a);if("function"==typeof a.next)return a;if(!isNaN(a.length)){var c=-1,d=function b(){for(;++c<a.length;)if(s.call(a,c))return b.value=a[c],b.done=!1,b;return b.value=q,b.done=!0,b};return d.next=d}}return{next:p}}function p(){return{value:q,done:!0}}var q,r=Object.prototype,s=r.hasOwnProperty,t="function"==typeof Symbol?Symbol:{},u=t.iterator||"@@iterator",v=t.asyncIterator||"@@asyncIterator",w=t.toStringTag||"@@toStringTag";try{b({},"")}catch(a){b=function(a,b,c){return a[b]=c}}a.wrap=c;var x={},y={};y[u]=function(){return this};var z=Object.getPrototypeOf,A=z&&z(z(o([])));A&&A!==r&&s.call(A,u)&&(y=A);var B=g.prototype=e.prototype=Object.create(y);return f.prototype=B.constructor=g,g.constructor=f,f.displayName=b(g,w,"GeneratorFunction"),a.isGeneratorFunction=function(a){var b="function"==typeof a&&a.constructor;return!!b&&(b===f||"GeneratorFunction"===(b.displayName||b.name))},a.mark=function(a){return Object.setPrototypeOf?Object.setPrototypeOf(a,g):(a.__proto__=g,b(a,w,"GeneratorFunction")),a.prototype=Object.create(B),a},a.awrap=function(a){return{__await:a}},h(i.prototype),i.prototype[v]=function(){return this},a.AsyncIterator=i,a.async=function(b,d,e,f,g){void 0===g&&(g=Promise);var h=new i(c(b,d,e,f),g);return a.isGeneratorFunction(d)?h:h.next().then(function(a){return a.done?a.value:h.next()})},h(B),b(B,w,"Generator"),B[u]=function(){return this},B.toString=function(){return"[object Generator]"},a.keys=function(a){var b=[];for(var c in a)b.push(c);return b.reverse(),function c(){for(;b.length;){var d=b.pop();if(d in a)return c.value=d,c.done=!1,c}return c.done=!0,c}},a.values=o,n.prototype={constructor:n,reset:function(a){if(this.prev=0,this.next=0,this.sent=this._sent=q,this.done=!1,this.delegate=null,this.method="next",this.arg=q,this.tryEntries.forEach(m),!a)for(var b in this)"t"===b.charAt(0)&&s.call(this,b)&&!isNaN(+b.slice(1))&&(this[b]=q)},stop:function(){this.done=!0;var a=this.tryEntries[0],b=a.completion;if("throw"===b.type)throw b.arg;return this.rval},dispatchException:function(a){function b(b,d){return f.type="throw",f.arg=a,c.next=b,d&&(c.method="next",c.arg=q),!!d}if(this.done)throw a;for(var c=this,d=this.tryEntries.length-1;0<=d;--d){var e=this.tryEntries[d],f=e.completion;if("root"===e.tryLoc)return b("end");if(e.tryLoc<=this.prev){var g=s.call(e,"catchLoc"),h=s.call(e,"finallyLoc");if(g&&h){if(this.prev<e.catchLoc)return b(e.catchLoc,!0);if(this.prev<e.finallyLoc)return b(e.finallyLoc)}else if(g){if(this.prev<e.catchLoc)return b(e.catchLoc,!0);}else if(!h)throw new Error("try statement without catch or finally");else if(this.prev<e.finallyLoc)return b(e.finallyLoc)}}},abrupt:function(a,b){for(var c,d=this.tryEntries.length-1;0<=d;--d)if(c=this.tryEntries[d],c.tryLoc<=this.prev&&s.call(c,"finallyLoc")&&this.prev<c.finallyLoc){var e=c;break}e&&("break"===a||"continue"===a)&&e.tryLoc<=b&&b<=e.finallyLoc&&(e=null);var f=e?e.completion:{};return f.type=a,f.arg=b,e?(this.method="next",this.next=e.finallyLoc,x):this.complete(f)},complete:function(a,b){if("throw"===a.type)throw a.arg;return"break"===a.type||"continue"===a.type?this.next=a.arg:"return"===a.type?(this.rval=this.arg=a.arg,this.method="return",this.next="end"):"normal"===a.type&&b&&(this.next=b),x},finish:function(a){for(var b,c=this.tryEntries.length-1;0<=c;--c)if(b=this.tryEntries[c],b.finallyLoc===a)return this.complete(b.completion,b.afterLoc),m(b),x},catch:function(a){for(var b,c=this.tryEntries.length-1;0<=c;--c)if(b=this.tryEntries[c],b.tryLoc===a){var d=b.completion;if("throw"===d.type){var e=d.arg;m(b)}return e}throw new Error("illegal catch attempt")},delegateYield:function(a,b,c){return this.delegate={iterator:o(a),resultName:b,nextLoc:c},"next"===this.method&&(this.arg=q),x}},a}(a.exports);try{regeneratorRuntime=b}catch(a){Function("r","regeneratorRuntime = r")(b)}});
		
		var regenerator = runtime_1;
		function asyncGeneratorStep(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(a){return void c(a)}h.done?b(i):Promise.resolve(i).then(d,e)}function _asyncToGenerator(a){return function(){var b=this,c=arguments;return new Promise(function(d,e){function f(a){asyncGeneratorStep(h,d,e,f,g,"next",a)}function g(a){asyncGeneratorStep(h,d,e,f,g,"throw",a)}var h=a.apply(b,c);f(void 0)})}}var asyncToGenerator=_asyncToGenerator;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var classCallCheck=_classCallCheck;function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var createClass=_createClass;const t=new WeakMap;function e(a,b){return new Proxy(a,{get:(a,c)=>b(a[c])})}
		class r{constructor(){this.value=void 0,this.exports=null}getState(){return this.exports.asyncify_get_state()}assertNoneState(){let a=this.getState();if(0!==a)throw new Error(`Invalid async state ${a}, expected 0.`)}wrapImportFn(a){return(...b)=>{if(2===this.getState())return this.exports.asyncify_stop_rewind(),this.value;this.assertNoneState();let c=a(...b);if(!(d=c)||"object"!=typeof d&&"function"!=typeof d||"function"!=typeof d.then)return c;var d;this.exports.asyncify_start_unwind(16),this.value=c}}wrapModuleImports(a){return e(a,a=>"function"==typeof a?this.wrapImportFn(a):a)}wrapImports(a){if(void 0!==a)return e(a,(a=Object.create(null))=>this.wrapModuleImports(a))}wrapExportFn(a){let b=t.get(a);return void 0!==b||(b=async(...b)=>{this.assertNoneState();let c=a(...b);for(;1===this.getState();)this.exports.asyncify_stop_unwind(),this.value=await this.value,this.assertNoneState(),this.exports.asyncify_start_rewind(16),c=a();return this.assertNoneState(),c},t.set(a,b)),b}wrapExports(a){let b=Object.create(null);for(let c in a){let d=a[c];"function"!=typeof d||c.startsWith("asyncify_")||(d=this.wrapExportFn(d)),Object.defineProperty(b,c,{enumerable:!0,value:d})}return t.set(a,b),b}init(a,b){const{exports:c}=a,d=c.memory||b.env&&b.env.memory;new Int32Array(d.buffer,16).set([24,1024]),this.exports=this.wrapExports(c),Object.setPrototypeOf(a,s.prototype)}}
		class s extends WebAssembly.Instance{constructor(a,b){let c=new r;super(a,c.wrapImports(b)),c.init(this,b)}get exports(){return t.get(super.exports)}}async function n(a,b){let c=new r,d=await WebAssembly.instantiate(a,c.wrapImports(b));return c.init(d instanceof WebAssembly.Instance?d:d.instance,b),d}Object.defineProperty(s.prototype,"exports",{enumerable:!0});
		const E_CANCELED = new Error('request for lock canceled');
		var __awaiter$2=function(a,b,c,d){function e(a){return a instanceof c?a:new c(function(b){b(a)})}return new(c||(c=Promise))(function(c,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?c(a.value):e(a.value).then(g,h)}i((d=d.apply(a,b||[])).next())})};
		class Semaphore{constructor(a,b=E_CANCELED){if(this._maxConcurrency=a,this._cancelError=b,this._queue=[],this._waiters=[],0>=a)throw new Error("semaphore must be initialized to a positive value");this._value=a}acquire(){const a=this.isLocked(),b=new Promise((a,b)=>this._queue.push({resolve:a,reject:b}));return a||this._dispatch(),b}runExclusive(a){return __awaiter$2(this,void 0,void 0,function*(){const[b,c]=yield this.acquire();try{return yield a(b)}finally{c()}})}waitForUnlock(){return __awaiter$2(this,void 0,void 0,function*(){if(!this.isLocked())return Promise.resolve();const a=new Promise(a=>this._waiters.push({resolve:a}));return a})}isLocked(){return 0>=this._value}release(){if(1<this._maxConcurrency)throw new Error("this method is unavailable on semaphores with concurrency > 1; use the scoped release returned by acquire instead");if(this._currentReleaser){const a=this._currentReleaser;this._currentReleaser=void 0,a()}}cancel(){this._queue.forEach(a=>a.reject(this._cancelError)),this._queue=[]}_dispatch(){const a=this._queue.shift();if(!a)return;let b=!1;this._currentReleaser=()=>{b||(b=!0,this._value++,this._resolveWaiters(),this._dispatch())},a.resolve([this._value--,this._currentReleaser])}_resolveWaiters(){this._waiters.forEach(a=>a.resolve()),this._waiters=[]}}
		var __awaiter$1=function(a,b,c,d){function e(a){return a instanceof c?a:new c(function(b){b(a)})}return new(c||(c=Promise))(function(c,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?c(a.value):e(a.value).then(g,h)}i((d=d.apply(a,b||[])).next())})};class Mutex{constructor(a){this._semaphore=new Semaphore(1,a)}acquire(){return __awaiter$1(this,void 0,void 0,function*(){const[,a]=yield this._semaphore.acquire();return a})}runExclusive(a){return this._semaphore.runExclusive(()=>a())}isLocked(){return this._semaphore.isLocked()}waitForUnlock(){return this._semaphore.waitForUnlock()}release(){this._semaphore.release()}cancel(){return this._semaphore.cancel()}}

		var wasiSnapshotPreview1Emulator={args_get:function(){return 0},args_sizes_get:function(){return 0},environ_get:function(){return 0},environ_sizes_get:function(){return 0},clock_res_get:function(){return 0},clock_time_get:function(){return 0},fd_advise:function(){return 0},fd_allocate:function(){return 0},fd_close:function(){return 0},fd_datasync:function(){return 0},fd_fdstat_get:function(){return 0},fd_fdstat_set_flags:function(){return 0},fd_fdstat_set_rights:function(){return 0},fd_filestat_get:function(){return 0},fd_filestat_set_size:function(){return 0},fd_filestat_set_times:function(){return 0},fd_pread:function(){return 0},fd_prestat_get:function(){return 0},fd_prestat_dir_name:function(){return 0},fd_pwrite:function(){return 0},fd_read:function(){return 0},fd_readdir:function(){return 0},fd_renumber:function(){return 0},fd_seek:function(){return 0},fd_sync:function(){return 0},fd_tell:function(){return 0},fd_write:function(){return 0},path_create_directory:function(){return 0},path_filestat_get:function(){return 0},path_filestat_set_times:function(){return 0},path_link:function(){return 0},path_open:function(){return 0},path_readlink:function(){return 0},path_remove_directory:function(){return 0},path_rename:function(){return 0},path_symlink:function(){return 0},path_unlink_file:function(){return 0},poll_oneoff:function(){return 0},proc_exit:function(){return 0},proc_raise:function(){return 0},sched_yield:function(){return 0},random_get:function(){return 0},sock_recv:function(){return 0},sock_send:function(){return 0},sock_shutdown:function(){return 0}};

		var BuiltInKeyword;
		(function(BuiltInKeyword) {
			//BuiltInKeyword["Computer"] = "Computer";
		})(BuiltInKeyword || (BuiltInKeyword = {}));
		var BUILT_IN_KEYWORD_BYTES = new Map();
		//BUILT_IN_KEYWORD_BYTES.set(BuiltInKeyword.Computer, COMPUTER_64);

		function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var defineProperty=_defineProperty;function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function(){c=a[Symbol.iterator]()},n:function(){var a=c.next();return g=a.done,a},e:function(a){h=!0,f=a},f:function(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}

		//Indexed DB configurations
		var DB_NAME = 'pv_db';
		var STORE_NAME = 'pv_store';
		var V = 1;
		function getDB(){return new Promise(function(a,b){var c=self.indexedDB.open(DB_NAME,V);c.onerror=function(){b(c.error)},c.onsuccess=function(){a(c.result)},c.onupgradeneeded=function(){c.result.createObjectStore(STORE_NAME)}})}
		function getPvStorage(){if(self.indexedDB){var a=function(a){return new Promise(function(b,c){a.onerror=function(){c(a.error)},a.onsuccess=function(){b(a.result)}})};return{setItem:function(){var b=asyncToGenerator(regenerator.mark(function b(c,d){var e,f;return regenerator.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,getDB();case 2:return e=b.sent,f=e.transaction(STORE_NAME,"readwrite").objectStore(STORE_NAME).put(d,c),b.next=6,a(f);case 6:e.close();case 7:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}(),getItem:function(){var b=asyncToGenerator(regenerator.mark(function b(c){var d,e,f;return regenerator.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,getDB();case 2:return d=b.sent,e=d.transaction(STORE_NAME,"readonly").objectStore(STORE_NAME).get(c),b.next=6,a(e);case 6:return f=b.sent,d.close(),b.abrupt("return",f);case 9:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}(),removeItem:function(){var b=asyncToGenerator(regenerator.mark(function b(c){var d,e;return regenerator.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,getDB();case 2:return d=b.sent,e=d.transaction(STORE_NAME,"readwrite").objectStore(STORE_NAME)["delete"](c),b.next=6,a(e);case 6:d.close();case 7:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}()}}if(self.localStorage)return self.localStorage;throw new Error("Cannot get a presistent storage object.")}
		
		function arrayBufferToStringAtIndex(a,b){for(var c=b;0!==a[c];)c++;var d=new TextDecoder("utf-8");return d.decode(a.subarray(b,c))}function base64ToUint8Array(a){for(var b=atob(a),c=new Uint8Array(b.length),d=0;d<b.length;d++)c[d]=b.charCodeAt(d);return c}function arrayBufferToBase64AtIndex(a,b,c){for(var d="",e=0;e<b;e++)d+=String.fromCharCode(a[c+e]);return btoa(d)}function stringHeaderToObject(a){var b,c={},d=_createForOfIteratorHelper(a.split("\r\n"));try{for(d.s();!(b=d.n()).done;){var e=b.value,f=e.split(": ");""!==f[0]&&(c[f[0]]=f[1])}}catch(a){d.e(a)}finally{d.f()}return c}function fetchWithTimeout(){return _fetchWithTimeout.apply(this,arguments)}function _fetchWithTimeout(){return _fetchWithTimeout=asyncToGenerator(regenerator.mark(function a(b){var c,d,e,f,g,h,i=arguments;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return c=1<i.length&&void 0!==i[1]?i[1]:{},d=2<i.length&&void 0!==i[2]?i[2]:5e3,e=new AbortController,f=_objectSpread(_objectSpread({},c),{},{signal:e.signal}),g=setTimeout(function(){e.abort()},d),a.next=7,fetch(b,f);case 7:return h=a.sent,clearTimeout(g),a.abrupt("return",h);case 10:case"end":return a.stop();}},a)})),_fetchWithTimeout.apply(this,arguments)}function isAccessKeyValid(a){if("string"!=typeof a||a===void 0||null===a)return!1;var b=a.trim();if(""===b)return!1;try{return btoa(atob(b))===b}catch(a){return!1}}function _createForOfIteratorHelper$1(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray$1(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function(){c=a[Symbol.iterator]()},n:function(){var a=c.next();return g=a.done,a},e:function(a){h=!0,f=a},f:function(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray$1(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray$1(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray$1(a,b):void 0}}function _arrayLikeToArray$1(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}
		
		var DEFAULT_SENSITIVITY = 0.5;
		var PV_STATUS_SUCCESS = 10000;
		var Porcupine=function(){function a(b,c){classCallCheck(this,a),a._frameLength=b.frameLength,a._sampleRate=b.sampleRate,a._version=b.version,this._pvPorcupineDelete=b.pvPorcupineDelete,this._pvPorcupineProcess=b.pvPorcupineProcess,this._pvStatusToString=b.pvStatusToString,this._wasmMemory=b.memory,this._objectAddress=b.objectAddress,this._inputBufferAddress=b.inputBufferAddress,this._keywordIndexAddress=b.keywordIndexAddress,this._memoryBuffer=new Int16Array(b.memory.buffer),this._memoryBufferView=new DataView(b.memory.buffer),this._keywordLabels=new Map;for(var d=0;d<c.length;d++)this._keywordLabels.set(d,c[d]);this._processMutex=new Mutex}return createClass(a,[{key:"release",value:function(){var a=asyncToGenerator(regenerator.mark(function a(){return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,this._pvPorcupineDelete(this._objectAddress);case 2:case"end":return a.stop();}},a,this)}));return function(){return a.apply(this,arguments)}}()},{key:"process",value:function(){var a=asyncToGenerator(regenerator.mark(function a(b){var c,d=this;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(b instanceof Int16Array){a.next=2;break}throw new Error("The argument 'pcm' must be provided as an Int16Array");case 2:return c=new Promise(function(a,c){d._processMutex.runExclusive(asyncToGenerator(regenerator.mark(function a(){var c,e;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return d._memoryBuffer.set(b,d._inputBufferAddress/Int16Array.BYTES_PER_ELEMENT),a.next=3,d._pvPorcupineProcess(d._objectAddress,d._inputBufferAddress,d._keywordIndexAddress);case 3:if(c=a.sent,c===PV_STATUS_SUCCESS){a.next=16;break}return e=new Uint8Array(d._wasmMemory.buffer),a.t0=Error,a.t1="process failed with status ",a.t2=arrayBufferToStringAtIndex,a.t3=e,a.next=12,d._pvStatusToString(c);case 12:throw a.t4=a.sent,a.t5=(0,a.t2)(a.t3,a.t4),a.t6=a.t1.concat.call(a.t1,a.t5),new a.t0(a.t6);case 16:return a.abrupt("return",d._memoryBufferView.getInt32(d._keywordIndexAddress,!0));case 17:case"end":return a.stop();}},a)}))).then(function(b){a(b)})["catch"](function(a){c(a)})}),a.abrupt("return",c);case 4:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}()},{key:"version",get:function(){return a._version}},{key:"sampleRate",get:function(){return a._sampleRate}},{key:"frameLength",get:function(){return a._frameLength}},{key:"keywordLabels",get:function(){return this._keywordLabels}}],[{key:"create",value:function(){var b=asyncToGenerator(regenerator.mark(function b(c,d){var e;return regenerator.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(isAccessKeyValid(c)){b.next=2;break}throw new Error("Invalid AccessKey");case 2:if(void 0!==d&&null!==d){b.next=4;break}throw new Error("The keywords argument is undefined / empty; What would you like Porcupine to listen for?");case 4:return e=new Promise(function(b,e){a._porcupineMutex.runExclusive(asyncToGenerator(regenerator.mark(function b(){var e,f,g,h,i,j,k,l,m,o,p,q,r,s,t,u,v,w;return regenerator.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(Array.isArray(d)){b.next=4;break}d=[d],b.next=6;break;case 4:if(0!==d.length){b.next=6;break}throw new Error("The keywords argument array is empty; What would you like Porcupine to listen for?");case 6:e=[],f=[],g=[],h=_createForOfIteratorHelper$1(d),b.prev=10,h.s();case 12:if((i=h.n()).done){b.next=44;break}if(k=i.value,l=k,m=void 0,"string"!=typeof l){b.next=20;break}m={builtin:l,sensitivity:DEFAULT_SENSITIVITY},b.next=25;break;case 20:if("object"===_typeof_1(l)){b.next=24;break}throw new Error("Invalid keyword argument type: "+l+" : "+_typeof_1(l));case 24:m=l;case 25:if(!("custom"in m)){b.next=30;break}f.push(Uint8Array.from(atob(m.base64),function(a){return a.charCodeAt(0)})),g.push(m.custom),b.next=41;break;case 30:if(!("builtin"in m)){b.next=40;break}if(o=Object.values(BuiltInKeyword),p=m.builtin,q=BuiltInKeyword[p.replace(" ","")],o.includes(q)){b.next=36;break}throw new Error("Keyword ".concat(p," does not map to list of built-in keywords (").concat(o,")"));case 36:f.push(Uint8Array.from(atob(BUILT_IN_KEYWORD_BYTES.get(q)),function(a){return a.charCodeAt(0)})),g.push(m.builtin),b.next=41;break;case 40:throw new Error("Unknown keyword argument: "+JSON.stringify(l));case 41:e.push(null!==(j=m.sensitivity)&&void 0!==j?j:DEFAULT_SENSITIVITY);case 42:b.next=12;break;case 44:b.next=49;break;case 46:b.prev=46,b.t0=b["catch"](10),h.e(b.t0);case 49:return b.prev=49,h.f(),b.finish(49);case 52:r=0,s=e;case 53:if(!(r<s.length)){b.next=62;break}if(t=s[r],"number"==typeof t){b.next=57;break}throw new Error("Sensitivity is not a number (in range [0,1]): "+t);case 57:if(!(0>t||1<t)){b.next=59;break}throw new Error("Sensitivity is outside of range [0, 1]: "+t);case 59:r++,b.next=53;break;case 62:if(e.length===f.length){b.next=64;break}throw new Error("keywordSensitivities (".concat(e.length,") and keywordModels (").concat(f.length,") length differs"));case 64:return u=new Float32Array(e),v=Int32Array.from(f.map(function(a){return a.byteLength})),b.next=68,a.initWasm(c,f,v,u);case 68:return w=b.sent,b.abrupt("return",new a(w,g));case 70:case"end":return b.stop();}},b,null,[[10,46,49,52]])}))).then(function(a){b(a)})["catch"](function(a){e(a)})}),b.abrupt("return",e);case 6:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}()},{key:"initWasm",value:function(){var a=asyncToGenerator(regenerator.mark(function a(b,c,d,e){var f,g,h,j,k,l,m,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return f=new WebAssembly.Memory({initial:1e3,maximum:2e3}),g=new Uint8Array(f.buffer),h=new Int32Array(f.buffer),j=new Float32Array(f.buffer),k=getPvStorage(),l=function(a){console.log(arrayBufferToStringAtIndex(g,a))},m=function(a,b,c){if(0===a){var d=arrayBufferToStringAtIndex(g,c);throw new Error("assertion failed at line ".concat(b," in \"").concat(d,"\""))}},o=function(){return Date.now()/1e3},p=function(){var a=asyncToGenerator(regenerator.mark(function a(b,c,d,e,f,j,k,l,m){var o,p,q,r,s,t,u,v,w,x,y;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return o=arrayBufferToStringAtIndex(g,b),p=arrayBufferToStringAtIndex(g,c),q=arrayBufferToStringAtIndex(g,d),r=arrayBufferToStringAtIndex(g,e),s=arrayBufferToStringAtIndex(g,f),t=stringHeaderToObject(r),a.prev=6,a.next=9,fetchWithTimeout("https://"+p+q,{method:o,headers:t,body:s},j);case 9:u=a.sent,w=u.status,a.next=16;break;case 13:a.prev=13,a.t0=a["catch"](6),w=0;case 16:if(void 0===u){a.next=36;break}return a.prev=17,a.next=20,u.text();case 20:v=a.sent,a.next=27;break;case 23:a.prev=23,a.t1=a["catch"](17),v="",w=1;case 27:return a.next=29,A(Int8Array.BYTES_PER_ELEMENT,(v.length+1)*Int8Array.BYTES_PER_ELEMENT);case 29:if(x=a.sent,0!==x){a.next=32;break}throw new Error("malloc failed: Cannot allocate memory");case 32:for(h[l/Int32Array.BYTES_PER_ELEMENT]=v.length+1,h[k/Int32Array.BYTES_PER_ELEMENT]=x,y=0;y<v.length;y++)g[x+y]=v.charCodeAt(y);g[x+v.length]=0;case 36:h[m/Int32Array.BYTES_PER_ELEMENT]=w;case 37:case"end":return a.stop();}},a,null,[[6,13],[17,23]])}));return function(){return a.apply(this,arguments)}}(),q=function(){var a=asyncToGenerator(regenerator.mark(function a(b,c,d,e){var f,i,j,l;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return f=arrayBufferToStringAtIndex(g,b),a.prev=1,a.next=4,k.getItem(f);case 4:return i=a.sent,j=base64ToUint8Array(i),a.next=8,A(Uint8Array.BYTES_PER_ELEMENT,j.length*Uint8Array.BYTES_PER_ELEMENT);case 8:if(l=a.sent,0!==l){a.next=11;break}throw new Error("malloc failed: Cannot allocate memory");case 11:h[c/Int32Array.BYTES_PER_ELEMENT]=j.byteLength,h[d/Int32Array.BYTES_PER_ELEMENT]=l,g.set(j,l),h[e/Int32Array.BYTES_PER_ELEMENT]=1,a.next=20;break;case 17:a.prev=17,a.t0=a["catch"](1),h[e/Int32Array.BYTES_PER_ELEMENT]=0;case 20:case"end":return a.stop();}},a,null,[[1,17]])}));return function(){return a.apply(this,arguments)}}(),r=function(){var a=asyncToGenerator(regenerator.mark(function a(b,c,d,e){var f,i;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return f=arrayBufferToStringAtIndex(g,b),i=arrayBufferToBase64AtIndex(g,c,d),a.prev=2,a.next=5,k.setItem(f,i);case 5:h[e/Int32Array.BYTES_PER_ELEMENT]=1,a.next=11;break;case 8:a.prev=8,a.t0=a["catch"](2),h[e/Int32Array.BYTES_PER_ELEMENT]=0;case 11:case"end":return a.stop();}},a,null,[[2,8]])}));return function(){return a.apply(this,arguments)}}(),s=function(){var a=asyncToGenerator(regenerator.mark(function a(b,c,d){var e,f;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return e=arrayBufferToStringAtIndex(g,b),a.prev=1,a.next=4,k.getItem(e);case 4:f=a.sent,g[c]=void 0===f||null===f?0:1,h[d/Int32Array.BYTES_PER_ELEMENT]=1,a.next=12;break;case 9:a.prev=9,a.t0=a["catch"](1),h[d/Int32Array.BYTES_PER_ELEMENT]=0;case 12:case"end":return a.stop();}},a,null,[[1,9]])}));return function(){return a.apply(this,arguments)}}(),t=function(){var a=asyncToGenerator(regenerator.mark(function a(b,c){var d;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return d=arrayBufferToStringAtIndex(g,b),a.prev=1,a.next=4,k.removeItem(d);case 4:h[c/Int32Array.BYTES_PER_ELEMENT]=1,a.next=10;break;case 7:a.prev=7,a.t0=a["catch"](1),h[c/Int32Array.BYTES_PER_ELEMENT]=0;case 10:case"end":return a.stop();}},a,null,[[1,7]])}));return function(){return a.apply(this,arguments)}}(),u=function(){var a=asyncToGenerator(regenerator.mark(function a(b){var c,d,e;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return c=void 0===navigator.userAgent?"unknown":navigator.userAgent,a.next=3,A(Uint8Array.BYTES_PER_ELEMENT,(c.length+1)*Uint8Array.BYTES_PER_ELEMENT);case 3:if(d=a.sent,0!==d){a.next=6;break}throw new Error("malloc failed: Cannot allocate memory");case 6:for(h[b/Int32Array.BYTES_PER_ELEMENT]=d,e=0;e<c.length;e++)g[d+e]=c.charCodeAt(e);g[d+c.length]=0;case 9:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),v=function(){var a=asyncToGenerator(regenerator.mark(function a(b){var c,d,e,f;return regenerator.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return d=null!==(c=self.origin)&&void 0!==c?c:self.location.origin,a.next=3,A(Uint8Array.BYTES_PER_ELEMENT,(d.length+1)*Uint8Array.BYTES_PER_ELEMENT);case 3:if(e=a.sent,0!==e){a.next=6;break}throw new Error("malloc failed: Cannot allocate memory");case 6:for(h[b/Int32Array.BYTES_PER_ELEMENT]=e,f=0;f<d.length;f++)g[e+f]=d.charCodeAt(f);g[e+d.length]=0;case 9:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),w={wasi_snapshot_preview1:wasiSnapshotPreview1Emulator,env:{memory:f,pv_console_log_wasm:l,pv_assert_wasm:m,pv_time_wasm:o,pv_https_request_wasm:p,pv_file_load_wasm:q,pv_file_save_wasm:r,pv_file_exists_wasm:s,pv_file_delete_wasm:t,pv_get_browser_info:u,pv_get_origin_info:v}},x=PORCUPINE_WASM_ARRAY?new Uint8Array(PORCUPINE_WASM_ARRAY):base64ToUint8Array(PORCUPINE_WASM_BASE64),a.next=19,n(x,w);case 19:return y=a.sent,z=y.instance,A=z.exports.aligned_alloc,B=z.exports.pv_porcupine_version,C=z.exports.pv_porcupine_frame_length,D=z.exports.pv_porcupine_process,E=z.exports.pv_porcupine_delete,F=z.exports.pv_porcupine_init,G=z.exports.pv_status_to_string,H=z.exports.pv_sample_rate,a.next=31,A(Int32Array.BYTES_PER_ELEMENT,Int32Array.BYTES_PER_ELEMENT);case 31:if(I=a.sent,0!==I){a.next=34;break}throw new Error("malloc failed: Cannot allocate memory");case 34:return a.next=36,A(Int32Array.BYTES_PER_ELEMENT,Int32Array.BYTES_PER_ELEMENT);case 36:if(J=a.sent,0!==J){a.next=39;break}throw new Error("malloc failed: Cannot allocate memory");case 39:return a.next=41,A(Uint8Array.BYTES_PER_ELEMENT,(b.length+1)*Uint8Array.BYTES_PER_ELEMENT);case 41:if(K=a.sent,0!==K){a.next=44;break}throw new Error("malloc failed: Cannot allocate memory");case 44:for(L=0;L<b.length;L++)g[K+L]=b.charCodeAt(L);return g[K+b.length]=0,a.next=48,A(Int32Array.BYTES_PER_ELEMENT,c.length*Int32Array.BYTES_PER_ELEMENT);case 48:if(M=a.sent,0!==M){a.next=51;break}throw new Error("malloc failed: Cannot allocate memory");case 51:h.set(d,M/Int32Array.BYTES_PER_ELEMENT),N=[],O=0;case 54:if(!(O<c.length)){a.next=66;break}return a.t0=N,a.next=58,A(Int8Array.BYTES_PER_ELEMENT,d[O]*Int8Array.BYTES_PER_ELEMENT);case 58:if(a.t1=a.sent,a.t0.push.call(a.t0,a.t1),0!==N[O]){a.next=62;break}throw new Error("malloc failed: Cannot allocate memory");case 62:g.set(c[O],N[O]);case 63:O++,a.next=54;break;case 66:return a.next=68,A(Int32Array.BYTES_PER_ELEMENT,c.length*Int32Array.BYTES_PER_ELEMENT);case 68:if(P=a.sent,0!==P){a.next=71;break}throw new Error("malloc failed: Cannot allocate memory");case 71:return h.set(N,P/Int32Array.BYTES_PER_ELEMENT),a.next=74,A(Float32Array.BYTES_PER_ELEMENT,c.length*Float32Array.BYTES_PER_ELEMENT);case 74:if(Q=a.sent,0!==Q){a.next=77;break}throw new Error("malloc failed: Cannot allocate memory");case 77:return j.set(e,Q/Float32Array.BYTES_PER_ELEMENT),a.next=80,F(K,c.length,M,P,Q,J);case 80:if(R=a.sent,R===PV_STATUS_SUCCESS){a.next=92;break}return a.t2=Error,a.t3="'pv_porcupine_init' failed with status ",a.t4=arrayBufferToStringAtIndex,a.t5=g,a.next=88,G(R);case 88:throw a.t6=a.sent,a.t7=(0,a.t4)(a.t5,a.t6),a.t8=a.t3.concat.call(a.t3,a.t7),new a.t2(a.t8);case 92:return S=new DataView(f.buffer),T=S.getInt32(J,!0),a.next=96,H();case 96:return U=a.sent,a.next=99,C();case 99:return V=a.sent,a.next=102,B();case 102:return W=a.sent,X=arrayBufferToStringAtIndex(g,W),a.next=106,A(Int16Array.BYTES_PER_ELEMENT,V*Int16Array.BYTES_PER_ELEMENT);case 106:if(Y=a.sent,0!==Y){a.next=109;break}throw new Error("malloc failed: Cannot allocate memory");case 109:return a.abrupt("return",{frameLength:V,inputBufferAddress:Y,memory:f,objectAddress:T,pvPorcupineDelete:E,pvPorcupineProcess:D,pvStatusToString:G,keywordIndexAddress:I,sampleRate:U,version:X});case 110:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}()}]),a}();
		Porcupine._porcupineMutex = new Mutex();

		exports.Porcupine = Porcupine;
		Object.defineProperty(exports, '__esModule', {
			value: true
		});
		return exports;
	}({}));
	
	finalize(PorcupineWebFactory.Porcupine);
};
