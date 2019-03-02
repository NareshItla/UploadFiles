var UploadFile = angular.module('UploadApp', []);
var socket;
UploadFile.controller('uploadController', function ($scope) {
    socket = io.connect('http://localhost:3000/');

    socket.on('connect', function () {
        console.log("connected")
    })


});
UploadFile.directive("fileinput", [function ($) {
    return {
        link: function (scope, element, attributes) {
            scope.sentPercent = 0 + '%';
            element.bind("change", function (changeEvent) {

                scope.fileinput = changeEvent.target.files[0];
                var file = changeEvent.target.files[0];
                var fileName = changeEvent.target.files[0].name;
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        let stringToSplit = loadEvent.target.result;
                        const allLines = stringToSplit.split(/\r\n|\n/);
                        var j;
                        scope.status = true;
                        scope.pause = function () {
                            scope.status = false;
                        };
                        var sendLength;
                        scope.resume = function () {
                            scope.status = true;
                            run(j);
                        };

                        var factor;
                        if (allLines.length && allLines.length > 100) {
                            factor = 100;
                            sendLength = Math.floor(allLines.length / factor);
                        }
                        else {
                            sendLength = 1;
                        }
                        function run(i) {
                            j = i;
                            if (i >= allLines.length) {
                                scope.$apply(function () {
                                    scope.sentPercent = 100 + '%'
                                });
                            }
                            else {
                                socket.emit('message', allLines.slice(i, i + sendLength), fileName);
                                i = i + sendLength;
                                socket.once('cb', function (msg) {
                                    //console.log(msg)
                                    if (msg == 200) {
                                        if (scope.status) {
                                            scope.$apply(function () {
                                                scope.sentPercent = (i / allLines.length).toFixed(2) * 100 + '%';
                                            });
                                            run(i);
                                        }
                                        else {
                                            console.log("paused");
                                        }
                                    }
                                })
                            }
                        }

                        run(0);
                    });
                }
            });
        }
    }
}]);
 
