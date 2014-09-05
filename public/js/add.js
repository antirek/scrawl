
$('#submit').click(function(){
	prepare();
	$('#formAddUrls').submit();
});


function prepare(){
	var lines = $('#urls').val().split('\n');
	var lines_new = [];
	
	$.each(lines, function(index, value){
		var str = value.trim();
		if(str != ''){		
			if(str.substr(0,7) != 'http://'){
				str = 'http://' + str;
			}
			lines_new.push(str);
		}
	});

	delete lines;
	$('#urls').val(lines_new.join('\n'));
}
