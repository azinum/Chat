var app = angular.module("App", ["ngRoute"]);

app.controller("Init", function($scope, $location) {
	$scope.userName = "";
	$scope.uid = "";
	$scope.socket = io();

	$scope.socket.on("changeView", function(data) {
		$location.path(data);
	});
});

/* $scope.$parent. */
app.controller("Main", function($scope) {
	$scope.userName = "";
	$scope.joinSession = "";
	$scope.newSession = "";
	$scope.socket = $scope.$parent.socket;
	
	$scope.send = function(command, data) {
		$scope.socket.emit(command, data);
	}

	$scope.basicSend = function(command) {
		$scope.socket.emit(command, "");
	}
});

app.controller("Chat", function($scope) {
	$scope.socket = $scope.$parent.socket;
	$scope.userInput = "";
	$scope.messages = []

	$scope.socket.on("message", function(data) {
		$scope.messages.push(data);
	});

	$scope.send = function(command, data) {
		$scope.socket.emit(command, data);
	}

	$scope.sendMessage = function() {
		$scope.socket.emit("message", $scope.userInput);
		$scope.userInput = "";
	}

	$scope.$watch("messages", function() {
		setInterval(() => {
			$scope.$apply();
			return;
		}, 0);
	});
});

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "templates/main.html",
		controller: "Main"
	})
	.when("/chat", {
		templateUrl: "templates/chat.html",
		controller: "Chat"
	});
});

app.filter("reverse", () => {
	return function(messages) {
		return messages.slice().reverse();
	}
});

app.directive("scrollBottom", function() {
	return {
		scope: {
			scrollBottom: "="
		},
		link: function(scope, element) {
			scope.$watchCollection("scrollBottom", function(value) {
				if (value) {
					window.scrollTo(0, document.body.scrollHeight);
				}
			});
		}
	}
});