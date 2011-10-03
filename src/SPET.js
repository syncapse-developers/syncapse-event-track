/**
 * Syncapse Platform Event Track 1.1
 * 
 * @see https://github.com/syncapse-developers/syncapse-event-track 
 * @copyright Syncapse
 * @license For use by clients of Syncapse and their agencies. Sorry, this code is not Free/Open Source :(
 */

/**
   Instantiate the Event Tracker
   @class Represents the Syncapse Platform Event Tracker
   @param {String} [source] The URL of the App/Tab that is being tracked
   @param {String} [session] The current session
   @param {Object} [params] any parameters to be passed to the "page-view" event (also can include debug: true)
   @returns {SPET} The instance created
 */
function SPET(source, session, params) 
{
	// Set the source variable - a 'source' is the referrer for this tracking event
	if (!source) {
		source = document.location.href;
	};
	
	// Add a session if one doesn't exist - a 'session' is a generic way of grouping events for further use
	if (!session) {
		session = this.generateSession();
	};
	
	// If no params are set, use some defaults
	if (!params) {
		params = this.getDefaultParams();
	};
	
	// Set the client name
	params.client = 'SPET JavaScript/1.1';
	
	// Add a default tracking domain
	this.trackDomain = 'track.platform.syncapse.com';
	
	// If params have a trackDomain, use that instead of our default
	if (params.trackDomain) {
		this.trackDomain = params.trackDomain;
	};
	
	// Store source and session for later
	this.source = source;
	this.session = session;
	
	// Set the debug flag
	this.debug = (params.debug !== false);
	delete params.debug;
	
	// See if we are in FBML
	this.inFbml = (params.hasOwnProperty('inFbml') && params.inFbml) || (typeof(Image) == 'undefined');
	
	// If in FBML, we probably want to know the image bug element's DOM ID
	this.imageId = params.imageId || 'spet_image';
	
	// Allow overriding the trackPath along with the trackDomain
	this.trackPath = params.trackPath = params.trackPath || '/track.gif'; 
	
	// Store params for re-use later.
	this.baseParams = params;
	
	// If we're not in FBML, we can trigger JavaScript without any user interaction
	if (!this.inFbml && !params.skipOnLoadEvent) {
		this.track('page-view', params);
	};
};

/**
 * Get the default params
 * @returns {Object} 
 */
SPET.prototype.getDefaultParams = function() {
	return {
		// If debug is true, we'll output event to the browser console
		debug: true,
		
		// Sometimes we may want to skip the on load 'page-view' event
		skipOnLoadEvent: false,
		
		// Allow explicit control over if we are in FBML
		inFbml: false
	};
};

/**
   Gets the session associated with this instance
   @returns {String} the session
 */
SPET.prototype.getSession = function() {
	return this.session;
};

/**
   Generates a new session (based on the time and a random number)
   Note: has no side-effect (aka the session is not stored in the object)
   @returns {String} the generated session
 */
SPET.prototype.generateSession = function() {
	var time = (new Date()).getTime();
	var random = Math.floor(Math.random() * 10000000);
	
	return time + '-' + random;
};

/**
   Get the URL used to track events
   @returns {String} the URL
 */
SPET.prototype.getUrl = function() {
	var protocol = 'http';
	try {
		if (document.location.protocol === 'https:') {
			protocol = 'https';
		}
	} catch (ex) { /* noop */ }
	
	return protocol + "://" + this.trackDomain + this.trackPath;
};

/**
   Builds a query string from a non-nested object
   @param {Object} obj the object the querystring will be built from
   @returns {String} the querystring
 */
SPET.prototype.buildQueryString = function(obj) {
	if (this.inFbml) {
		return this.buildFbmlQueryString(obj);
	}
	var rv = '?';
	var key;
	for(key in obj) {
		if (typeof(obj[key]) !== 'function') {
			if (rv.length > 1) {
				rv += '&';
			}
			rv += encodeURIComponent(key) + '=' + encodeURIComponent("" + obj[key]);
		}
	}
	return rv.replace(/%20/g, '+');
};

/**
   Builds a query string from a non-nested object. Legacy FBML/FBJS-compatible.  
   @param {Object} obj the object the querystring will be built from
   @returns {String} the querystring
 */
SPET.prototype.buildFbmlQueryString = function(obj) {
	var pairs = [];
	for (var k in obj) {
		if (typeof(obj[k]) == 'function') {
			continue;
		}
		// Stringify
		var value = obj[k] + "";
		// Deal with common values that should really be null or blank
		if (value == "null") value = "";
		if (value == "undefined") value = "";
		// Add our key value pair
		pairs.push(escape(k) + '=' + escape(obj[k]));
	}
	return '?' + pairs.join('&');
};

/**
   Log an event (for debugging)
   @param {String} event the event we are logging
   @param {Object} [params] the parameters
 */
SPET.prototype.log = function(event, params) {
	if (!params) {
		params = {};
	}
	if (console.log) {
		console.log(event, params);
	}
};

