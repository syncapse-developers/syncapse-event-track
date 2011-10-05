





..
    Classes and methods

Class SPET
================================================================================

..
   class-title


Syncapse Platform Event Track 1.1

Event track is a system for tracking events in Facebook Tabs and Applications.  
These actions are tracked using a client-side library and recorded within the Syncapse Platform. 
Clients with access to the Measure product within the Syncapse Platform can run reports on the tracked events.








    


Constructor
-----------

.. js:class:: SPET(source, [session], [params])


    
    :param String source: 
        The URL of the App/Tab that is being tracked 
    
    :param String session: 
        The current session 
    
    :param Object params: 
        any parameters to be passed to the "page-view" event (also can include debug: true) 
    
    :param Boolean params.debug: 
        If debug is true, no data will be sent to the Syncapse tracking server. Instead, all tracking event data will be output to the browser console using console.log. (*Default*: "true")
    
    :param String params.trackDomain: 
        The tracking domain to which the Event Track class will send event data. (*Default*: "track.platform.syncapse.com")
    
    :param String params.trackPath: 
        The path component for the tracking image. (*Default*: "/track.gif")
    
    :param String params.location: 
        A 'location' data element to send to the server. (*Default*: "document.location.href")
    
    :param String params.fromVariableName: 
        Event Track can track where a user has arrived from by using a named GET variable. (*Default*: "from")
    
    :param Boolean params.inFbml: 
        If you are using Event Track in an FBML context (which is officially unsupported), you may want to set the parameter to 'true'. (*Default*: "false")
    
    :param String params.imageId: 
        If you are using Event Track in an FBML context (officially unsupported), Event Track needs a DOM image element with this ID. (*Default*: "spet_image")
    
    :param Boolean params.skipOnLoadEvent: 
        Event Track will fire a 'page-view' event automatically in the constructor. If this is not your desired behaviour, set this parameter to 'true'. (*Default*: "false")
    



    
    :returns SPET:
        An instance of the Syncapse Platform Event Tracker. 
    





Methods
-------

..
   class-methods


addQueryVars
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#addQueryVars(parameter, query, [prefix])


    
    :param Object parameter: 
        Parameter object 
    
    :param String query: 
        Query string 
    
    :param String prefix: 
        Prefix to prepend to query var names (*Default*: "get_")
    



    
    :returns Object:
        Modified parameter object 
    


Add query vars to params object with a prefix.









    



attachFbListeners
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#attachFbListeners()





Call attachFBListeners. A convenience & consistency method







.. seealso::

    attachFBListeners



    



attachFBListeners
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#attachFBListeners()





Automatically attach listeners to the Facebook API.
Requires that the Facebook JavaScript SDK is loaded







.. seealso::

    https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/



    



attachListeners
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#attachListeners(elem)


    
    :param DOMElement elem: 
        the containing element we're binding events within (typically BODY) 
    




Automatically attach listeners to children of an element









    



buildFbmlQueryString
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#buildFbmlQueryString(obj)


    
    :param Object obj: 
        the object the querystring will be built from 
    



    
    :returns String:
        the querystring 
    


Builds a query string from a non-nested object. Legacy FBML/FBJS-compatible.









    



buildQueryString
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#buildQueryString(obj)


    
    :param Object obj: 
        the object the querystring will be built from 
    



    
    :returns String:
        the querystring 
    


Builds a query string from a non-nested object









    



extend
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#extend(obj, extObj)


    
    :param Object obj: 
        Base object 
    
    :param Object extObj: 
        Object with properties to extend onto obj 
    



    
    :returns Object:
        obj, extended by extObj 
    


Extend an object. Legacy FBML/FBJS compatible.









    



generateSession
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#generateSession()




    
    :returns String:
        the generated session string 
    


Generates a new session (based on the time and a random number)
Note: has no side-effect (aka the session is not stored in the object)









    



getDefaultParams
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#getDefaultParams()




    
    :returns Object:
        Default parameter object 
    


Get the default parameter object









    



getQueryParams
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#getQueryParams(query)


    
    :param String query: 
         
    



    
    :returns Object:
        A hash of key => value pairs from the query string vars 
    


Get query string vars in an object. This is non-smart, and doesn't handle
'[]' notation or do anything clever.









    



getSession
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#getSession()




    
    :returns String:
        the session 
    


Gets the session associated with this instance









    



getUrl
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#getUrl()




    
    :returns String:
        The base tracking image URL 
    


Get the URL used to track events. Uses the 'trackDomain' and 'trackPath' parameters, 
and is fully HTTPS-aware.









    



log
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#log(event, [params])


    
    :param String event: 
        the event we are logging 
    
    :param Object params: 
        the parameter object 
    




Log an event (for debugging)









    



setImageSource
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#setImageSource(url)


    
    :param String url: 
        Full image source URL 
    




Set an image's src attribute. Legacy FBML/FBJS-compatible.









    



track
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#track(event, [params])


    
    :param String event: 
        the event to track 
    
    :param Object params: 
        the parameter object 
    




Track an event by loading a dummy image source URL.
If the debug parameter is true, this method will output event data to the browser console.









    



trackElement
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

.. js:function:: SPET#trackElement(element)


    
    :param DOMElement element: 
        the element we are tracking 
    




Handle tracking an A tag click, or a FORM tag submit









    




    


