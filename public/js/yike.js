$(document).ready(function(){

	//时间转换
        function changeTime(date){
            var d = new Date(date);
            var tiems = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
             //+ ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
            return tiems;
        }

	//搜索
	$('.searup').on('click',function(evt){
		evt.preventDefault();
		//var action = $('.newslefft').attr('action');
		var $container = $('.sear');
		$container.html('逸刻');
		$.ajax({
			url: '/search',
			type: 'POST',
			data: $('.search').serialize(),
			success: function(data){
				if(data.success){
					var aa = data.context.vacation;
					console.log(aa)
					var html='';
					var tt = aa.map(function(i){
						html+="<div><img src='/vacation-photo/"+i.imgurl+"' style='width:60px;'/>"+i.name+
						"<a href='/search-detail?id="+i.id+"'>进入</a></div>";
						$container.html(html);
					})
					
				}
				else{
				$container.html('出现问题');
				}
			},
			error: function(){
				$container.html('出现问题');
			}
		});
	});

	//遍历获取未读信息数及最后通话信息
	$('.user').each(function(){
		var that = $(this);
		var id = $(this).find('.friendid').val();
		var $count = that.find('.count');
        var $news = that.find('.news');
        var $time = that.find('.nowtime');
        var count = $count.html();

		//获取未读数
		$.ajax({
			url: '/imsg',
			type: 'POST',
			data: {id:id},
			success: function(data){
				if(data.success){
					var count = data.rest;
					if(count>0){
						that.find('.count').html(count).css('display','block');

					}else{
						that.find('.count').html(0).css('display','none');
					}
				}else{
					console.log('查询失败');
				}
			}
		})

		//最后通话信息
		$.ajax({
			url: '/lastmsg',
			type: 'POST',
			data: {id:id},
			success: function(data){
				if(data.success){
					var count = data.result;
					$news.html(count.postMessages);
            		$time.html(changeTime(count.dateTime));
				}else{
					console.log('查询失败');
				}
			}
		})
	});

	//获取即时信息数
	var socket = io();
	var userid = $('.userid').val();
	socket.emit('login',userid); 
	//接收socket
	socket.on('addMsg',function(toid,msg,time){
            
            $('.user').each(function(){
            	var that = $(this);
            	var id = that.find('.friendid').val();
            	var $count = that.find('.count');
            	var $news = that.find('.news');
            	var $time = that.find('.nowtime');
            	var count = $count.html();
            	if(id==toid){
            		count++;
            		$count.html(count).css('display','block');
            		$news.html(msg);
            		$time.html(time);
            	}
            })
        });
});