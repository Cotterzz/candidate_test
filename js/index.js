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
var light1 = new THREE.DirectionalLight("#999988",2);
light1.position.set(100, 200,-200);
var light2 = new THREE.DirectionalLight("#999988",2);
light2.position.set(-100, 200,200);
scene.add(light2);
scene.add(light1);


//lightw1 = new THREE.PointLight("#ffffff", 20, 20, 2);
//lightw1.position.set(0.9, 0.1, 2.5);
//scene.add(lightw1);
//
//lighto1 = new THREE.PointLight("#ffaa00", 20, 20, 2);
//lighto1.position.set(0.9, 0.1, 2.5);
//scene.add(lighto1);


animate();
var outputtext = document.getElementById("overlay");
var envloader = new THREE.CubeTextureLoader();
var textureCube = this.envloader.load( ["textures/px.jpg", "textures/nx.jpg", "textures/py.jpg", "textures/ny.jpg", "textures/pz.jpg", "textures/nz.jpg"], () => { loadbody()} );






var paintmaterial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0.7,
			clearcoatRoughness:0.1,
			side: THREE.DoubleSide,
			envMap : textureCube,
			envMapIntensity :0.5,
			reflectivity : 0.8,
			metalness: 1,
			emissive: "#010000",
			color: "#611212",
			roughness : 0.1

		} );
var chromematerial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0,
			side: THREE.DoubleSide,
			envMap : textureCube,
			envMapIntensity :3,
			reflectivity : 1,
			metalness: 1,
			color: "#111111",
			emissive: "#000000",
			roughness : 0

		} );
var blackmaterial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0.3,
			clearcoatRoughness:0.3,
			side: THREE.DoubleSide,
			//envMap : textureCube,
			//envMapIntensity :1,
			reflectivity : 0.1,
			metalness: 0,
			color: "#030303",
			roughness : 0.3

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
	var xcorrection =0;
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
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            if(child.name.substring(0,7)=="blacken"){
            	child.material = blackmaterial;
            };
        }
    } )
	
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

	//outputtext.innerHTML = outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	loadwheelblack();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Black Features:" + percentage + "%";
		
	} );

}

function loadwheelblack(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'wheel_black.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            //child.material = blackmaterial;
        }
    } )
    var back = new THREE.Object3D();
	back.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	back.add( otherhalf );
	scene.add(back);
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	var front = back.clone();
	scene.add(front);
	front.scale.z = -1;
	front.position.z +=.28;

	//outputtext.innerHTML = outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	loadwheelchrome();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Black Wheel" + percentage + "%";
		
	} );

}

function loadwheelchrome(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'wheel_chrome.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = chromematerial;
        }
    } )
    var back = new THREE.Object3D();
	back.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	back.add( otherhalf );
	scene.add(back);
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	var front = back.clone();
	scene.add(front);
	front.scale.z = -1;
	front.position.z +=.28;

	//outputtext.innerHTML = outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	loadlights();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Chrome Wheel" + percentage + "%";
		
	} );

}

function loadlights(){
	var loader = new THREE.GLTFLoader().setPath( modelpath );
	loader.load( 'lights.glb', function ( gltf ) {
	
	scene.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	scene.add( otherhalf );
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	outputtext.innerHTML = outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	//loadwheelblack();
	},function ( data ) {
		
		var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Lights:" + percentage + "%";
		
	} );

}


function animate(){
    requestAnimationFrame(() => { animate() } );
    renderer.render(scene, camera);
}
