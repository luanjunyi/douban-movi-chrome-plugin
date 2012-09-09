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
