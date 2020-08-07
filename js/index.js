// SET UP RENDERER
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById("canvas3d"),antialias:true});
renderer.physicallyCorrectLights = true;      // these two settings are required for 
renderer.outputEncoding = THREE.sRGBEncoding; // certain gltf features or extensions
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color( "#aaaaaa");
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);
var orbitcontrols = new THREE.OrbitControls(camera, document.getElementById("canvas3d"));
var light = new THREE.AmbientLight("#ffffff", 50);
scene.add(light);
var light1 = new THREE.DirectionalLight("#ffffff",30);
light1.position.set(0, 100,50);
scene.add(light1);
//var light2 = new THREE.HemisphereLight( 0xffffff, 0xffaaaa, 10 );
//scene.add( light2 );
animate();
var outputtext = document.getElementById("overlay");
var manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	//console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

	//console.log( 'Loading complete!');

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

	outputtext.innerHTML = ( 'There was an error loading ' + url );

};


var loader = new THREE.GLTFLoader(manager).setPath( 'model_source/original/' );

var total = 74464868;

//console.log(outputtext);
loader.load( 'scene.glb', function ( gltf ) {
//var loader = new THREE.GLTFLoader().setPath( 'model/' );
//loader.load( 'paintbody_decimated_bisected_e.gltf', function ( gltf ) {
	//gltf.scene.traverse( function ( child ) {} );
	scene.add( gltf.scene );
	outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/74464868));
		outputtext.innerHTML = "Loading:" + percentage + "%";
		//console.log("progress:" + percentage + "%");
		
	} );


function animate(){
    requestAnimationFrame(() => { animate() } );
    renderer.render(scene, camera);
}
