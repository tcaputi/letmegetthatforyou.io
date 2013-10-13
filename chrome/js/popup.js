var email = null;
var name = null;
var session = null;

$(function() {
  chrome.identity.getAuthToken({
    'interactive': true
  }, function(token) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var parseResult = JSON.parse(xhr.responseText);
          email = parseResult["email"];
          name = parseResult["name"];

          chrome.storage.local.get("session", function(result) {
            session = result.session;
            if (!session) {
              // Form logic
              $("#register-button").click(function() {
                var registerVal = $("#computerNameField").val();
                if (registerVal) {
                  var xhr2 = new XMLHttpRequest();
                  xhr2.onreadystatechange = function() {
                    if (xhr2.readyState == 4) {
                      if (xhr2.status == 200) {
                        session = {};
                        session.computerName = registerVal;
                        // Set status
                        $("#status-region span").text("This computer is registered as \"" + session.computerName + "\".");
                        // Show the right shit
                        $("#status-region").show();
                        $("#registration-region").hide();
                      } else {
                        console.log("SHIIIIIIIIIIIIIIIIIIIIIIT.");
                        alert(xhr2.status + ": The internet isn't co-operating. Fix dat son.");
                      }
                    }
                  }
                  // Wait for chrome push channel id
                  chrome.pushMessaging.getChannelId(true, function(msg) {
                    var requestString = "http://pooter.sandile.me:7373/user/device/new?name=" + escape(registerVal) + "&chromeInstanceId=" + escape(msg.channelId) + "&googleId=" + escape(email.split("@")[0]);
                    console.log("qs: " + requestString);
                    xhr2.open("POST", requestString, true);
                    xhr2.send(null);
                  });
                } else {
                  alert("The Computer Name cannot be null.");
                }
              });
              // Show the right shit
              $("#status-region").hide();
              $("#registration-region").show();
            } else {
              // Set status
              $("#status-panel span").value("This computer is registered as \"" + session.computerName + "\".");
              // Show the right shit
              $("#status-region").show();
              $("#registration-region").hide();
            }
            $("#loader").hide();
            $("#content").show();
          });
        } else {
          console.log('UH OH: Try again. Dat internet.');
        }
      }
    }
    // Open it up as GET, POST didn't work for me for the userinfo 
    xhr.open("GET", "https://www.googleapis.com/oauth2/v1/userinfo", true);
    // Set the content & autherization 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', "OAuth " + token);
    xhr.send(null);
  });
});