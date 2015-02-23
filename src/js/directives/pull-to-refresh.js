var myApp = angular.module('meumobi.directives', []);

myApp.directive('pullToRefresh', function(){
    return {
        restrict: 'E',
        template: '<p style="position: absolute; z-index:2; top:-20px; width: 100%; margin:0; padding:10px 15px; font-size:18px; border-bottom:1px solid #ddd"><i class="fa fa-angle-double-down" ng-class="{\'fa-rotate-180\': release, \'fa-spinner fa-spin\': loading}"></i> {{message}}</p>',
        replace: true,
        scope: {
            onRefresh: '&'
        },
        controller: function($scope, $element, $attrs){
            var pulling   = false,
                loading   = false,
                initialY  = 0,
                finalY    = 0,
                element   = $element[0];
                scroll    = $element.parent()[0],
                scrollContent = $element.next()[0],

            $scope.message = $attrs.messagePull || 'Puxe para atualizar';

            function touchstart (event){
                if($scope.loading) return;

                initialY = event.changedTouches[0].clientY;

                changeTransition("all 0");
            };
            
            function touchmove (event){
                if($scope.loading) return;

                finalY = event.changedTouches[0].clientY - initialY;
                
                if(scroll.scrollTop == 0 && finalY > 0){
                    pulling = true;
                    
                    changeTransform("translate3d(0px, " + (finalY / 3) + "px, 0px)");
                    
                    scroll.style.overflow = 'visible';
                    scrollContent.style.overflow = 'hidden';

                    if(finalY > 180){
                        $scope.$apply(function(){
                            $scope.message = $attrs.messageRelease || 'Solte para atualizar';
                            $scope.release = true;
                        });
                    }else{
                        $scope.$apply(function(){
                            $scope.message = $attrs.messagePull || 'Puxe para atualizar';
                            $scope.release = false;
                        });
                    }

                }else{
                    pulling = false;
                    scrollContent.style.overflow = 'auto';
                }

                scroll.addEventListener('touchend', touchend);
            };

            function touchend (event){
                if($scope.loading) return;

                scrollContent.style.overflow = 'auto';
                
                if(pulling){
                    changeTransform("translate3d(0px, 0px, 0px)");

                    changeTransition("all 0.2s ease-out");

                    if(finalY > 180){
                        if($attrs.onRefresh){
                            element.style.position = 'static';
                            $scope.$apply(function(){
                                $scope.message = $attrs.messageLoading || 'Atualizando';
                                $scope.loading = true;
                            });
                            $scope.onRefresh({
                                callback: callbackFn
                            });
                        }else{
                            
                        }
                    }
                }

                pulling = false;

                scroll.removeEventListener('touchend', touchend);
            }

            var callbackFn = function(){
                element.style.position = 'absolute';
                changeTransform("translate3d(0px, 0px, 0px)");
                
                $scope.$apply(function(){
                    $scope.message = $attrs.messagePull || 'Puxe para atualizar';
                    $scope.loading = false;
                    $scope.release = false;
                });
            }

            changeTransform = function(transform){
                scroll.style.WebkitTransform = transform;
                scroll.style.MozTransform = transform;
                scroll.style.msTransform = transform;
                scroll.style.OTransform = transform;
                scroll.style.transform = transform;
            }

            changeTransition = function(transition){
                scroll.style.WebkitTransition = transition;
                scroll.style.MozTransition = transition;
                scroll.style.msTransition = transition;
                scroll.style.OTransition = transition;
                scroll.style.transition = transition;
            }

            scroll.addEventListener('touchstart', touchstart);
            scroll.addEventListener('touchmove',  touchmove);
        },
        link: function(scope, element, attrs) {
            
        }
    };
})