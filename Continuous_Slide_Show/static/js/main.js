require.config(
{
	paths: 
	{
		"jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min",
		"bootstrap":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",
		"cslide":"lib/modules/Continuous_Slide_Show",
	}
}
);

require(['jquery'], function() {

	require(['bootstrap','cslide'], function() {} );

});

