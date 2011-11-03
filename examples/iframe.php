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


<h3>Syncapse Event Track 1.1 test page</h3>
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

<!-- Syncpase Tracking Code START -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="../src/SPET.min.js"></script>
<script type="text/javascript">
//<![CDATA[start
$(document).ready(function() {
	//console.info("jQuery loaded");
	var appId = '234092466622279'; // The Event Track 1.0 iframe Demo App
	var source = "http://www.facebook.com/pages/Event-Tracking-Demo/169269273142241?sk=app_?sk=app_" + appId;
	var params = {"debug":true};
	window._spet = new SPET(source, null, params);
	
	// this attaches listeners for <A> and <FORM> events
	_spet.attachListeners(document);
});
//]]>end
</script>
<!-- Syncpase Tracking Code END -->

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
