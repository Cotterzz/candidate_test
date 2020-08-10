var useDraco = true;
var shadows =  true;
var totalBytes = 0;
//var currentBytes = 0;
// SET UP RENDERER
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById("canvas3d"),antialias:true});
renderer.physicallyCorrectLights = true;      // these two settings are required for 
renderer.outputEncoding = THREE.sRGBEncoding; // certain gltf features or extensions
renderer.setSize(window.innerWidth, window.innerHeight);
if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}
// SET UP SCENE
scene.background = new THREE.Color( "#aaaaaa");
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);
var orbitcontrols = new THREE.OrbitControls(camera, document.getElementById("canvas3d"));

// SET UP LIGHTS
//var light = new THREE.AmbientLight("#ffffff", 1);
//scene.add(light);
var light1 = new THREE.DirectionalLight("#999988",2);
light1.position.set(100, 200,-200);
var light2 = new THREE.DirectionalLight("#999988",2);
light2.position.set(-100, 200,200);
scene.add(light2);
scene.add(light1);

if(shadows){
	light1.castShadow = true;
	light2.castShadow = true;
	light1.shadow.mapSize.width = light1.shadow.mapSize.height = 2048;
	light1.shadow.camera.near = 1;
	light1.shadow.camera.far = 500;
	light2.shadow.mapSize.width = light2.shadow.mapSize.height = 2048;
	light2.shadow.camera.near = 1;
	light2.shadow.camera.far = 500;
};

//addLights();


function addLights(){
	addLight("#ffffff",0.57, 0.075, 2.0);
	addLight("#ffffff",-0.57, 0.075, 2.0);
	addLight("#ffffff",0.45, 0.075, 2.0);
	addLight("#ffffff",-0.45, 0.075, 2.0);
	addLight("#ff9900",0.75, 0.12, 1.9);
	addLight("#ff9900",-0.75, 0.12, 1.9);
}


function addLight(col, x, y, z){
	var newlightw1 = new THREE.PointLight(col, 10, 20, 2);
	newlightw1.position.set(x, y, z);
	scene.add(newlightw1);
	var geometry = new THREE.SphereGeometry( 0.05, 10, 10 );
	var material = new THREE.MeshBasicMaterial( {color: col} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x, y, z);
	//scene.add( sphere );
	if(shadows){
	newlightw1.castShadow = true;
	newlightw1.shadow.mapSize.width = newlightw1.shadow.mapSize.height = 2048;
	newlightw1.shadow.camera.near = 1;
	newlightw1.shadow.camera.far = 500;

};
}


animate();
var outputtext = document.getElementById("overlay");
var envloader = new THREE.CubeTextureLoader();
outputtext.innerHTML  = "Loading environment textures: 172KB";
totalBytes = 172*1024;


var loader, uloader, dloader, draco;


uloader = new THREE.GLTFLoader().setPath( 'model_final_mix/' );

if(useDraco){
	dloader = new THREE.GLTFLoader().setPath( 'model_final_mix/' );
	var draco = new THREE.DRACOLoader();
	
	draco.setDecoderConfig({ type: 'js' });
	//dloader.setDecoderPath( 'js/decoders/' );
	draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
	
	dloader.setDRACOLoader( draco );
	
} else {
	uloader = new THREE.GLTFLoader().setPath( 'model_uncompressed/' );
}


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
var glassmaterial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0,
			transparent:true,
			opacity:0.4,
			
			//side: THREE.DoubleSide,
			envMap : textureCube,
			envMapIntensity :3,
			reflectivity : 1,
			metalness: 0,
			color: "#000000",
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




// SET UP GROUND
var ggeometry = new THREE.SphereGeometry( 100, 100, 100 );
var gmaterial = blackmaterial;//new THREE.MeshBasicMaterial( {color: "#ffffff"} );
var gsphere = new THREE.Mesh( ggeometry, gmaterial );
gsphere.position.set(0, -100.5, 0);
scene.add( gsphere );
if(shadows){
	//gsphere.castShadow = true;
	gsphere.receiveShadow = true;
};



