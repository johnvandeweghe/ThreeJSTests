function Movement(threejsobject){
	this.threejsobject = threejsobject;

	this.up = function () {
		if(this.threejsobject.rotation.y != 0 && this.threejsobject.rotation.y != Math.PI)
			this.threejsobject.position.x -= Math.sin(this.threejsobject.rotation.y)/4;
		if(this.threejsobject.rotation.y != Math.PI/2 && this.threejsobject.rotation.y != 3*Math.PI/2)
			this.threejsobject.position.z -= Math.cos(this.threejsobject.rotation.y)/4;
	};

	this.down = function () {
		if(this.threejsobject.rotation.y != 0 && this.threejsobject.rotation.y != Math.PI)
			this.threejsobject.position.x += Math.sin(this.threejsobject.rotation.y)/4;
		if(this.threejsobject.rotation.y != Math.pi/2 && this.threejsobject.rotation.y != 3*Math.PI/2)
			this.threejsobject.position.z += Math.cos(this.threejsobject.rotation.y)/4;
	};

	this.left = function () {
		theta2 = this.threejsobject.rotation.y-Math.PI/2;
		if(theta2 != 0 && theta2 != Math.PI)
			this.threejsobject.position.x += Math.sin(theta2)/4;
		if(theta2 != Math.PI/2 && theta2 != 3*Math.PI/2)
			this.threejsobject.position.z += Math.cos(theta2)/4;
	};

	this.right = function () {
		theta2 = this.threejsobject.rotation.y+Math.PI/2;
		if(theta2 != 0 && theta2 != Math.PI)
			this.threejsobject.position.x += Math.sin(theta2)/4;
		if(theta2 != Math.PI/2 && theta2 != 3*Math.PI/2)
			this.threejsobject.position.z += Math.cos(theta2)/4;
	};

	this.vup = function(){
		this.threejsobject.position.y += .25;
	};
	this.vdown = function(){
		this.threejsobject.position.y -= .25;
	};
}