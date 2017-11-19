/******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId]) {
      /******/ 			return installedModules[moduleId].exports;
      /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
      /******/ 			i: moduleId,
      /******/ 			l: false,
      /******/ 			exports: {}
      /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
    /******/ 		if(!__webpack_require__.o(exports, name)) {
      /******/ 			Object.defineProperty(exports, name, {
        /******/ 				configurable: false,
        /******/ 				enumerable: true,
        /******/ 				get: getter
        /******/ 			});
      /******/ 		}
    /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
    /******/ 		var getter = module && module.__esModule ?
      /******/ 			function getDefault() { return module['default']; } :
      /******/ 			function getModuleExports() { return module; };
    /******/ 		__webpack_require__.d(getter, 'a', getter);
    /******/ 		return getter;
    /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 0);
  /******/ })
/************************************************************************/
/******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    var timeout;
    var timestamp;
    var timeDisplayInterval;
    /*
     * @description Setup timer value for input if any has been previously saved in
     *              the localStorage, if not then set the default to 20 mins. Also
     *              ask for notifications permission in case it's the first time using
     *              the app or if permission has been previously removed
     */
    var init = function () {
      var timerInput = document.getElementById('intervalTime');
      var timerTime = localStorage.getItem('intervalTime');
      localStorage.setItem('intervalTime', (timerTime ? timerTime : 20).toString());
      timerInput.value = (timerTime ? parseInt(timerTime, 10) : 20).toString();
      if (Notification.permission !== 'granted') {
        Notification.requestPermission(function () { });
      }
      document.getElementById('timeDisplay').innerHTML = "Time left: " + localStorage.getItem('intervalTime') + " min(s)";
    };
    /*
     * @description Save the timer time in the localStorage and rerun the timer.
     *              If there was a previous timer setup, we clear it. Also update
     *              the text displaying the time left.
     * @param {object} e - Form submit event which we prevent from submitting the form.
     *                     We use this instead of a button with type of button so that we
     *                     can validate that the timer number is not less than 0.
     */
    var saveIntervalTime = function (e) {
      e.preventDefault();
      var time = document.getElementById('intervalTime');
      localStorage.setItem('intervalTime', time.value);
      clearTimeout(timeout);
      document.getElementById('timeDisplay').innerHTML = "Time left: " + localStorage.getItem('intervalTime') + " min(s)";
      runTimer();
      _showCheckmark();
    };
    /*
     * @description Setup a timeout to display a desktop Notification depending
     *              the time we pick on the number picker
     */
    var runTimer = function () {
      // time should be in minutes therefore we need to convert to milliseconds
      // by multiplying by 60000
      var timer = parseInt(localStorage.getItem('intervalTime'), 10) * 60000;
      timestamp = new Date().getTime();
      clearInterval(timeDisplayInterval);
      runTimeChecker();
      timeout = setTimeout(function () {
        clearInterval(timeDisplayInterval);
        showNotification();
      }, timer);
    };
    /*
     * @description Check if Notification permission has been granted or denied. If granted
     *              go ahead run utility function that shows notification, if denied then
     *              ask for permission.
     */
    var showNotification = function () {
      if (Notification.permission === 'granted') {
        _setupNotification();
      }
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          if (permission === 'granted') {
            _setupNotification();
          }
        });
      }
    };
    /*
     * @description Show desktop Notification and play Audio. Setup onclick handler
     *              for Notification which gets triggered when the Notification toaster
     *              gets closed which then setups a new timer for next notification.
     */
    var _setupNotification = function () {
      new Audio('assets/coins.mp3').play();
      var options = {
        body: 'Move a lil!',
        requireInteraction: true,
      };
      var notification = new Notification('Arriva!', options);
      notification.onclick = function () {
        document.getElementById('timeDisplay').innerHTML = "Time left: " + localStorage.getItem('intervalTime') + " min(s)";
        notification.close();
        runTimer();
      };
    };
    /*
     * @description Shows a Notification and plays an Audio to make sure
     *              desktop notifications are working
     */
    var testNotification = function () {
      new Audio('assets/coins.mp3').play();
      new Notification('Arriba!', {
        body: 'Move a lil!'
      });
    };
    /*
     * @description Utility function to toggle a checkmark when saving a timer
     */
    var _showCheckmark = function () {
      var checkmarkEl = document.getElementById('checkmark');
      checkmarkEl.style.display = 'inline-block';
      setTimeout(function () {
        checkmarkEl.style.display = 'none';
      }, 1000);
    };
    /*
     * @description Sets up an interval to run every 5 mins to update the time left
     *              being displayed.
     */
    var runTimeChecker = function () {
      var timeBox = function (time) { return ({
        map: function (f) { return timeBox(f(time)); },
        fold: function (f) { return f(time); },
      }); };
      timeDisplayInterval = setInterval(function () {
        var intervalTime = parseInt(localStorage.getItem('intervalTime'), 10);
        var timeLeft = timeBox(new Date().getTime())
          .map(function (t) { return t - timestamp; }) // get the time lapsed
          .map(function (t) { return t / 60000; }) // convert mills to mins
          .map(function (t) { return intervalTime - t; }) // get time left till next notification
          .map(Math.round)
          .fold(function (t) { return t.toString(); });
        document.getElementById('timeDisplay').innerHTML = "Time left: " + timeLeft + " min(s)";
      }, 60000 * 5); // check every 5 minutes
    };
    window.onload = function () {
      Object.assign(window, {
        saveIntervalTime: saveIntervalTime,
        testNotification: testNotification
      });
      init();
      runTimer();
      document.getElementById('testButton').onclick = () => {
        testNotification()
      }
    };


    /***/ })
  /******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmEyOWIzOTBkYTJiZWQ2ZmM0YWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDM0RBLElBQUksT0FBZSxDQUFDO0FBQ3BCLElBQUksU0FBaUIsQ0FBQztBQUN0QixJQUFJLG1CQUEyQixDQUFDO0FBSWhDOzs7OztHQUtHO0FBQ0gsSUFBTSxJQUFJLEdBQUc7SUFDWCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBcUI7SUFDOUUsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDdEQsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdFLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFFeEUsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxD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Z0JBQWMsUUFBUSxZQUFTO0lBQ3BGLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUMsd0JBQXdCO0FBQ3hDLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ2QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDcEIsZ0JBQWdCLEVBQUUsZ0JBQWdCO1FBQ2xDLGdCQUFnQixFQUFFLGdCQUFnQjtLQUNuQyxDQUFDO0lBRUYsSUFBSSxFQUFFO0lBQ04sUUFBUSxFQUFFO0FBQ1osQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiYTI5YjM5MGRhMmJlZDZmYzRhYiIsImltcG9ydCB7IElOb3RpZmljYXRpb25PcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxubGV0IHRpbWVvdXQ6IG51bWJlcjtcbmxldCB0aW1lc3RhbXA6IG51bWJlcjtcbmxldCB0aW1lRGlzcGxheUludGVydmFsOiBudW1iZXI7XG5cbmRlY2xhcmUgY29uc3QgTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb247XG5cbi8qXG4gKiBAZGVzY3JpcHRpb24gU2V0dXAgdGltZXIgdmFsdWUgZm9yIGlucHV0IGlmIGFueSBoYXMgYmVlbiBwcmV2aW91c2x5IHNhdmVkIGluXG4gKiAgICAgICAgICAgICAgdGhlIGxvY2FsU3RvcmFnZSwgaWYgbm90IHRoZW4gc2V0IHRoZSBkZWZhdWx0IHRvIDIwIG1pbnMuIEFsc29cbiAqICAgICAgICAgICAgICBhc2sgZm9yIG5vdGlmaWNhdGlvbnMgcGVybWlzc2lvbiBpbiBjYXNlIGl0J3MgdGhlIGZpcnN0IHRpbWUgdXNpbmdcbiAqICAgICAgICAgICAgICB0aGUgYXBwIG9yIGlmIHBlcm1pc3Npb24gaGFzIGJlZW4gcHJldmlvdXNseSByZW1vdmVkXG4gKi9cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIGNvbnN0IHRpbWVySW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW50ZXJ2YWxUaW1lJykgYXMgSFRNTElucHV0RWxlbWVudFxuICBjb25zdCB0aW1lclRpbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaW50ZXJ2YWxUaW1lJylcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2ludGVydmFsVGltZScsICh0aW1lclRpbWUgPyB0aW1lclRpbWUgOiAyMCkudG9TdHJpbmcoKSlcbiAgdGltZXJJbnB1dC52YWx1ZSA9ICh0aW1lclRpbWUgPyBwYXJzZUludCh0aW1lclRpbWUsIDEwKSA6IDIwKS50b1N0cmluZygpXG5cbiAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSAnZ3JhbnRlZCcpIHtcbiAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKCkgPT4ge30pXG4gIH1cblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZURpc3BsYXknKS5pbm5lckhUTUwgPSBgVGltZSBsZWZ0OiAke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdpbnRlcnZhbFRpbWUnKX0gbWluKHMpYFxufVxuXG4vKlxuICogQGRlc2NyaXB0aW9uIFNhdmUgdGhlIHRpbWVyIHRpbWUgaW4gdGhlIGxvY2FsU3RvcmFnZSBhbmQgcmVydW4gdGhlIHRpbWVyLlxuICogICAgICAgICAgICAgIElmIHRoZXJlIHdhcyBhIHByZXZpb3VzIHRpbWVyIHNldHVwLCB3ZSBjbGVhciBpdC4gQWxzbyB1cGRhdGVcbiAqICAgICAgICAgICAgICB0aGUgdGV4dCBkaXNwbGF5aW5nIHRoZSB0aW1lIGxlZnQuXG4gKiBAcGFyYW0ge29iamVjdH0gZSAtIEZvcm0gc3VibWl0IGV2ZW50IHdoaWNoIHdlIHByZXZlbnQgZnJvbSBzdWJtaXR0aW5nIHRoZSBmb3JtLlxuICogICAgICAgICAgICAgICAgICAgICBXZSB1c2UgdGhpcyBpbnN0ZWFkIG9mIGEgYnV0dG9uIHdpdGggdHlwZSBvZiBidXR0b24gc28gdGhhdCB3ZVxuICogICAgICAgICAgICAgICAgICAgICBjYW4gdmFsaWRhdGUgdGhhdCB0aGUgdGltZXIgbnVtYmVyIGlzIG5vdCBsZXNzIHRoYW4gMC5cbiAqL1xuY29uc3Qgc2F2ZUludGVydmFsVGltZSA9IChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxuICBjb25zdCB0aW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludGVydmFsVGltZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2ludGVydmFsVGltZScsIHRpbWUudmFsdWUpXG4gIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZURpc3BsYXknKS5pbm5lckhUTUwgPSBgVGltZSBsZWZ0OiAke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdpbnRlcnZhbFRpbWUnKX0gbWluKHMpYFxuICBydW5UaW1lcigpXG4gIF9zaG93Q2hlY2ttYXJrKClcbn1cblxuLypcbiAqIEBkZXNjcmlwdGlvbiBTZXR1cCBhIHRpbWVvdXQgdG8gZGlzcGxheSBhIGRlc2t0b3AgTm90aWZpY2F0aW9uIGRlcGVuZGluZ1xuICogICAgICAgICAgICAgIHRoZSB0aW1lIHdlIHBpY2sgb24gdGhlIG51bWJlciBwaWNrZXJcbiAqL1xuY29uc3QgcnVuVGltZXIgPSAoKSA9PiB7XG4gIC8vIHRpbWUgc2hvdWxkIGJlIGluIG1pbnV0ZXMgdGhlcmVmb3JlIHdlIG5lZWQgdG8gY29udmVydCB0byBtaWxsaXNlY29uZHNcbiAgLy8gYnkgbXVsdGlwbHlpbmcgYnkgNjAwMDBcbiAgY29uc3QgdGltZXIgPSBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaW50ZXJ2YWxUaW1lJyksIDEwKSAqIDYwMDAwXG4gIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gIGNsZWFySW50ZXJ2YWwodGltZURpc3BsYXlJbnRlcnZhbClcbiAgcnVuVGltZUNoZWNrZXIoKVxuXG4gIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBjbGVhckludGVydmFsKHRpbWVEaXNwbGF5SW50ZXJ2YWwpXG4gICAgc2hvd05vdGlmaWNhdGlvbigpXG4gIH0sIHRpbWVyKVxufVxuXG4vKlxuICogQGRlc2NyaXB0aW9uIENoZWNrIGlmIE5vdGlmaWNhdGlvbiBwZXJtaXNzaW9uIGhhcyBiZWVuIGdyYW50ZWQgb3IgZGVuaWVkLiBJZiBncmFudGVkXG4gKiAgICAgICAgICAgICAgZ28gYWhlYWQgcnVuIHV0aWxpdHkgZnVuY3Rpb24gdGhhdCBzaG93cyBub3RpZmljYXRpb24sIGlmIGRlbmllZCB0aGVuXG4gKiAgICAgICAgICAgICAgYXNrIGZvciBwZXJtaXNzaW9uLlxuICovXG5jb25zdCBzaG93Tm90aWZpY2F0aW9uID0gKCkgPT4ge1xuICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gPT09ICdncmFudGVkJykge1xuICAgIF9zZXR1cE5vdGlmaWNhdGlvbigpXG4gIH0gZWxzZSBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09ICdkZW5pZWQnKSB7XG4gICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKChwZXJtaXNzaW9uKSA9PiB7XG4gICAgICBpZiAocGVybWlzc2lvbiA9PT0gJ2dyYW50ZWQnKSB7XG4gICAgICAgIF9zZXR1cE5vdGlmaWNhdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG4vKlxuICogQGRlc2NyaXB0aW9uIFNob3cgZGVza3RvcCBOb3RpZmljYXRpb24gYW5kIHBsYXkgQXVkaW8uIFNldHVwIG9uY2xpY2sgaGFuZGxlclxuICogICAgICAgICAgICAgIGZvciBOb3RpZmljYXRpb24gd2hpY2ggZ2V0cyB0cmlnZ2VyZWQgd2hlbiB0aGUgTm90aWZpY2F0aW9uIHRvYXN0ZXJcbiAqICAgICAgICAgICAgICBnZXRzIGNsb3NlZCB3aGljaCB0aGVuIHNldHVwcyBhIG5ldyB0aW1lciBmb3IgbmV4dCBub3RpZmljYXRpb24uXG4gKi9cbmNvbnN0IF9zZXR1cE5vdGlmaWNhdGlvbiA9ICgpID0+IHtcbiAgbmV3IEF1ZGlvKCdhc3NldHMvY29pbnMubXAzJykucGxheSgpXG5cbiAgY29uc3Qgb3B0aW9uczogSU5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XG4gICAgYm9keTogJ01vdmUgYSBsaWwhJyxcbiAgICByZXF1aXJlSW50ZXJhY3Rpb246IHRydWUsXG4gIH1cblxuICBjb25zdCBub3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKCdBcnJpdmEhJywgb3B0aW9ucylcbiAgbm90aWZpY2F0aW9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVEaXNwbGF5JykuaW5uZXJIVE1MID0gYFRpbWUgbGVmdDogJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaW50ZXJ2YWxUaW1lJyl9IG1pbihzKWBcbiAgICBub3RpZmljYXRpb24uY2xvc2UoKVxuICAgIHJ1blRpbWVyKClcbiAgfVxufVxuXG4vKlxuICogQGRlc2NyaXB0aW9uIFNob3dzIGEgTm90aWZpY2F0aW9uIGFuZCBwbGF5cyBhbiBBdWRpbyB0byBtYWtlIHN1cmVcbiAqICAgICAgICAgICAgICBkZXNrdG9wIG5vdGlmaWNhdGlvbnMgYXJlIHdvcmtpbmdcbiAqL1xuY29uc3QgdGVzdE5vdGlmaWNhdGlvbiA9ICgpID0+IHtcbiAgICBuZXcgQXVkaW8oJ2Fzc2V0cy9jb2lucy5tcDMnKS5wbGF5KClcbiAgICBuZXcgTm90aWZpY2F0aW9uKCdBcnJpYmEhJywge1xuICAgICAgICBib2R5OiAnTW92ZSBhIGxpbCEnXG4gICAgfSlcbn1cblxuLypcbiAqIEBkZXNjcmlwdGlvbiBVdGlsaXR5IGZ1bmN0aW9uIHRvIHRvZ2dsZSBhIGNoZWNrbWFyayB3aGVuIHNhdmluZyBhIHRpbWVyXG4gKi9cbmNvbnN0IF9zaG93Q2hlY2ttYXJrID0gKCkgPT4ge1xuICBjb25zdCBjaGVja21hcmtFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGVja21hcmsnKVxuICBjaGVja21hcmtFbC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgY2hlY2ttYXJrRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICB9LCAxMDAwKVxufVxuXG4vKlxuICogQGRlc2NyaXB0aW9uIFNldHMgdXAgYW4gaW50ZXJ2YWwgdG8gcnVuIGV2ZXJ5IDUgbWlucyB0byB1cGRhdGUgdGhlIHRpbWUgbGVmdFxuICogICAgICAgICAgICAgIGJlaW5nIGRpc3BsYXllZC5cbiAqL1xuY29uc3QgcnVuVGltZUNoZWNrZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHRpbWVCb3ggPSAodGltZSkgPT4gKHtcbiAgICBtYXA6IGYgPT4gdGltZUJveChmKHRpbWUpKSxcbiAgICBmb2xkOiBmID0+IGYodGltZSksXG4gIH0pXG4gIHRpbWVEaXNwbGF5SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgY29uc3QgaW50ZXJ2YWxUaW1lID0gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ludGVydmFsVGltZScpLCAxMClcbiAgICBjb25zdCB0aW1lTGVmdCA9IHRpbWVCb3gobmV3IERhdGUoKS5nZXRUaW1lKCkpXG4gICAgICAgICAgICAgICAgICAgICAubWFwKHQgPT4gdCAtIHRpbWVzdGFtcCkgLy8gZ2V0IHRoZSB0aW1lIGxhcHNlZFxuICAgICAgICAgICAgICAgICAgICAgLm1hcCh0ID0+IHQgLyA2MDAwMCkgLy8gY29udmVydCBtaWxscyB0byBtaW5zXG4gICAgICAgICAgICAgICAgICAgICAubWFwKHQgPT4gaW50ZXJ2YWxUaW1lIC0gdCkgLy8gZ2V0IHRpbWUgbGVmdCB0aWxsIG5leHQgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAubWFwKE1hdGgucm91bmQpXG4gICAgICAgICAgICAgICAgICAgICAuZm9sZCh0ID0+IHQudG9TdHJpbmcoKSlcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lRGlzcGxheScpLmlubmVySFRNTCA9IGBUaW1lIGxlZnQ6ICR7dGltZUxlZnR9IG1pbihzKWBcbiAgfSwgNjAwMDAgKiA1KSAvLyBjaGVjayBldmVyeSA1IG1pbnV0ZXNcbn1cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgICBzYXZlSW50ZXJ2YWxUaW1lOiBzYXZlSW50ZXJ2YWxUaW1lLFxuICAgIHRlc3ROb3RpZmljYXRpb246IHRlc3ROb3RpZmljYXRpb25cbiAgfSlcblxuICBpbml0KClcbiAgcnVuVGltZXIoKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4udHMiXSwic291cmNlUm9vdCI6IiJ9
