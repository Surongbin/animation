'use strict';

/**
 * 预加载图片函数
 * @param {Object} images  加载图片的数组或对象
 * @param {Object} callback 全部图片加载完毕后回调函数
 * @param {Object} timeout  加载超时的时长
 */
function loadImage(images,callback,timeout){
	//加载完成图片的技术器
	var count = 0;
	//全部图片加载成功的标志位
	var success = true;
	//超时timer的id
	var timeoutId = 0;
	//是否加载超时的标志位
	var isTimeout = false;
	
	//对图片数组或对象遍历
	for(var key in images){
		//过滤prototype上的属性
		if(!images.hasOwnProperty(key)){
			continue;
		}
		//获得每个图片元素
		//期望格式是个object:{src:xxx}
		var item = images[key];
		
		if(typeof item === 'string'){
			item = images[key] = {
				src:item
			}
		}
		
		//格式不满足期望
		if(!item || !item.src){
			continue;
		}
		
		//计数+1
		count++;
		//设置图片元素的id
		item.id = '__img__'+key+getId();//不同调用，保证id不一样
		
		//设置图片元素的img,它是一个Image对象
		item.img=window[item.id] = new Image();
		
		doLoad(item);
	}
	//遍历完成如果计数为0则直接调用回调函数callback
	if(!count){
		callback(success);
	}else if(timeout){
		timeoutId = setTimeout(onTimeout,timeout)
	}
	
	/**
	 * 真正进行图片加载的函数
	 * @param {Object} item 图片元素对象
	 */
	function doLoad(item){
		item.status = 'loading';
		
		var img = item.img;
		//定义图片加载成功的回调函数
		img.onLoad = function(){
			success = success & true;
			item.status = 'loaded';
			done();
		};
		//定义图片加载失败的回调函数
		img.onerror=function(){
			success = false;
			item.status = 'error';
			done();
		}
		//发起一个http/https的请求
		img.src = item.src;
		/**
		 * 每张图片加载完成的回调函数
		 */
		function done(){
			img.onload = img.onerror = null;
			//有的低版本ie会报错，所以用try
			try{
				delete window[item.id];
			}catch(e){
				
			}
			
			//每张图片加载完成，计数器-1，当所有图片加载完成且没有超时的情况
			//清除超时计时器，且执行回调
			if(!--count && !isTimeout){//当count变为0,表示全部加载完成
				clearTimeout(timeoutId);
				callback(success);
			}
		}
	}
	
	/**
	 * 超时函数
	 */
	function onTimeout(){
		isTimeout = true;
		callback(false);
	}
}

var __id = 0;

function getId(){
	return ++__id;
}

module.exports = loadImage;
