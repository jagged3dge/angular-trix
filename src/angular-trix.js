// https://github.com/sachinchoolur/angular-trix
(function() {
    'use strict';
    angular.module('angularTrix', []).directive('angularTrix', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                trixInitialize: '&',
                trixChange: '&',
                trixSelectionChange: '&',
                trixFocus: '&',
                trixBlur: '&',
                trixFileAccept: '&',
                trixAttachmentAdd: '&',
                trixAttachmentRemove: '&'
            },
            link: function(scope, element, attrs, ngModel) {

                var receivedFocus;

                element.on('trix-initialize', function() {
                    if (ngModel.$modelValue) {
                        element[0].editor.loadHTML(ngModel.$modelValue);
                    }
                });

                ngModel.$render = function() {
                    if (element[0].editor) {
                        element[0].editor.loadHTML(ngModel.$modelValue);
                    }

                    element.on('trix-change', function() {
                        if (receivedFocus) {
                            ngModel.$setViewValue(element.html());
                        }
                    });

                    element.on('trix-focus', function() {
                        receivedFocus = true;
                    });
                };

                var registerEvents = function(type, method) {
                    element[0].addEventListener(type, function(e) {
                        if (type === 'trix-file-accept' && attrs.preventTrixFileAccept === 'true') {
                            e.preventDefault();
                        }

                        if(!scope.$root.$$phase) {
                          scope.$apply(function() {
                            scope[method]({
                                e: e,
                                editor: element[0].editor
                            });
                          });
                        }
                    });
                };

                registerEvents('trix-initialize', 'trixInitialize');
                registerEvents('trix-change', 'trixChange');
                registerEvents('trix-selection-change', 'trixSelectionChange');
                registerEvents('trix-focus', 'trixFocus');
                registerEvents('trix-blur', 'trixBlur');
                registerEvents('trix-file-accept', 'trixFileAccept');
                registerEvents('trix-attachment-add', 'trixAttachmentAdd');
                registerEvents('trix-attachment-remove', 'trixAttachmentRemove');

            }
        };
    });

}());
