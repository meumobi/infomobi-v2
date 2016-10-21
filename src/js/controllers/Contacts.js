'use strict';

angular
	.module('infoMobi')
	.controller('ContactsController', ContactsController);

	function ContactsController($scope, $rootScope) {

    /*
$scope.chatUsers = [
      { name: 'Carlos  Flowers', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Byron Taylor', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Jana  Terry', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Darryl  Stone', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Fannie  Carlson', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Holly Nguyen', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Bill  Chavez', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Veronica  Maxwell', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Jessica Webster', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Jackie  Barton', phone: '(11)983487230', email: 'carlos@gmail.com', available: true },
      { name: 'Crystal Drake', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Milton  Dean', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Joann Johnston', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Cora  Vaughn', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Nina  Briggs', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Casey Turner', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Jimmie  Wilson', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Nathaniel Steele', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Aubrey  Cole', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Donnie  Summers', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Kate  Myers', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Priscilla Hawkins', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Joe Barker', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Lee Norman', phone: '(11)983487230', email: 'carlos@gmail.com', available: false },
      { name: 'Ebony Rice', phone: '(11)983487230', email: 'carlos@gmail.com', available: false }
    ];
    */
    $scope.contacts = $rootScope.contacts;
	}