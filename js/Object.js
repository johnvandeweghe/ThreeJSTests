/*
	Wraps a ThreeJS object
*/
Sim.Object = function(object, m, v, F){
	this.threeJSObject = object;
	//px / s
	this.velocity = v || new THREE.Vector3();
	this.forces = F || {};
	this.mass = m || 1;

	this.netForce = function(){
		var netForce = new THREE.Vector3();
		for(var f in this.forces){
			netForce.add(this.forces[f]);
		}
		return netForce;
	}

	this.collidingObjects = function(){
		var collisions = {};
		for(var f in this.forces){
			var fSplit = f.split('_');
			var forceName = fSplit.shift();
			var obj = fSplit.join('_');
			if(forceName == 'normal' && this.forces[f].length()){
				collisions[obj] = false;
			}
		}
		return collisions;
	}
}