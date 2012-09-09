function appendEntry(title, href, rating, numRaters) {
    var entryDiv = $("#entry-template").clone();
    entryDiv.removeAttr('id');
    
    var titleHtml = sprintf("<a href='%s'>%s</a>", href, title);
    $("span.title", entryDiv).html(titleHtml);
    if (numRaters > 0) {
        $("span.rate", entryDiv).html(rating);
        $("span.num-rater", entryDiv).html(sprintf(" (%d人评价)", numRaters));
    } else {
        $("span.num-rater", entryDiv).html((" (目前无人评价)"));
    }

    var neg = 10.0 - rating;
    var mod = Math.floor(neg * 10) % 10;
    if (mod >= 6) {
        var offset = -11 * Math.ceil(neg);
    } else {
        var offset = -11 * Math.floor(neg);
    }
    $("span.rate-star", entryDiv).css("background-position", sprintf("0 %dpx", offset));


    $("#entry-container").append(entryDiv);
    $(entryDiv).show();
}

function search() {
    var query = $("#query").val();
    console.log("doing query:" + query);
    var url = sprintf("http://api.douban.com/movie/subjects?q=%s&alt=json", query);
    $.ajax(url, { dataType: 'json',
                  success: function(data) {
                      $("#entry-container").html("");

                      $.each(data.entry, function() {
                          var title = this.title['$t'];
                          var href= $.grep(this.link, function(elem) {
                              return elem['@rel'] === 'alternate';
                          })[0]['@href'];
                          var rating = this["gd:rating"]["@average"];
                          var numRaters = this["gd:rating"]["@numRaters"];
                          appendEntry(title, href, rating, numRaters);
                      });
                      $("#log").html(sprintf("显示(%s)的搜索结果", query));
                  },
                });
}

$(function() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {method: "getSelection"}, function(response) {
            if (response.data) {
                $("#query").val(response.data.trim());
                search();
            }
        });
    });

    $("#query").keyup(function(event) {
        if (event.which == 13) {
            search();
        }
    });

    $("#entry-container").on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});



