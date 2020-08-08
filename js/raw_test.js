// SET UP RENDERER
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById("canvas3d"),antialias:true});
renderer.physicallyCorrectLights = true;      // these two settings are required for 
renderer.outputEncoding = THREE.sRGBEncoding; // certain gltf features or extensions
renderer.setSize(window.innerWidth, window.innerHeight);

// SET UP SCENE
scene.background = new THREE.Color( "#aaaaaa");
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);
var orbitcontrols = new THREE.OrbitControls(camera, document.getElementById("canvas3d"));

// SET UP LIGHTS
var light = new THREE.AmbientLight("#ffffff", 50);
scene.add(light);
var light1 = new THREE.DirectionalLight("#ffffff",30);
light1.position.set(0, 100,50);
scene.add(light1);

// START RENDERING BEFORE LOADING FOR CORRECT BACKGROUND
animate();

// FIND HTML ELEMENT FOR TEXT OUTPUT
var outputtext = document.getElementById("overlay");

// SET UP LOADER
var loader = new THREE.GLTFLoader().setPath( 'model_source/original/' );

// START LOADER
loader.load( 'scene.glb',
	// ON COMPLETE
	function ( gltf ) {
		scene.add( gltf.scene );
		outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	},
	// ON PROGRESS
	function ( data ) {
		var percentage = Math.ceil(100*(data.loaded/74464868)); // HARD CODE FILE SIZE BECAUSE THE LOADER DOESN'T KNOW IT
		outputtext.innerHTML = "Loading:" + percentage + "%";
} );

// RENDER LOOP
function animate(){
    requestAnimationFrame(() => { animate() } );
    renderer.render(scene, camera);
}