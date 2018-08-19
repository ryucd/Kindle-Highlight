function kindleImport(){
    var textContents = chrome.extension.getBackgroundPage().textContents;

    var tmp_object = createTmpDOM(textContents);

    var div = document.getElementById('textView');

    var title = document.getElementById('annotation-scroller').getElementsByTagName('h3')[0].innerHTML;
    var author = document.getElementById('annotation-scroller').getElementsByClassName('a-spacing-none')[0].innerHTML;
    var highlights = document.getElementById('kp-notebook-annotations').getElementsByClassName('kp-notebook-row-separator');
    var content = "";

    removeTmpDOM(tmp_object);

    console.log("title:"+title);
    console.log("author:"+author);
    for(var i = 0; i < highlights.length; i++){
        console.log(highlights[i]);
        tmp = createTmpDOM(highlights[i].innerHTML);
        var header = document.getElementById('annotationHighlightHeader').innerHTML;
        var highlight = document.getElementById('highlight').innerHTML;
        console.log(header);
        console.log(highlight);
        content += "<p><span>"+header +'</span><br>' + highlight +'</p><hr>'
        removeTmpDOM(tmp);
    }

    return [title, author, content];
}

//div.textContent = ;

function createTmpDOM(text){
    var tmp_object = document.createElement('div');
    tmp_object.style.display = 'none';
    tmp_object.innerHTML = text;
    document.body.appendChild(tmp_object);
    return tmp_object;
}

function removeTmpDOM(tmp_object){
    document.body.removeChild(tmp_object);
}

//// OneNote

function sendToOneNote(access_token, title, text) {
    $.ajax({
       accept: "application/json",
       type: "POST",
       url: "https://www.onenote.com/api/v1.0/pages",
       headers: { "Authorization": "Bearer " + access_token },
       data: "<html><head><title style='font-family: Yu Gothic'>"+ title +"</title></head>" + 
           "<body style='font-family: Yu Gothic'>" + text + "" +
           "</body></html>",
       contentType: "text/html",
       success: function (data, status, xhr) {
           //alert(status);
       },
       complete: function (data, status, xhr) {
           alert(status);
       },
        error: function (request, status, error) {
           alert(status);
       }
    });

}

$('a#signout').click(function() {
	WL.init({
		client_id: "68593b94-315d-4b3d-92e3-269d36130df3",
		redirect_uri: "https://login.live.com/oauth20_desktop.srf",
		response_type: "token"
	});
	WL.logout();
	chrome.storage.local.remove("access_token");
	return false;
});

$('a#signin').click(function() {
    $('div#signin_status').text('');
    WL.init({
        client_id: "68593b94-315d-4b3d-92e3-269d36130df3",    // replace with your own Client ID!!
        redirect_uri: "https://login.live.com/oauth20_desktop.srf",
        response_type: "token"
    });
    WL.login({
        scope: ["wl.signin", "office.onenote_create"]
    });
    
    return false;
 
});

$('a#createOneNotePage').click(function() {

	chrome.storage.local.get("access_token", function(result) {
		if ( result.access_token != null ) {
            var [header, author, content] = kindleImport();
			sendToOneNote(result.access_token, header+' - '+author, content);
		} else {
			alert('Please sign in first before clicking this link.');
		}
	
	});
	return false;		// Don't forget to return false, otherwise the AJAX request will be cancelled.
});	
