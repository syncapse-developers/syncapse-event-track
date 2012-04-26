<?php
/**
 * To test, drop this on a server and point an iframe tab or canvas URL at it.
 * Questions? Please ask here: 
 * 	* https://github.com/syncapse-developers/syncapse-event-track/issues
 */

// Confound any front-end caches 
if ( ! headers_sent()) header("Cache-control: Private");

?><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <title>Event Track Example</title>
 </head>
<body>


<h3>Syncapse Event Track test page</h3>
<p>
	<!-- These links will be tracked automatically by SPET event: link-click -->
	<a href="http://www.syncapse.com" target="_blank">Syncapse Corp.</a><br/>
	<a href="http://www.yahoo.com" target="_blank">Yahoo</a>
</p>
<p>
 <!-- These links will be tracked automatically by SPET event: link-click -->
 <a href="#t1" onclick="return false;">Auto Track 1</a> |
 <a href="#t2" onclick="return false;">Auto Track 2</a> |

 <!-- This link is tracked by SPET, but we have overriden the tracking such that event: special -->
 <a href="#t3" onclick="return false;" track="link-click-special">Overriden Track 1</a> |
 
 <!-- This link is NOT tracked by SPET -->
 <a href="#t4" onclick="return false;" track="false">Untracked 1</a> |
 
 <!-- This link is NOT tracked automatically, but is tracked manually in the JavaScript function it calls -->
 <a href="#t5" onclick="return checkWithUser();" track="false">Manually Tracked 1</a>
 
 <h4>Other Examples</h4>
 <ul>
	<li><a href="implementation-1.html">View Example #1</a></li>
	<li><a href="implementation-2.html">View Example #2</a></li>
	<li><a href="implementation-3.html">View Example #3</a></li>
	<li><a href="implementation-4.html">View Example #4</a></li>
	<li><a href="implementation-5.html">View Example #5</a></li>
	<li><a href="implementation-6.html">View Example #6</a></li>
</ul>
</p>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>


<script type="text/javascript">
//<![CDATA[
var app_id = '245156032227773'; // The Event Track 2.x iframe Demo App
var tab_url = "http://www.facebook.com/pages/Event-Tracking-Demo/169269273142241?sk=app_" + app_id;
var params = {
	source: tab_url, // this must be of the form http://www.facebook.com/PAGENAME?sk=app_APPID 
	debug: true      // set this to false in production
};

var _spet = _spet || {};
_spet.config = params;

(function(s, d, t, v) {
  var a = s.config.adaptors || {SPET:{}}, l = [], i;
  for (i in a) { l.push(i); }; a = l.join(',');
  var f = d.getElementsByTagName(t)[0], e = d.createElement(t); e.async = 1;
  e.src = '//assets.syngrid.com/event-track/v/'+v+'?a='+a+'&debug='+s.config.debug; 
  f.parentNode.insertBefore(e, f);
  s.q = []; s.track = function(){ s.q.push(Array.prototype.slice.call(arguments)); };
})(_spet, document, 'script', '2.2');
//]]>
</script>

<script type="text/javascript">
//<![CDATA[start
function checkWithUser() {
	if (confirm('Are you sure?')) {
		// do some action
		
		// track the action
		_spet.track('user-confirmed');
	}
	return false;
}

//]]>end
</script>
</body>
</html>
