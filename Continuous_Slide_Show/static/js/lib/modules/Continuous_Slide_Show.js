function multipleSlide(slideDirection,mainBody,DOM)
{
	var arrWidth = [];
	var totalSum = 0;
	var  len;
	var active;
	
	// The length of innerSlideBody which is the visibile part of the slide 
	var visibile_width = $(".outerSlideBody[data-name='"+mainBody+"']").children(".innerSlideBody").width();
	
	$(".outerSlideBody[data-name='"+mainBody+"']").children(".innerSlideBody").children(".slider").each(function( index, element  ) 
	{
		 arrWidth[index]=$( element ).width();
		 
		 // total length of the all the slides combined together
		 totalSum = totalSum + arrWidth[index];
		 
		 // total number of slides
		 len = index + 1;
		 
		 // first visible slide in the innerSlideBody
		 if( $(element).attr('data-active')==1 )
		 {
			 active = index;
		 }
		
	});
	
	// run function only if slides are hidden that is total Sum of all slides should be greater then visibile part of the slide main body ( innerSlideBody )
	if (totalSum > visibile_width)
	{

		// new_weight_sum
		var n_ws =0;
		var break_weight= 0;
		
		// to hold index of slide which becomes the new active slide i.e the first visibile slide in innerSlideBody
		var new_active=0;

		// slide control for "prev" ( i.e previous ) is clicked
		if(slideDirection=='prev')
		{
			if(active > 0 && active < ( len -1 ) )
			{

		
				// Start suming the width of slide from first hidden slide from left 
				for( i=active-1; i > -1; i--)
				{
					// check when the collective width of is more the total visible width
					// get the index of the left most slide which of group of slide needs to be made visibile
					if (n_ws + arrWidth[i] > visibile_width )
					{
						new_active = i+1;
						break_weight = n_ws;
						break;
					}
					n_ws = n_ws + arrWidth[i];
				}

				// calculate the distance from inital postion to the left most slide of the group
				n_ws =0 ;
				for(i=0;i<new_active;i++)
				{
					n_ws = n_ws + arrWidth[i];
				}

				$(".outerSlideBody[data-name='"+mainBody+"']").children(".innerSlideBody").children(".slider").each(function( index, element  ) 
				{
					// Set the "data-active" of left most slide of the visbile group to 1 
					if(index == new_active)
					{
						$(element).attr('data-active',1);
					}
					else 
					{
						$(element).attr('data-active',0);
					}
					
					// callback function sets the control back to active once the animation is done
					$( element ).animate({"left":(- n_ws).toString()+"px"},  function(){ $(DOM).attr('data-active',1);	 });
			
				});
			} 
			else if (active == (len -1))
			{
				// this special case as the active slide is in the right side of the screen
				// we first calculate the amount of visibile slide width and 
				//  after that we calculate the new amount  of slide to be made visible
				for( i=active; i > -1; i--)
				{
					if ( n_ws + arrWidth[i] > visibile_width )
					{
						new_active = i;	
						break_weight = n_ws;
						n_ws =0 ;
						break;
					}
			
					n_ws = n_ws + arrWidth[i];
				}
		
				for( i=new_active; i > -1; i--)
				{
					if (n_ws + arrWidth[i] > visibile_width )
					{
						new_active = i+1;
						break;
					}
					n_ws = n_ws + arrWidth[i];
				}
				
				// total width to be added is the amout of  width needs to be made visible subtracted
				//  by the amount of space left in the total visbile width minus already visibile slides width
				// bit tricky but makes sense
				break_weight = n_ws - (visibile_width - break_weight) ;

				$(".outerSlideBody[data-name='"+mainBody+"']").children(".innerSlideBody").children(".slider").each(function( index, element  ) 
				{
			
					if(index == new_active)
					{
						$(element).attr('data-active',1);
					}
					else 
					{
						$(element).attr('data-active',0);
					}

					$( element ).animate({"left":( parseFloat( $( element ).css("left").split("px")[0]) + break_weight).toString()+"px"},  function(){ $(DOM).attr('data-active',1);	 }); 

				});
			
			}
			else
			{
				$(DOM).attr('data-active',1);
			}
		
		}
		// slide control for "next" is clicked
		else
		{
			if( active < len-1 )
			{
				new_active=len-1;
				var flag=0;
		
				// get width for new goup of slides to be made visible
				for( i=active; i<len; i++)
				{
					if (flag == 0 && (n_ws + arrWidth[i] > visibile_width ))
					{
						new_active = i;
						break_weight = n_ws;
						n_ws =0 ;
						flag=1;
					}
					n_ws = n_ws + arrWidth[i];
				}
				
				// check if there is enough remaing slides ( n_ws ) that can cover visibile_width
				//  break_weight is less the remaing slides width ( n_ws )
				if( n_ws > visibile_width &&  break_weight < n_ws )
				{
					n_ws = break_weight;
				}
				else
				{	
					// if the above case is false that means the remaing slide width is not sufficient to cover visibile_width 
					// if it was subtracted entirely
					// Check the remaing slide 
					n_ws = n_ws - (visibile_width - break_weight);
					new_active=len-1;
				}
				
				$(".outerSlideBody[data-name='"+mainBody+"']").children(".innerSlideBody").children(".slider").each(function( index, element  ) 
				{
					$( element ).animate({"left":( parseInt( $( element ).css("left").split("px")[0]) - n_ws).toString()+"px"},  function(){ $(DOM).attr('data-active',1);	 }) ; 
					
					if(index == new_active)
					{
						$(element).attr('data-active',1);
					}
					else 
					{
						$(element).attr('data-active',0);
					}
			
				});
			}
			else
			{
				$(DOM).attr('data-active',1);
			}
	

		}
	
	}
	else
	{
		$(DOM).attr('data-active',1);
	}
	
}


$(document).ready(function()
{
	
	$(".silde-control").click(function()
	{
		var flag=0;
		
		// Making sure that two function threads are not working on same slide body 
		// as animation can take time and user might click the slide-controls multiple
		// times which can destory the alignment of the slides respect to the inital position 
		if($(this).attr('data-active') == 1)	
		{
			flag=1;
			$(this).attr('data-active',0);	
		}
		
		// mainBody's data-name which is the parent div
		// tell us the name of slide body which needs to be manipulated as there can be multiple number of such slide system
		var mainBody = $(this).parent().attr('data-name');
		
		// tells which direction we have to slide in
		var slideDirection = $(this).attr('data-slide');
		
		// call the function only if no function is acting on it 
		// data-active of slide-control is set back to 1 when the animation is done hence it as callback function to do so
		if(flag==1)	
		{
			multipleSlide(slideDirection,mainBody,this);
		}
		
	});
	
});
