var frame_count=10;
var dir = 'stickman';
var animation;
var saved = [] , imgnum , sources = [];
function getAnim(){
	var getname=e=>{
		return {src:e.src,num:e.num};
	};
	var anim = [...obj('main').querySelectorAll('img')].map(getname);
	return anim;
}
obj('#p').on('click',function(){
	if(animation){
		if(animation.isPlaying()){
			this.innerHTML = 'Play';
			animation.stop();
		} else {
			animation.playForward(true);
			this.innerHTML = 'Stop';
		}
	}
});
obj('#g').on('click',function(){
	obj('bottom').innerHTML='';
	obj('#p').innerHTML = 'Play';
	var a = getAnim();
	if(a.length>0){
		var c = create('img');
		if(animation) animation.stop();
		var AN = new Animation(c,a.map(e=>e.src),a.length);
		obj('#p').disabled = false;
		obj('#s').disabled = false;
		AN.setFPS(obj('#fps').value);
		obj('bottom').appendChild(c);
		animation = AN;
		imgnum = a.map(e=>e.num);
	} else {
		obj('#p').disabled = true;
		obj('#s').disabled = true;
	}
});
obj('#c').on('click',function(){
	if(animation) animation.stop();
	animation = null;
	obj('bottom').innerHTML = '';
	obj('main').innerHTML = '';
	obj('#p').disabled = true;
	obj('#s').disabled = true;
});
obj('#s').on('click',function(){
	let name = prompt('Enter Name for Animation');
	while (saved.filter(e=>e.name==name).length>0) name = prompt('Name in use, enter new Name');
	saveAnimation(imgnum,obj('#fps').value,name);
});
obj('#e').on('click',function(){
	var dirname = obj('#dirname').value;
	if(dirname.length>0){
		var output = {dirname,frames:saved,count:uniq};
		console.log(output);
		if(confirm('Only Export Once. Contunue?')) download('untitled.anims',JSON.stringify(output));
	} else {
		alert('Folder Name (where images are saved)');
		obj('#dirname').focus();
	}
});
obj('#read').on('click',function(){
	var file_obj = this.children[1];
	var once = true;
	upload(file_obj,text=>{
		saved=[];
		if(once){
			obj('right').innerHTML = '';
			once=false;
			var o = JSON.parse(text);
			obj('#dirname').value = o.dirname;
			for(let f of o.frames){
				saveAnimation(f.frames,f.fps,f.name);
			}
		}
	});
	file_obj.click();
})
// UPLOAD IMAGES
var uniq=0,added=true;
obj('#upload').on('click',function(){
	var uplobj = this.children[1];
	uplobj.on('change',function(){
		if(added){
			added=false;
			obj('left').innerHTML = '';
			saved = [];
			if(this.files){
				for(let f of this.files){
					var reader = new FileReader();
					reader.readAsDataURL(f);
					reader.onload = load;
				}
			}
		}
	});
	function load(e){
		let number = uniq++;
		var holder = create('imghold');
		var a = create('img');
		a.src = e.target.result;
		holder.appendChild(a);
		obj('left').appendChild(holder);
		sources.push(e.target.result);
		holder.on('click',function(){
			addImage(e.target.result,number);
		});
	}
	uplobj.click();
});
function saveAnimation(frames,fps,name){
	var OBJECT = {frames,name,fps};
	saved.push(OBJECT);
	let i = create('img');
	let c = create('cont');
	i.src = 'anim_symbol.png';
	c.appendChild(i);
	c.appendChild(create('p',name));
	contextmenu(c,n=>{
		let l = [...obj('right').children].indexOf(c);
		if(n=='Delete'){
			saved.splice(l,1);
			c.remove();
		} else if(n=='Rename'){
			var n = prompt('Enter new Name');
			OBJECT.name = '';
			while (saved.filter(e=>e.name==n).length>0) n = prompt('Name in Use. Enter a new Name');
			OBJECT.name = n;
			c.children[1].innerHTML = n;
		} else if(n=='Open'){
			obj('#p').disabled=true;
			obj('#s').disabled=true;
			obj('#fps').value = OBJECT.fps;
			obj('main').innerHTML = '';
			for(let s of frames){
				addImage(sources[s],s);
			}
		}
	},'Open','Delete','Rename');
	obj('right').appendChild(c);
}
function addImage(src,num){
	var img = create('img');
	img.src = src;
	img.num = num;
	img.on('click',function(){
		if(!animation || !animation.isPlaying()) this.remove();
	});
	obj('main').appendChild(img);
}