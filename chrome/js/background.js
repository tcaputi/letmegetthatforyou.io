function ls(path, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      console.log(xhr.status);
      if (xhr.status == 0) {
        var pat = "addRow\\s*\\(\\s*(.+?)\\s*,\\s*(.+?)\\s*,\\s*(.+?)\\s*,\\s*(.+?)\\s*,\\s*(.+?)\\s*\\)";
        var str = xhr.responseText.substring(xhr.responseText.indexOf("<body>"));
        var arr, curr;
        var res = [];
        while ((arr = str.match(pat)) !== null) {
          curr = {};
          curr["type"] = (arr[3].split('"').join('') === "0") ? "file" : "folder";
          curr["size"] = arr[4].split('"').join('');
          curr["dateLastModified"] = arr[5].split('"').join('');
          curr["name"] = arr[2].split('"').join('');
          res.push(curr);
          str = str.replace(arr[0].toString(), "");
        }
        cb(JSON.stringify(res));
      }
    }
  }
  // Open it up as GET, POST didn't work for me for the userinfo 
  xhr.open("GET", "file:///C:/", true);
  // Set the content & autherization
  xhr.send(null);
}

chrome.runtime.onStartup.addListener(function(launchData) {
    console.log("onStartup");
    chrome.pushMessaging.onMessage.addListener(function(msg) {
        console.log("onMsg");
        var payload = JSON.parse(message.payload);
        if (payload.call === "ls") {
            ls(payload.payload.path, function (res) {
                console.log(res);
            });
        }
    });
});