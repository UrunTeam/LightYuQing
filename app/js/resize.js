/* 自适应js */
var zoomO = 1920 / 1080,
  ddw = document.documentElement.clientWidth,
  ddh = document.documentElement.clientHeight,
  zoomNow = ddw / ddh,
  zoomNum = 1;

function ResizeChat() {
  if (zoomNow > zoomO) {
    var newW = 1920 * ddh / 1080;

    zoomNum = newW / 1920;
  }
  else {
    var newH = 1080 * ddw / 1920;

    zoomNum = newH / 1080;
  }
  $('html').css('font-size', 625 * zoomNum + '%');
}
ResizeChat();
$(window).resize(function (event) {
  var zoomO = 1920 / 1080,
    ddw = document.documentElement.clientWidth,
    ddh = document.documentElement.clientHeight,
    zoomNow = ddw / ddh,
    zoomNum = 1;

  function ResizeChat() {
    if (zoomNow > zoomO) {
      var newW = 1920 * ddh / 1080;

      zoomNum = newW / 1920;
    }
    else {
      var newH = 1080 * ddw / 1920;

      zoomNum = newH / 1080;
    }
    $('html').css('font-size', 625 * zoomNum + '%');
  }
  ResizeChat();

});
    /* 自适应js end */