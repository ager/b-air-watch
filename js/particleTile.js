/*
 * Class to create a tile with particle animation and according texts
 */
function ParticleTile($container, data, $containerForStatisticsOutput) {
	this.WIDTH = 138;
	this.HEIGHT = 138;

	this.FOV = 45;
	this.ASPECT = this.WIDTH / this.HEIGHT;
	this.NEAR = 1;
	this.FAR = 1000;

	this.$container = $container;
	
	this.$containerForStatisticsOutput = $containerForStatisticsOutput;

	this.renderer = new THREE.WebGLRenderer();
	this.camera = new THREE.PerspectiveCamera(this.FOV, this.ASPECT, this.NEAR, this.FAR);
	this.scene = new THREE.Scene();

	this.scene.add(this.camera);
	this.camera.position.z = 200;

	this.renderer.setSize(this.WIDTH, this.HEIGHT);
	this.$container.append(this.renderer.domElement);

	this.particleSystems = new Array();

	
	/*
	 * 
	 */
	this.createParticles = function(data) {
		var pollution = data.data.children;
		for (var i=0; i < pollution.length; i++) {
			if (!$.isEmptyObject(pollution[i])) {
				var particleCount = 0;
				
				if (pollution[i].hasOwnProperty('average') && pollution[i].average != "---") {
					particleCount = pollution[i].average * 10;
				}
				
				var pMaterial = this.getParticleMaterial(COLORS[pollution[i].name], 125 / Math.pow(particleCount, 0.45));
				var particles = this.getVectorsAtRandomPositions(Math.pow(particleCount / 100, 3));
				var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
				this.particleSystems.push(particleSystem);
				this.scene.add(particleSystem);
				
				this.bindEventForStatistics();
			}
		}
	}
	
	/*
	 * 
	 */
	this.getVectorsAtRandomPositions = function(particleCount) {
		var particles = new THREE.Geometry();
		// create the individual particles
		for (var p = 0; p < particleCount; p++) {
			// create a particle with random position values, -250 -> 250
			var pX = Math.random() * 250 - 125;
			var pY = Math.random() * 250 - 125;
			var pZ = Math.random() * 250 - 125;
			var particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));
			particles.vertices.push(particle);
		}
		return particles;
	}
	
	/*
	 *
	 */
	this.getParticleMaterial = function(color, size) {
		return new THREE.ParticleBasicMaterial({
			color: color,
			size: size,
			map: THREE.ImageUtils.loadTexture("images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true
		});
	}
	
	this.bindEventForStatistics = function() {
		this.$container.on( 'mouseover', function() {
			$containerForStatisticsOutput.text(data.meta.address.street + " " + data.meta.address.zip + " " + data.meta.address.city);
		} );
		this.$container.on( 'mouseout', function() {
			$containerForStatisticsOutput.text("");
		} );
	}

	this.createParticles(data);
}
