// Copyright (C) 2013 Marcell Jusztin

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

$(document).ready(function() {

  var buddhaWorkerPool = new Array(10);
  var pixels = new Uint8ClampedArray(600 * 600 * 3);
  var samples = 0;

  for (var k = 0; k < 10; k++) {
    buddhaWorkerPool[k] = new Worker('/public/buddha_worker.js');
    buddhaWorkerPool[k].onmessage = function(event) {

      var canvas = document.getElementById("buddhaCanvas");
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      var ctx = canvas.getContext("2d");

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

      for (i = 0; i < canvasWidth; i++) {
        for (j = 0; j < canvasHeight; j++) {
          if (pixels[(j * canvasWidth + i) * 3 + 0] != event.data[(j * canvasWidth + i) * 3 + 0]) pixels[(j * canvasWidth + i) * 3 + 0] = Math.floor((pixels[(j * canvasWidth + i) * 3 + 0] + 2 * event.data[(j * canvasWidth + i) * 3 + 0]) / 3);
          if (pixels[(j * canvasWidth + i) * 3 + 1] != event.data[(j * canvasWidth + i) * 3 + 1]) pixels[(j * canvasWidth + i) * 3 + 1] = Math.floor((pixels[(j * canvasWidth + i) * 3 + 1] + 2 * event.data[(j * canvasWidth + i) * 3 + 1]) / 3);
          if (pixels[(j * canvasWidth + i) * 3 + 2] != event.data[(j * canvasWidth + i) * 3 + 2]) pixels[(j * canvasWidth + i) * 3 + 2] = Math.floor((pixels[(j * canvasWidth + i) * 3 + 2] + 2 * event.data[(j * canvasWidth + i) * 3 + 2]) / 3);
          canvasData.data[(j * canvasWidth + i) * 4 + 0] = pixels[(j * canvasWidth + i) * 3 + 0];
          canvasData.data[(j * canvasWidth + i) * 4 + 1] = pixels[(j * canvasWidth + i) * 3 + 1];
          canvasData.data[(j * canvasWidth + i) * 4 + 2] = pixels[(j * canvasWidth + i) * 3 + 2];
          canvasData.data[(j * canvasWidth + i) * 4 + 3] = 255;
        }
      }

      ctx.putImageData(canvasData, 0, 0);

      $('#sampleCounter span').text(++samples);
      if (samples == 10) {
        $('#generateButton').button('reset');
        $('#sampleCounter').addClass('label label-success');
        $('#sampleCounter').fadeOut(1000, function() {
          $('#sampleCounter').removeClass('label label-success');
        });
      }

    };
  }

  $('#sampleCounter').hide();

  $('#stageWidth').change(function() {
    $('#buddhaCanvas').attr('width', $(this).val());
    pixels = new Uint8ClampedArray($(this).val() * $('#stageHeight').val() * 3);
  });

  $('#stageHeight').change(function() {
    $('#buddhaCanvas').attr('height', $(this).val());
    pixels = new Uint8ClampedArray($('#stageHeight').val() * $(this).val() * 3);
  });

  $('#generateButton').click(function() {
    $(this).button('loading');
    $('#sampleCounter span').text(0);
    $('#sampleCounter').fadeIn(200);
    samples = 0;
    var w = $('#stageWidth').val();
    var h = $('#stageHeight').val();
    var s = $('#sampleSize').val() / 10;
    var r = $('#rLimit').val();
    var g = $('#gLimit').val();
    var b = $('#bLimit').val();
    for (var k = 0; k < 10; k++) {
      buddhaWorkerPool[k].postMessage([w, h, s * (k + 1), r, g, b]);
    }
  });

});
