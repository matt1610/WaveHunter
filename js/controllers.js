angular.module('starter.controllers', [])

.controller('BrowseCtrl', function($scope, $http, API, $ionicLoading, StoreLogin, $ionicModal, $ionicPopup) {

	$scope.User;
	$scope.NewAccount = true;

	$scope.Query = {
		criteria : undefined,
		value : undefined
	}

	$scope.TitleCase = function(str) {
		toTitleCase(str);
	}

	$scope.LoginAccount = function(User) {
		StoreLogin.Store(User);
		$scope.modal.hide();
		$scope.Refresh();
	}

	$scope.SearchQuery;

	$scope.FindSpot = function(query) {
		$scope.Query = {
			criteria : 'break',
			value : query.toLowerCase(),
			type : 'Search'
		}
		$scope.Loading();
		API.GetPhotos($scope.Query).then(function(data) {
			$scope.Photos = data.data.reverse();
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.CreateNewAccount = function(User) {
		$scope.Loading();
		API.NewUser(User).then(function(data) {
			$scope.showAlert = function() {
			   var alertPopup = $ionicPopup.alert({
			     title: data.data.message
			   });
			   alertPopup.then(function(res) {
			     console.log('Thank you for not eating my delicious ice cream cone');
			   });
			 };

			 $scope.showAlert();

			if (data.data.success) {
				 StoreLogin.Store(User);
				 $scope.modal.hide();
				 $ionicLoading.hide();
				 $scope.Refresh();
			}
		});
	}

	$scope.Refresh = function() {
		API.GetPhotos($scope.Query).then(function(data) {
			$scope.Photos = data.data.reverse();
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.Loading = function() {
		$ionicLoading.show({
		  content: '<i class="icon largeLoader ion-looping"></i>'
		});
	}

	$ionicModal.fromTemplateUrl('templates/login-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;

		if (!StoreLogin.Get()) {
			$scope.modal.show();
		} else{
			$scope.User = StoreLogin.Get().User;
			$scope.Loading();
			$scope.Refresh();
		}
	
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	

	$scope.Favourites = [
		{
			Name : 'Bronze Beach',
			Country : 'South Africa'
		}
	]
})

.controller('PhotoCtrl', function($state, $ionicLoading, $ionicModal, $scope, Chats, GetCountry, $ionicPlatform, $cordovaCamera, API) {

	GetCountry().then(function(data) {
		$scope.Country = data.data.country_name;
		$scope.Data = data.data;
	});

	$ionicModal.fromTemplateUrl('templates/photo-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.TakePhoto = function() {

	  	$scope.Photo = {
	  		comment : '',
	  		break : '',
	  		state : '',
	  		country : $scope.Country,
	  		city : '',
	  		user : '',
	  		src : '',
	  		date : '',
	  		user : ''
	  	}

	  	try {
	  		$ionicPlatform.ready(function() {

		  		var options = {
			      quality: 50,
			      destinationType: Camera.DestinationType.DATA_URL,
			      sourceType: Camera.PictureSourceType.CAMERA,
			      allowEdit: true,
			      encodingType: Camera.EncodingType.JPEG,
			      targetWidth: 500,
			      targetHeight: 500,
			      popoverOptions: CameraPopoverOptions,
			      saveToPhotoAlbum: false
			    };
			  

		  		$cordovaCamera.getPicture(options).then(function(imageData) {
			      $scope.Photo.src = "data:image/jpeg;base64," + imageData;
			      $scope.Photo.date = new Date();
			      $scope.openModal();
			    }, function(err) {
			      console.log(err);
			    });

			});
	  	} catch (err) {
	  		$scope.Data = err;
	  	}

	} // End TakePhoto

	$scope.SendPhoto = function() {
		$ionicLoading.show({
		  content: '<i class="icon largeLoader ion-looping"></i>'
		});

		try {
			API.AddPhoto($scope.Photo).then(function(data) {
				$ionicLoading.hide();
				$scope.modal.hide();
				$state.go('tab.browse');
			});
		} catch(err) {
			console.log(err);
		}
	}

  

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
