var firepad = null, userList = null, codeMirror = null;

function joinFirepadForHash() {
  if (firepad) {
    // Clean up.
    firepad.dispose();
    userList.dispose();
    $('.CodeMirror').remove();
  }

  var id = window.location.hash.replace(/#/g, '') || randomString(10);
  var url = window.location.toString().replace(/#.*/, '') + '#' + id;
  var firepadRef = new Firebase('https://firepad.firebaseio.com/demo').child(id);

  var userId = firepadRef.push().name(); // Just a random ID.
  codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
  firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
      { richTextToolbar: true, richTextShortcuts: true, userId: userId});
  userList = FirepadUserList.fromDiv(firepadRef.child('users'),
      document.getElementById('firepad-userlist'), userId);


  firepad.on('ready', function() {
    if (firepad.isHistoryEmpty()) {
      readTextFile('message.txt');
    }
  });

  codeMirror.focus();

  window.location = url;
  $('#url').val(url);
  $("#url").on('click', function(e) {
    $(this).focus().select();
    e.preventDefault();
    return false;
  });
}

function readTextFile(file) {     
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        var allText = "Welcome to our workshop!!!\n\nAdd your name next to the user name\n\n";
        allText += rawFile.responseText;
        firepad.setText(allText);
      }
    }
  }     
  rawFile.send(null); 
}

function randomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

$(window).on('ready', function() {
  joinFirepadForHash();
  setTimeout(function() {
    $(window).on('hashchange', joinFirepadForHash);
  }, 0);
});
