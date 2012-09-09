chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.method === "getSelection")
            sendResponse({data: window.getSelection().toString()});
        else
            sendResponse({data: "unknown request.method:" + request.method});
    });

!function($) {
    $.fn.makeDpop = function() {
        $(this).each(function() {
            $(this).mousedown(function(e){
                var d = $(this).parent().parent().parent().parent().parent().parent();
                var dx = d.offset().left;
                var dy = d.offset().top;
                var xgap = e.pageX-dx;
                var ygap = e.pageY-dy;
                if (!$.browser.msie) {
                    e.preventDefault();
                }
                $(document).mousemove(function(e){
                    var x = e.pageX-xgap;
                    var y = e.pageY-ygap;
                    if ($.browser.msie) {
                        // IE only here
                        e.preventDefault();  //IE's
                        if(e.pageX >= 0 && e.pageY >= 0) d.css({left: x, top: y });
                        return false;
                    }
                    // FF only here
                    if(e.pageX >= 0 && e.pageY >= 0) d.css({left: x, top: y });
                    return true;
                });
            }).mouseup(function(e){ $(document).unbind('mousedown');$(document).unbind('mousemove');});
        });
    }
}($);


$(function() {
    //$('div.article').css('border', 'solid 1px blue');
    //$('div.article').makeDpop();
});

console.log("good to go!");