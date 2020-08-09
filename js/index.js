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
var light = new THREE.AmbientLight("#ffffff", 1);
scene.add(light);
var light1 = new THREE.DirectionalLight("#555555",2);
light1.position.set(100, 200,-200);
var light2 = new THREE.DirectionalLight("#555555",2);
light2.position.set(-100, 200,200);
scene.add(light2);
scene.add(light1);
animate();
var outputtext = document.getElementById("overlay");
var envloader = new THREE.CubeTextureLoader();
var textureCube = this.envloader.load( ["textures/px.jpg", "textures/nx.jpg", "textures/py.jpg", "textures/ny.jpg", "textures/pz.jpg", "textures/nz.jpg"], () => { loadbody()} );



var paintmaterial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0,
			side: THREE.DoubleSide,
			envMap : textureCube,
			envMapIntensity :0.3,
			reflectivity : 0.9,
			metalness: 0,
			color: "#310606",
			roughness : 0

		} );
var chromematerial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0,
			side: THREE.DoubleSide,
			envMap : textureCube,
			envMapIntensity :1,
			reflectivity : 1,
			metalness: 1,
			color: "#aaaaaa",
			roughness : 0

		} );
var blackmaterial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0.4,
			side: THREE.DoubleSide,
			//envMap : textureCube,
			//envMapIntensity :1,
			reflectivity : 0.5,
			metalness: 0.1,
			color: "#090909",
			roughness : 0.5

		} );

var modelpath = 'model/' ;

function loadbody(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'paintbody.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = paintmaterial;
        }
    } )
	scene.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	scene.add( otherhalf );
	otherhalf.scale.x = -1;
	var xcorrection =0.001;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;
	loadchrome();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Body:" + percentage + "%";
		
	} );

}

function loadchrome(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'chrome.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = chromematerial;
        }
    } )
	scene.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	scene.add( otherhalf );
	otherhalf.scale.x = -1;
	var xcorrection =0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;
	loadchromeasymmetric();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Chrome:" + percentage + "%";
		
	} );

}

function loadchromeasymmetric(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'chrome_asymmetric.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = chromematerial;
        }
    } )
	scene.add( gltf.scene );


	loadfeaturesasymmetric();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Asymmetric Chrome:" + percentage + "%";
		
	} );

}

function loadfeaturesasymmetric(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'asymmetric_features.glb', function ( gltf ) {
	//gltf.scene.position.x-=0.01;
	
	scene.add( gltf.scene );

	
	loadblack();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Asymmetric features:" + percentage + "%";
		
	} );

}

function loadblack(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'black.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = blackmaterial;
        }
    } )
	scene.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	scene.add( otherhalf );
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	outputtext.innerHTML = outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	//loadchromeasymmetric();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Black Features:" + percentage + "%";
		
	} );

}


function animate(){
    requestAnimationFrame(() => { animate() } );
    renderer.render(scene, camera);
}
