// Google API loader for React app
// This file loads the Google API client library asynchronously
(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript';
  po.async = true;
  po.src = 'https://apis.google.com/js/api.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();
