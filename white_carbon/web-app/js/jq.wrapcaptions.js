/* 
$name:		JQ Captions
$version:	1.0
$filename:	jq.captions.js
$author:	ben@igoo
$modified:	2008/07/04 17:10
*/

$(document).ready(function()
{
	$("img.captionme").each(function(i) 
	{
		var captiontext = $(this).attr('title');
		$(this).wrap("<div class='imgpost'></div>");
		$(this).parent().append("<div class='thecaption'>" + captiontext + "</div>");		
	});
	
	$("img.captionme").hover( 
	  function () { 
		$(this).css('opacity','0.6');
		$(this).next().css('opacity','1.0');
		$(this).next().show();
	  },  
	  function () { 
		$(this).css('opacity','1.0');
		$(this).next().hide();
	  } 
	);
});