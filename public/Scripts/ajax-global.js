var ajaxCalls = 0;
var loaderShowed = false;

$(document).ajaxSend(function () {
    ajaxCalls++;
    if (!loaderShowed) {
        loaderShowed = true;
        Loader.Show("content");
    }
});

$(document).ajaxComplete(function () {
    ajaxCalls--;
    if (ajaxCalls <= 0 && loaderShowed) {
        loaderShowed = false;
        Loader.Hide("content");
    }
});