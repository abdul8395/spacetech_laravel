var selectionAppRight=angular.module('rightController',[]);

var rightScope;

selectionAppRight.directive('rightTemplate',function(){



    return{
        restrict : 'E',
        templateUrl : 'template/rightPanel.html',
        controller : ['$scope','$http','$timeout',function($scope,$http,$timeout) {
            rightScope=$scope;
            $scope.layerInfos=[];


        }],
        controllerAs:   'rightCtrl'

    }

});
selectionAppRight.filter('capitalize', function() {
    return function(input) {
        if(input=="pp" || input=="na"){
            return (!!input) ? input.toUpperCase() : '';
        }else {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    }
});

selectionAppRight.filter('removeunderscore', function() {
    return function(input) {
        return (!!input) ? input.replace('_',' ') : '';
    }
});