function loadbody(){
	if(useDraco){ loader=dloader} else {loader=uloader};
	loader.load( 'paintbody.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = paintmaterial;
            if(shadows){
            	child.castShadow = true;
				//child.receiveShadow = true;
			}
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
		
		//var progress = totalBytes + data.loaded;

		outputtext.innerHTML = "Loading Body: " + data.loaded + " Bytes";
		
	} );

}

function loadchrome(){
	if(useDraco){ loader=dloader} else {loader=uloader};
	loader.load( 'chrome.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = chromematerial;
            if(shadows){
            	child.castShadow = true;
				child.receiveShadow = true;
			}
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
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Chrome: " + data.loaded + " Bytes";
		
	} );

}

function loadchromeasymmetric(){
	if(useDraco){ loader=dloader} else {loader=uloader};
	loader.load( 'chrome_asymmetric.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = chromematerial;
                        if(shadows){
            	child.castShadow = true;
				child.receiveShadow = true;
			}
        }
    } )
	scene.add( gltf.scene );


	loadfeaturesasymmetric();
	},function ( data ) {
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Asymmetric Chrome: " + data.loaded + " Bytes";
		
	} );

}

function loadfeaturesasymmetric(){
	// dont use compression because of textures
	//if(useDraco){ loader=dloader} else {loader=uloader};
	uloader.load( 'asymmetric_features.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            if(child.name.substring(0,7)=="blacken"){
            	child.material = blackmaterial;
            };
                        if(shadows){
            	child.castShadow = true;
				//child.receiveShadow = true;
			}
        }
    } )
	
	scene.add( gltf.scene );

	
	loadblack();
	},function ( data ) {
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Asymmetric features: " + data.loaded + " Bytes";
		
	} );

}

function loadblack(){
	if(useDraco){ loader=dloader} else {loader=uloader};
	loader.load( 'black.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = blackmaterial;
                        if(shadows){
            	child.castShadow = true;
				child.receiveShadow = true;
			}
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
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Black Features: " + data.loaded + " Bytes";
		
	} );

}

function loadwheelblack(){
	// dont use compression because of textures
	//if(useDraco){ loader=dloader} else {loader=uloader};
	uloader.load( 'wheel_black.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
                        if(shadows){
            	child.castShadow = true;
				child.receiveShadow = true;
			}
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
	if(shadows){
            	front.castShadow = true;
				front.receiveShadow = true;
				back.castShadow = true;
				back.receiveShadow = true;
			}

	//outputtext.innerHTML = outputtext.innerHTML = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	loadwheelchrome();
	},function ( data ) {
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Black Wheel: " + data.loaded + " Bytes";
		
	} );

}

function loadwheelchrome(){
	if(useDraco){ loader=dloader} else {loader=uloader};
	loader.load( 'wheel_chrome.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = chromematerial;
                        if(shadows){
            	child.castShadow = true;
				child.receiveShadow = true;
			}
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
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Chrome Wheel: " + data.loaded + " Bytes";
		
	} );

}

function loadlights(){
	// dont use compression because of textures
	//if(useDraco){ loader=dloader} else {loader=uloader};
	uloader.load( 'lights.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {

            if(shadows){
            	child.castShadow = true;
				child.receiveShadow = true;
			}
        }
    } )
	scene.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	scene.add( otherhalf );
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	//outputtext.innerHTML  = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	loadglass();
	},function ( data ) {
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Lights: " + data.loaded + " Bytes";
		
	} );

}

function loadglass(){
	if(useDraco){ loader=dloader} else {loader=uloader};
	loader.load( 'windscreen.glb', function ( gltf ) {
	gltf.scene.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = glassmaterial;
            if(shadows){
            	//child.castShadow = true;
				//child.receiveShadow = true;
			}
        }
    } )
	scene.add( gltf.scene );
	//var otherhalf = gltf.scene.clone();
	//scene.add( otherhalf );
	//otherhalf.scale.x = -1;
	//var xcorrection =-0.002;
	//gltf.scene.position.x -= xcorrection;
	//otherhalf.position.x += xcorrection;

	outputtext.innerHTML  = "Loaded. Use left mouse button and move to rotate, right mouse button and move to pan, and mousewheel to zoom.";
	//loadwheelblack();
	},function ( data ) {
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Glass: " + data.loaded + " Bytes";
		
	} );

}


function animate(){
    requestAnimationFrame(() => { animate() } );
    renderer.render(scene, camera);
}
