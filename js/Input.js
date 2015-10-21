Sim.Input = function(){
	this.bindCamera = function(){
        this.bind(87, function () {
            if (this.camera.rotation.y != 0 && this.camera.rotation.y != Math.PI)
                this.camera.position.x -= Math.sin(this.camera.rotation.y) / 4;
            if (this.camera.rotation.y != Math.PI / 2 && this.camera.rotation.y != 3 * Math.PI / 2)
                this.camera.position.z -= Math.cos(this.camera.rotation.y) / 4;
        });
        this.bind(83, function () {
            if(this.camera.rotation.y != 0 && this.camera.rotation.y != Math.PI)
                this.camera.position.x += Math.sin(this.camera.rotation.y)/4;
            if(this.camera.rotation.y != Math.pi/2 && this.camera.rotation.y != 3*Math.PI/2)
                this.camera.position.z += Math.cos(this.camera.rotation.y)/4;
        });
        this.bind(65, function () {
            var theta2 = this.camera.rotation.y-Math.PI/2;
            if(theta2 != 0 && theta2 != Math.PI)
                this.camera.position.x += Math.sin(theta2)/4;
            if(theta2 != Math.PI/2 && theta2 != 3*Math.PI/2)
                this.camera.position.z += Math.cos(theta2)/4;
        });
        this.bind(68, function () {
            var theta2 = this.camera.rotation.y+Math.PI/2;
            if(theta2 != 0 && theta2 != Math.PI)
                this.camera.position.x += Math.sin(theta2)/4;
            if(theta2 != Math.PI/2 && theta2 != 3*Math.PI/2)
                this.camera.position.z += Math.cos(theta2)/4;
        });
        this.bind(81, function () {
            this.camera.rotation.y += Math.PI * .0125;
        });
        this.bind(69, function () {
            this.camera.rotation.y -= Math.PI * .0125;
        });
        this.bind(32, function(){
            this.camera.position.y += .25;
        });
        this.bind(16, function(){
            this.camera.position.y -= .25;
        });
	};

	this.render = function(sim){
		for(var key in keysPressed){
			if(keysPressed[key] && keyEvents[key]){
				keyEvents[key].apply(sim, []);
			}
		}
	};

	var keysPressed = {};
    var keyEvents = {};

    this.bind = function(keyCode, handler){
        keyEvents[keyCode] = handler;
    };

	document.addEventListener('keydown', function(e){
		console.log(e);
        if(keyEvents[e.keyCode]) {
            keysPressed[e.keyCode] = true;
            e.preventDefault();
        }
	});
	document.addEventListener('keyup', function(e){
		console.log(e);
        if(keyEvents[e.keyCode]) {
            keysPressed[e.keyCode] = false;
            e.preventDefault();
        }
	});
}