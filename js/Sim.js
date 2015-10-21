var Sim = function(){
	var scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 100 );
	this.camera.position.y = 6;
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var light = new THREE.HemisphereLight(0xFFFFFF, 0x000000); // soft white light
	scene.add( light );

	this.input = new Sim.Input();

	var objects = {};
	var tracking = [];

	var COLORS = {
		'velocity': 0x0088FF,
	};

	this.addObject = function(name, obj){
		objects[name] = obj;
		scene.add(obj.threeJSObject);
	};

	this.trackObject = function(name, options){
		var defaultOptions = {
			'velocity': true,
			'position': true,
			'forces': {
				'gravity': true,
				'normal': true,
			}
		};
		options = $.extend(true, defaultOptions, options);
		tracking.push({
			'name': name,
			'options': options
		});
	};

	this.manipulateObject = function(name, action){
		action.apply(objects[name]);
	};

	var findObjectKey = function(obj){
		for(var o in objects){
			if(obj.id == objects[o].threeJSObject.id){
				return o;
			}
		}
	};

	var lastTime = window.performance.now();

	var applyLinearMotion = function(){
		for(var o in objects){
			var now = window.performance.now();
			var time = (now - lastTime)/1000;
			lastTime = now;
			if(time <= 0)
				return;

			//Calculate acceleration from forces and mass F=ma
			objects[o].velocity.add(objects[o].netForce().multiplyScalar(time/objects[o].mass));


			if(objects[o].velocity.length()){

				var velocity = objects[o].velocity.clone().multiplyScalar(time);
				var distance = velocity.length();
				var direction = velocity.clone().normalize();

				var collisions = objects[o].collidingObjects();

				for(var v in objects[o].threeJSObject.geometry.vertices){
					var vertexPosition = objects[o].threeJSObject.position.clone().add(objects[o].threeJSObject.geometry.vertices[v]);

					var rc = new THREE.Raycaster(vertexPosition, direction, 0, distance);

					var hits = rc.intersectObjects(scene.children);
					for(var hit in hits){
						var simObj = findObjectKey(hits[hit].object);
						if(simObj != o){
							console.log('Collision with ' + simObj);
							collisions[simObj] = true;

							//Let's apply some *gap filling behavior*
							//var tooFarDistance = hits[hit].point.sub(vertexPosition.clone().add(velocity));
							//var distanceLeft = velocity.clone().add(tooFarDistance);
							//console.log(velocity);
							//console.log(distanceLeft);
							//objects[o].threeJSObject.position.add(distanceLeft);		
						}
					}
				}

				for(var c in collisions){
					if(!collisions[c]){
						console.log('End Collision with ' + c);
						objects[o].forces['normal_' + c].copy(new THREE.Vector3());
						objects[c].forces['normal_' + o].copy(new THREE.Vector3());
					} else {
						//Momentum? What's that?
						objects[o].velocity.copy(new THREE.Vector3());
						objects[c].velocity.copy(new THREE.Vector3());

						//add normal force
						objects[o].forces['normal_' + c].copy(objects[o].forces['gravity_' + c].clone().negate());
						objects[c].forces['normal_' + o].copy(objects[c].forces['gravity_' + o].clone().negate());
					}
				}

				var newPosition = objects[o].threeJSObject.position.clone().add(objects[o].velocity.clone().multiplyScalar(time));
				objects[o].threeJSObject.position.copy(newPosition);
			}
		}
	};

	var updateGravitationalForces = function(){
		for(var o in objects){
			for(var oo in objects){
				if(oo == o){
					continue;
				}
				var distanceSquared = objects[oo].threeJSObject.position.distanceToSquared(objects[o].threeJSObject.position);
				var direction = objects[oo].threeJSObject.position.clone().sub(objects[o].threeJSObject.position);
				var massProduct = objects[oo].mass * objects[o].mass;

				objects[o].forces['gravity_' + oo] = direction.setLength(massProduct / distanceSquared);
				if(typeof objects[o].forces['normal_' + oo] === 'undefined')
					objects[o].forces['normal_' + oo] = new THREE.Vector3();
			}
		}
	}

	var renderDebug = function(){
		var debugLines = [
			"Camera:",
			"X: " + self.camera.position.x.toFixed(2) + " Y: " + self.camera.position.y.toFixed(2) + " Z: " + self.camera.position.z.toFixed(2) + " R: " + (self.camera.rotation.y.toFixed(3) % Math.PI),
		];

		for(var track in tracking){
			var obj = objects[tracking[track].name];
			var opts = tracking[track].options;
			debugLines.push(tracking[track].name + ':');
			debugLines.push("X: " + obj.threeJSObject.position.x.toFixed(2) + " Y: " + obj.threeJSObject.position.y.toFixed(2) + " Z: " + obj.threeJSObject.position.z.toFixed(2))
			if(opts['velocity']){
				debugLines.push('V: ' + obj.velocity.length());
				if(obj.velocity.length()){
					var arrowHelper = new THREE.ArrowHelper(obj.velocity.clone().normalize(), obj.threeJSObject.position, obj.velocity.length(), COLORS.velocity);
					scene.add( arrowHelper );
					setTimeout(function(){
						scene.remove(arrowHelper);
					}, 5000);
				}
			}

			for(var force in obj.forces){
				debugLines.push(force + ': ' + obj.forces[force].length());
			}

			var collidingObjects = '';
			for(var o in obj.collidingObjects()){
				collidingObjects += o + ', ';
			}
			debugLines.push(collidingObjects);
		}

		var debugOutput = '';

		for(var line in debugLines){
			debugOutput += debugLines[line] + '<br />';
		}

		$('#overlay').html(debugOutput);
	};

	var stop = false;
	var softStop = false;

    var self = this;

	var render = function () {
		if(!stop)
			requestAnimationFrame( render );

		self.input.render(self);
		//light.position.set(camera.position.x, camera.position.y, camera.position.z);

		if(!softStop){
			updateGravitationalForces();
			applyLinearMotion();
		}

		renderDebug();

		renderer.render(scene, self.camera);
	};

	render();

	this.kill = function(){
		stop = true;
	}
}