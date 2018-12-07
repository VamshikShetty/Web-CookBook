

$(document).ready(function()
{

	$('#logout').on('click',function(){
		
		//alert(window.location.hostname+window.location.port);
		window.location.href = "http://"+window.location.hostname+":"+window.location.port+"/logout";
	});


});
