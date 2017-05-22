$(document).ready(function(){
    
    /*
     * Get Weather Function
     * -----------------------------------------------------------------------------------------
     */
    
    function sn_get_current_weather(zip) {
        
        // build query to weather api. results should be based on the zipcode the user supplied and we just got back from handler
        var url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + '&type=accurate&mode=json&units=metric&APPID=141a1d2b27350004d3d5b863ee2c688a';
    
        // query the weather api based on zip returned to us from handler
        $.getJSON(url,function(result) {
            
            // now if that query went good lets update the weather info on the page
            $('.city-name .val').html(result.name);
            $('.wind-speed .val').html(result.wind.speed);
            
        });
        
    }
    
    
    /*
     * ID Cookie Exists Function
     * -----------------------------------------------------------------------------------------
     */
    
    function sn_cookie_exists() {
        
        // create an array of {key:value} pairs and assign them to a var to send to our handler.
        var theId = {id:Cookies.get('id')};
        
        // send the cookie data array to a handler page.
        $.ajax({
            url: 'handlerForCookieExists.php',
            type: 'POST',
            data: theId,
            success: function(result) {
            
                // query the weather api with the users zip
                sn_get_current_weather(result);
                
            }
        });
        
    }
    
    
    /*
     * No ID Cookie Function
     * -----------------------------------------------------------------------------------------
     */
    
    function sn_no_cookie() {
        
        // since the user has not provided their info and no cookie is set... lets set some defaults for weather
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Raleigh&type=accurate&mode=json&units=metric&APPID=141a1d2b27350004d3d5b863ee2c688a",function(result) {
            
            // load weather data into html elements
            $('.city-name .val').html(result.name);
            $('.wind-speed .val').html(result.wind.speed);
            
        });
        
        // also since no ID cookie was found lets trigger a popup with a form asking the user for their info
        $('.slide-panel').delay(1200).fadeIn(1000);
        
        // now lets set what happens when a user submits the form with their info
        $('#get-weather-form').submit(function(e) {
            
            // lets create vars to store form field values
            var userName = $('#name').val();
            var userEmail = $('#email').val();
            var userZip = $('#zip').val();
                        
             // group form field vars into one array to be passed to the handler
            var userInfo = {name:userName,email:userEmail,zip:userZip};
            
            // ajax call to handler for no cookie. This should store values in our database and return back a unique id
            $.ajax({     
                url: 'handlerForNoCookie.php',
                type: 'POST',
                dataType: 'json',
                data: userInfo,
                success: function(data) {
                    
                    // set a cookie with user ID returned from handler
                    Cookies.set('id', data, { expires: 365 });
                    
                },
                complete: function() {
                    
                    sn_cookie_exists();
                    
                    // close the popup form
                    $('.slide-panel').fadeOut('slow');
                    
                }
            });
            
            e.preventDefault();
            
        });
        
    }
    
    
    if (Cookies.get('id') === undefined) {
        
        sn_no_cookie();
        
    } else {
        
        sn_cookie_exists();
        
    }
    
});
