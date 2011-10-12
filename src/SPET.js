/*** 
 * @fileOverview Syncapse Platform Event Track
 * @author syncapseUK@syncapse.comts.
 * @see https://github.com/syncapse-developers/syncapse-event-track 
 * @copyright Syncapse
 * @license For use by clients of Syncapse and their agencies. Sorry, this code is not Free/Open Source :(
 */

/**
 * Syncapse Platform Event Track 1.1
 * 
 * Event track is a system for tracking events in Facebook Tabs and Applications.  
 * These actions are tracked using a client-side library and recorded within the Syncapse Platform. 
 * Clients with access to the Measure product within the Syncapse Platform can run reports on the tracked events.
 * 
 * 
 * @class Represents the Syncapse Platform Event Tracker
 * @param {String} source The URL of the App/Tab that is being tracked
 * @param {String} [session] The current session
 * @param {Object} [params] any parameters to be passed to the "page-view" event (also can include debug: true)
 * @param {Boolean} [params.debug="true"] If debug is true, no data will be sent to the Syncapse tracking server. Instead, all tracking event data will be output to the browser console using console.log.
 * @param {String} [params.trackDomain="track.platform.syncapse.com"] The tracking domain to which the Event Track class will send event data.
 * @param {String} [params.trackPath="/track.gif"] The path component for the tracking image.
 * @param {String} [params.location="document.location.href"] A 'location' data element to send to the server.
 * @param {String} [params.fromVariableName="from"] Event Track can track where a user has arrived from by using a named GET variable.
 * @param {Boolean} [params.inFbml="false"] If you are using Event Track in an FBML context (which is officially unsupported), you may want to set the parameter to 'true'.
 * @param {String} [params.imageId="spet_image"] If you are using Event Track in an FBML context (officially unsupported), Event Track needs a DOM image element with this ID.
 * @param {Boolean} [params.skipOnLoadEvent="false"] Event Track will fire a 'page-view' event automatically in the constructor. If this is not your desired behaviour, set this parameter to 'true'.
 * 
 * @returns {SPET} An instance of the Syncapse Platform Event Tracker.
 */
function SPET(source, session, params) 
{
	// Set the debug flag
	this.debug = (typeof params.debug !== 'undefined' && params.debug !== false);
	delete params.debug;
	
	// An explicit 'source' variable is required
	if (typeof source === 'undefined' || ! source) {
		throw new Error("You must pass a source URL string to the SPET constructor");
	}
	
	// Add a session if one doesn't exist - a 'session' is a generic way of grouping events for further use
	session = session || this.generateSession();
	
	// Store source and session for later
	this.source = source;
	this.session = session;
	
	// If no params are set, use some defaults
	params = params || this.getDefaultParams();
	
	// Set the client name
	params.client = 'SPET JavaScript/1.1';
	
	// Add a default tracking domain
	// If params have a trackDomain, use that instead of our default
	this.trackDomain = params.trackDomain || 'track.platform.syncapse.com';
	
	// Set the default location
	params.location = params.location || document.location.href;
	
	// Get query string parameters
	params = this.addQueryVars(params, document.location.search ? document.location.search.substring(1) : "");
	
	// Populate a 'from' var - the query string variable name can be specified in the params as 'fromVariableName'
	var fromVariableName = params.fromVariableName || 'from';
	params.from = params["get_" + fromVariableName] || undefined;
	
	// See if we are in FBML
	this.inFbml = ((typeof params.inFbml !== 'undefined') && params.inFbml) || (typeof Image === 'undefined');
	
	// If in FBML, we probably want to know the image bug element's DOM ID
	this.imageId = params.imageId || 'spet_image';
	
	// Allow overriding the trackPath along with the trackDomain
	this.trackPath = params.trackPath = params.trackPath || '/track.gif'; 
	
	// Store params for re-use later.
	this.baseParams = params;
	
	// Skip the automatic page-view event?
	params.skipOnLoadEvent = (typeof params.skipOnLoadEvent !== 'undefined') && params.skipOnLoadEvent;
	
	// If we're not in FBML, we can trigger JavaScript without any user interaction
	if (!this.inFbml && !params.skipOnLoadEvent) {
		this.track('page-view', params);
	};
};

/**
 * Add query vars to params object with a prefix.
 * 
 * @param {Object} parameter Parameter object
 * @param {String} query Query string
 * @param {String} [prefix="get_"] Prefix to prepend to query var names
 * @returns {Object} Modified parameter object
 */
SPET.prototype.addQueryVars = function(params, query, prefix) {
	var q = this.getQueryParams(query);
	prefix = prefix || "get_";
	for (var k in q) {
		if (k == '') continue;
		if (q[k] == '') continue;
		params[prefix + k] = q[k];
	}
	return params;
};

