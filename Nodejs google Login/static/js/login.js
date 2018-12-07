

$(document).ready(function()
{

	$('#registerButton').on('click',function(){
		
		$('#signUpDiv').css({'display':'flex'});
	});

	function HideSignUp()
 	{
		$("#signUpDiv").css({"display":"none"});
 	}

 	$("#signUpDiv").on('click',function(e){

 		if(e.target != this)
 			return;
 		HideSignUp();
 	});


 	$("#googlebutton").on('click',function(){

 			window.location.href = "http://"+window.location.hostname+":"+window.location.port+"/googleSignin"; 
 	});



});
