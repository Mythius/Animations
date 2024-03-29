function Animation(element,imgs,frame_count){
	var frames=[],curr_frame=0;
	var frLists=[],animID=0;
	var img = element;
	var isLoop=true,isPlaying=false;
	var fps=30;
	frLists.push(range(0,frame_count));
	frLists.push(range(0,frame_count).reverse());
	var n = (''+frame_count).length;
	frames = imgs;
	element.src=frames[0];
	this.addCustom=function(array){
		frLists.push(array);
		return frLists.length-1;
	}
	this.playForward=function(isl){
		animID=0;
		curr_frame=0;
		isLoop=isl;
		loop();
	}
	this.playBackward=function(isl){
		animID=1;
		curr_frame=0;
		isLoop=isl;
		loop();
	}
	function loop(){
		isPlaying=true;
		if(curr_frame>=frLists[animID].length){
			if(isLoop){
				curr_frame=0;
				loop();
			} else {
				isPlaying=false;
				cancelAnimationFrame(loop);
				img.src=frames[frLists[animID][frLists[animID].length-1]];
			}
		} else {
			setTimeout(function(){
				requestAnimationFrame(loop);
			},1000/fps);
			var t = frLists[animID][curr_frame];
			img.src=frames[t];
			var mainch = obj('main').children;
			for(let m of mainch) m.style.borderColor='';
			if(mainch[t]) mainch[t].style.borderColor='black';
			curr_frame++;
		}
	}
	this.getImage=()=>img;
	this.setFPS=function(f){fps=f;}
	this.playCustom=function(c,isl){
		if(c<frLists.length){
			animID=c;
			curr_frame=0;
			isLoop=isl;
			loop();
		}
	}
	this.stop=function(){
		cancelAnimationFrame(loop);
		isPLaying=false;
		isLoop=false;
		img.src=frames[frLists[animID][frLists[animID].length-1]];
		curr_frame=frLists[animID].length;
	}
	this.getFrame=()=>curr_frame;
	this.isLoop=()=>isLoop;
	this.isPlaying=()=>isPlaying;
}