/**
 * Get the default parameter object
 * @returns {Object} Default parameter object
 */
SPET.prototype.getDefaultParams = function() {
	return {
		// Set a default location
		location: document.location.href,
		
		// If debug is true, we'll output event to the browser console
		debug: true,
		
		// Sometimes we may want to skip the on load 'page-view' event
		skipOnLoadEvent: false,
		
		// Allow explicit control over if we are in FBML
		inFbml: false
	};
};

/**
 * Gets the session associated with this instance
 * @returns {String} the session
 */
SPET.prototype.getSession = function() {
	return this.session;
};

/**
 * Generates a new session (based on the time and a random number)
 * Note: has no side-effect (aka the session is not stored in the object)
 * @returns {String} the generated session string
 */
SPET.prototype.generateSession = function() {
	var time = (new Date()).getTime();
	var random = Math.floor(Math.random() * 10000000);	
	return time + '-' + random;
};

/**
 * Get the URL used to track events. Uses the 'trackDomain' and 'trackPath' parameters, 
 * and is fully HTTPS-aware.
 * 
 * @returns {String} The base tracking image URL
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
 * Get query string vars in an object. This is non-smart, and doesn't handle
 * '[]' notation or do anything clever.
 * 
 * @param {String} query
 * @returns {Object} A hash of key => value pairs from the query string vars
 */
SPET.prototype.getQueryParams = function(query) {
    var qs = {},
    params = query.split("&"), parts;
    for(var i = 0; i < params.length; i++){
        parts = params[i].split("=");
        qs[ parts[0] ] = parts[1] ? parts[1] : "";
    } 
    return qs;
};

/**
 * Builds a query string from a non-nested object
 * @param {Object} obj the object the querystring will be built from
 * @returns {String} the querystring
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
 * Builds a query string from a non-nested object. Legacy FBML/FBJS-compatible.
 * @param {Object} obj the object the querystring will be built from
 * @returns {String} the querystring
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
 * Log an event (for debugging)
 * @param {String} event the event we are logging
 * @param {Object} [params] the parameter object
 */
SPET.prototype.log = function(event, params) {
	params = params || {};
	if (console.log) {
		console.log(event, params);
	}
};

/**
 * Track an event by loading a dummy image source URL.
 * If the debug parameter is true, this method will output event data to the browser console.
 * 
 * @param {String} event the event to track
 * @param {Object} [params] the parameter object
 */
SPET.prototype.track = function(event, params) {
	try {
		params = params || {};
		params.se = this.session;
		params.so = this.source;
		params.ev = event;
		params.r = Math.floor(Math.random() * 10000000);
		
		// Merge the event-specific params with our base params.
		params = this.extend({}, this.baseParams, params);
		
		// We don't need to track some params
		var untracked = [ 'trackPath', 'trackDomain', 'skipOnLoadEvent' ];
		for (var k in untracked) {
			delete params[untracked[k]];
		}
		
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
 * Set an image's src attribute. Legacy FBML/FBJS-compatible.
 * @param {String} url Full image source URL
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
 * Automatically attach listeners to children of an element
 * @param {DOMElement} elem the containing element we're binding events within (typically BODY)
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
 * Automatically attach listeners to the Facebook API.
 * Requires that the Facebook JavaScript SDK is loaded
 * @see https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/ 
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
		spet.track("error-facebook", {error: ex.toString()});
	}
};

/**
 * Call attachFBListeners. A convenience & consistency method
 * @see attachFBListeners
 */
SPET.prototype.attachFbListeners = function() { 
	return this.attachFBListeners(); 
};


/**
 * Handle tracking an A tag click, or a FORM tag submit
 * @param {DOMElement} element the element we are tracking
 */
SPET.prototype.trackElement = function(element) {
	if (typeof($) == 'undefined') return; // Sorry, this won't work without a nice $
	var tagName = element.tagName.toLowerCase();
	var event = (tagName === 'form') ? 'form-submit' : 'link-click';
	
	var jElement = $(element);
	if (jElement.attr('track')) {
		event = jElement.attr('track');
	}
	var params = { 'element': tagName };
	if (jElement.attr('href')) {
		params.url = jElement.attr('href');
	}
	if (tagName === 'form') {
		if (jElement.attr('action')) {
			params.url = jElement.attr('action');
		}
		params.data = $(element).serialize();
	}
	return this.track(event, params);
};

/**
 * Extend an object. Legacy FBML/FBJS compatible.
 * @param {Object} obj Base object
 * @param {Object} extObj Object with properties to extend onto obj
 * @returns {Object} obj, extended by extObj
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

