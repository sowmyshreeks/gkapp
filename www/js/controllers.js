angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $location) {
    $scope.user = {};
    $scope.loginErr = "";
    console.log('hi');
    $scope.login = function(user) {
        //console.log('hi');
        $scope.loginErr = "";
        var username = user.name;
        var password = user.password;
        if (username == "user" && password == "user") {
            $location.path('/tab');
        } else if (username == "admin" && password == "admin") {
            $location.path('/admin');
        } else {
            $scope.loginErr = "Warning!... Invalid username or passwor-d";
        }
    }
    ;

}).controller('tabsCtrl', function($scope, $location, $http, myService) {

    $http.post("http://192.168.0.12:8080/findQuestionType").then(function(response) {
        // $scope.myWelcome = response.data;
        console.log(response);
        $scope.paperType = response.data.data;
    });

    $scope.ques = function(paper) {
        console.log(paper);
        var req = {
            method: 'POST',
            url: "http://192.168.0.12:8080/findPerticularQuestion",
            data: jQuery.param({
                questionType: paper.type
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        $http(req).then(function(res) {
            console.log(res);
            if (res.data.data) {
                myService.set(res.data.data[0]);
                $location.path('/question');
            } else {
                console.log('no question paper');
            }

            
        }, function() {
            console.log('error occured');
        })

    }
    $scope.logout = function() {
        $location.path('/login');
    }
}).factory('myService', function() {
    var savedData = {}
    function set(data) {
        console.log(data);
        savedData = data;
    }
    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }
})
.controller('adminCtrl', function($scope, $location, $http) {

    $http.post("http://192.168.0.12:8080/findAllUserAnswers").then(function(response) {
        // $scope.myWelcome = response.data;
        console.log(response);
        //$scope.paperType = response.data.data;
    });


    $scope.logout = function() {
        $location.path('/login');
    }
})
.controller('queCtrl', function($scope, $location, $http, myService) {

    var que = myService.get()
    $scope.questions = que.questions;
    console.log($scope.questions);
    console.log(que);
    //$http.post("http://192.168.0.12:8080/findQuestions").then(function(response) {
    // $scope.myWelcome = response.data;
    //  console.log(response.data[0].questions);
    //$scope.questions = response.data[0].questions;
    $scope.index = 0;
    $scope.curQuestionId = 1;
    $scope.curQuestion = $scope.questions[0];
    $scope.userAswers = [];
    $scope.curSelOpt = $scope.userAswers[$scope.index] || "";
    //});

    /*
    $scope.quetsions = [{
        
        question: 'The IT capital of India is',
        choice: ['Bangalore','mysore','manglore','deli']
    },

    {
               
        question: 'Which one of the following is not a prime number?',
        choice: ['31','61','71','91']
    },
    {
                
        question: 'The largest 4 digit number exactly divisible by 88 is:',
        choice: ['9944','9768','8888','None of the',]
    }
    ];
*/

    $scope.nextQuestion = function() {
        console.log('enter msg')
        if ($scope.curQuestionId < $scope.questions.length) {
            $scope.curQuestionId = $scope.curQuestionId + 1;
            $scope.index = $scope.index + 1;
            $scope.curQuestion = $scope.questions[$scope.index];
            console.log($scope.curQuestion);

        }
        ;
    }
    
    $scope.previousQuestion=function()
    {
        console.log('enter msg')
        if($scope.curQuestionId>1)
        {
            $scope.curQuestionId=$scope.curQuestionId-1;
            $scope.index=$scope.index-1;
            $scope.curQuestion=$scope.questions[$scope.index];
            console.log($scope.curQuestion);
            

        };
    }

    $scope.optionSelected = function(ind, c) {
        
        $scope.questions[ind]["userAnswer"] = c.opt;
        console.log($scope.questions);
        //$scope.userAnswers[$scope.index] = c.opt;
        //console.log($scope.userAnswers);
    }

    $scope.back = function() {
        //console.log("back page");
        $location.path('/tab');
    }

$scope.user={};
    $scope.result = function() 
    {
        $scope.user.userId = '1001';
        $scope.user.questions = $scope.questions;
        $scope.user.userAnswer = $scope.questions;
        $scope.user.type = que.questionType;
console.log($scope.user);
        var req = {
            method: 'POST',
            url: "http://192.168.0.12:8080/addUserAnswers",
            data: jQuery.param($scope.user),
             headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        }
        $http(req).then(function(res) {
            console.log(res);

        }, function() {
            console.log('error occured');
        })

    }
});
