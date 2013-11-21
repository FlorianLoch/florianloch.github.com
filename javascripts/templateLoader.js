/*	Nice little script for loading content requested via AJAX
  	into the currents page #CONTENT. Calls error page if AJAX-request fails and displays an error message
  	if even the error-page-request fails.

  	Fires a jQuery "contentLoaded" event on document after content has been loaded and displayed.

    Images (or other stuff that gets loaded after first rendering) should have width and height values
    in order to work some templates that calculate dimensions of layout via JavaScript.

    If no page argument is given or its value is is "" then the page "home.htm" will be loaded. If the the given page
    cannot be fetched "404.htm" will be displayed.

  Florian D. Loch, 05.11.2013
*/
  var fadeDuration = 300;
  var contentID = "#CONTENT";

  $(document).ready(function () {
/*  	$("body").css({
  		display: "none"
  	});*/

    $("#overlay").css({
      width: "100%",
      height: "100%",
      background: "black",
      "z-index": "1000",
      position: "fixed",
      opacity: "1",
      top: "0",
      left: "0"
    });

  	var errorPage = "404.htm";
  	var errorMsg = "<p>Could not load page - could not even load error page!</p>";

  	var page = undefined;
  	try {
  		page = window.location.search.match(/page=.*/).toString().match(/[^page=].*/).toString() + ".htm";
  	} catch (ex) {
  		console.log(ex);
  	}

  	if (page == undefined || page == "") {
  		page = "home.htm";
  	}

  	console.log(page);

  	$.ajax({
  		url: page,
  		type: "GET",
  		complete: function (jQXHR, sStatus) {
  			if (sStatus == "success") {
  				loadContentInBody(jQXHR.responseText);
  			}
  			else if (sStatus == "error") {
  				$.ajax({
  					url: errorPage,
  					type: "GET",
  					complete: function (jQXHR, sStatus) {					
  						if (sStatus == "success") {
  							loadContentInBody(jQXHR.responseText);
  						}
  						else if (sStatus == "error") {
  							loadContentInBody(errorMsg);
  						}
  					}
  				});
  			}
  		}
  	});
  });

  function loadContentInBody(sHTML) {
  	$(contentID).html(sHTML);

  	//Make content visible (but not visible for humans)
  	//Without this layouting would not work in some cases
/*  	$("#overlay").css({
  		display: 'block',
  		opacity: '0.1'
  	});*/

  	//Needed for some templates (that listen on the resize-event)
  	if (window.onresize != undefined) {
  		window.onresize();
  	}
  	$(window).trigger("resize");

  	//Fire event because loading and making visible (still content is not yet visible because of low opacity)
  	$(document).trigger("contentLoaded");

  	//Now make visible for humans
    $("#overlay").animate({
      opacity: 0.0
    }, fadeDuration, function () {
      $("body").css({
        overflow: "auto"
      });

      $("#overlay").css({
        display: "none"
      });
    });
  }