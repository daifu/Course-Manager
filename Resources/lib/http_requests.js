(function(){
    
    // Http Set up for all the request
    function handleHttpClient(url, callback) {
        var client = Ti.Network.createHTTPClient();
        // Handle the client when it is fired
        client.onload = function(e) {
            // Ti.API.info("HTTP Callback: " + this.responseText);
            callback.call(null, JSON.parse(this.responseText));
        };
        
        client.onerror = function(e) {
            Ti.API.debug(e.error);
            alert("Error occur, please make sure it is online.");
        };
        
        client.timeout = 5000; // 5 seconds
        
        client.open("GET", url);
        client.send();
    }
    
    // Handle HTTP requests
    exports.httpGetTerms = function(callback) {
        var url = Ti.App.httpReqeDomain + "/api/terms";
        handleHttpClient(url, callback);
    };
    
    exports.httpGetSubjectAreas = function(callback, term) {
        var url = Ti.App.httpReqeDomain + "/api/subject_areas/" + term;
        handleHttpClient(url, callback);
    };
    
})();
