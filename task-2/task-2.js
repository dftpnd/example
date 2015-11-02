'use strict';
(function () {
    function debouncedFn (fn, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) fn.apply(context, args);
        };
    }


    ///////////////
    function someSpamFunction (text) {
        console.log(text);
    }

    var startFunc = debouncedFn(someSpamFunction, 500);
    startFunc('hello world');
    startFunc('hello world');
    startFunc('hello world');
})();