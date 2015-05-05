angular.module('starter.services', [])


.factory('GetCountry', function( $http ){
  return function(){
    return $http.get('http://freegeoip.net/json/');
  };
})

.factory('API', function($http, Base64, APIPath, StoreLogin){
  return {
    AddPhoto : function(photo) {

      photo.user = StoreLogin.Get().User.username;

      $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(StoreLogin.Get().User.username + ':' + StoreLogin.Get().User.password);

      return $http(
        {
          method : 'POST',
          url : APIPath() + 'api/photos', 
          data : photo, 
          headers : {'Content-Type': 'application/json'}
        });

    },
    NewUser : function(User) {
      return $http.post(APIPath() + 'api/users?username='+User.username+'&password='+User.password+'&email='+User.email);
    },
    GetPhotos : function(query) {

      $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(StoreLogin.Get().User.username + ':' + StoreLogin.Get().User.password);

      try {
        return $http(
        {
          method : 'POST',
          url : APIPath() + 'api/getphotos',
          data : query,
          headers : {'Content-Type': 'application/json'}
        });
      } catch (err) {
        alert(err);
      }


    }
  }
})

.factory('APIPath', function(){
  return function () {
    return 'http://192.168.1.103:5000/'; //Dev
    //return 'http://192.168.1.104:5000/';
  };
})

.factory('StoreLogin', function(){
  return {
    Store : function(User) {
      if (!localStorage.WaveHunter) {
        localStorage.WaveHunter = '{}'
      }
      var Local = JSON.parse(localStorage.WaveHunter);
      Local.User = User;
      localStorage.WaveHunter = JSON.stringify(Local);
    },
    Get : function() {
      if (!localStorage.WaveHunter) {
        return false;
      } else {
        return JSON.parse(localStorage.WaveHunter);
      }
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.filter('toTitleCase', function() {
    return function(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
})


.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