/**
   Track an event
   @param {String} event the event to track
   @param {Object} [params] the parameters
 */
SPET.prototype.track = function(event, params) {
	try {
		if (!params) {
			params = { };
		}
		params.se = this.session;
		params.so = this.source;
		params.ev = event;
		params.r = Math.floor(Math.random() * 10000000);
		
		/**
		 * Merge with base params
		 *   * Pros: Persistent params are useful
		 *   * Cons: We'll send more data to the server (or is that a pro?)
		 */
		params = this.extend({}, this.baseParams, params);
		
		// Build a full image source URL for tracking 
		var trackUrl = this.getUrl() + this.buildQueryString(params);
		
		if (!this.debug) {
			// Set the image source
			this.setImageSource(trackUrl);
		} else {
			// Add the full trackUrl to help debugging
			params.trackUrl = trackUrl;
			this.log(event, params);
		}
	} catch (ex) {
		this.log("error-lib", {error: "" + ex});
	}
	
	return true;
};

/**
   Set an image's src attribute. Legacy FBML/FBJS-compatible.
   @param {String} url Full image source URL
 */
SPET.prototype.setImageSource = function(url) {

	// Deal with the non-legacy-FBML/FBJS case first and get outta here
	if (!this.inFbml) {
		try {
			var image = new Image();
			image.src = url;
		} catch (ex) {
			this.log("error-lib", {error: "" + ex});
		}
		return;
	}

	// We're in Legacy FBML/FBJS and can't call 'new Image()'. Instead, look for an existing image in the DOM.
	var img = document.getElementById(this.imageId);
	if (!img) {
		var ex = "Cannot find Image element with id '" + this.imageId + "'. You must embed an Image element into your FBML page.";
		this.log("error-lib", {error: "" + ex});
		return;
	}
	
	try {
		// Set the Image source using FBJS
		img.setSrc(url);
	} catch (ex) {
		this.log("error-lib", {error: "" + ex});
	}
};

/**
   Automatically attach listeners to children of an element
   @param elem {DOMElement} the element who's children we're attaching to (typically BODY)
 */
SPET.prototype.attachListeners = function(elem) {
	if (typeof($) == 'undefined') {
		return; // Sorry, this won't work without a nice $ (jQuery)
	};
	var spet = this;
	$(elem).find('a[track!="false"]').mousedown(function() { spet.trackElement(this); });
	$(elem).find('form[track!="false"]').submit(function() { spet.trackElement(this); });
};

/**
   Automatically attach listeners to the Facebook API
   Requires that the Facebook JavaScript SDK is loaded
   See https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/ 
 */
SPET.prototype.attachFBListeners = function() {

	if (typeof(FB) == 'undefined') return; // Sorry, this won't work without the FB namespace
	var spet = this;
	try {
		
		// Track Comment creation
		FB.Event.subscribe("comment.create", function(response) { 
			spet.track("comment-create"); 
		});
		// Track Comment removal
		FB.Event.subscribe("comment.remove", function(response) { 
			spet.track("comment-remove"); 
		});		
		
		// Track Likes
		FB.Event.subscribe("edge.create", function(href) { 
			spet.track("like-create", {
				"target": href
			}); 
		});
		// Track "Unlikes"		
		FB.Event.subscribe("edge.remove", function(href) { 
			spet.track("like-remove", {
				"target": href
			});
		});		
		
		// Track login/logout
		FB.Event.subscribe("auth.authResponseChange", function(response) {
			if (response.status == 'connected') {
				spet.track("facebook-login", {
					"facebook_uid": response.authResponse.userID
				}); 
			} else if (response.status == 'unknown') {
				spet.track("facebook-logout");
			}
		});
	} catch (ex) {
		spet.track("error-facebook", {error: "" + ex});
	}
};

/**
   Handle tracking an A tag click, or a FORM tag submit
   @param {DOMElement} element the element we are tracking
 */
SPET.prototype.trackElement = function(element) {
	if (typeof($) == 'undefined') return; // Sorry, this won't work without a nice $
	var tagName = element.tagName.toLowerCase();
	var event = (tagName === 'form') ? 'form-submit' : 'link-click';
	var jElement = $(element);
	if (jElement.attr('track')) {
		event = jElement.attr('track');
	}
	var params = {'element': tagName };
	if (jElement.attr('href')) {
		params.url = jElement.attr('href');
	}
	if (tagName === 'form') {
		if (jElement.attr('action')) {
			params.url = jElement.attr('action');
		}
		params.data = $(element).serialize();
	}
	this.track(event, params);
};

/**
   Extend an object. Legacy FBML/FBJS compatible.
   @param {Object} obj
   @param {Object} extObj
   @return {Object}
 */
SPET.prototype.extend = function(obj, extObj) {
    if (arguments.length > 2) {
        for (var a = 1; a < arguments.length; a++) {
            this.extend(obj, arguments[a]);
        }
    } else {
        for (var i in extObj) {
            obj[i] = extObj[i];
        }
    }
    return obj;
};

