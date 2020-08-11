var useDraco = true;
var shadows =  true;
var totalBytes = 0;
var wheels = [];
var xyzww= false;

var vz = 0.1;
var vo = 0;
var vmx = 1;
var vmn = -vmx;
var moving = false;

var rotating = false;


var vy = 0;
var ym = 0;
var yo = 0;

var car = new THREE.Object3D();
var wheelcontainer = new THREE.Object3D();
var paintjob = new THREE.Object3D();
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
scene.add(car);
car.add(wheelcontainer);
car.add(paintjob);



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
	car.add(newlightw1);
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
var outputtext = document.getElementById("overlay_left");
var buttons = document.getElementById("overlay_right");
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
			emissive: "#000000",
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
var ggeometry = new THREE.BoxGeometry( 100, 100, 100 );
var gmaterial = blackmaterial;//new THREE.MeshBasicMaterial( {color: "#ffffff"} );
var gbox = new THREE.Mesh( ggeometry, gmaterial );
gbox.position.set(0, -50.5, 0);
scene.add( gbox );
if(shadows){
	//gsphere.castShadow = true;
	gbox.receiveShadow = true;
};

function changecolour(col){
	var newpaintmaterial = new THREE.MeshPhysicalMaterial( {
			clearcoat:0.7,
			clearcoatRoughness:0.1,
			side: THREE.DoubleSide,
			envMap : textureCube,
			envMapIntensity :0.5,
			reflectivity : 0.8,
			metalness: 1,
			emissive: "#000000",
			color: col,
			roughness : 0.1

		} );
	paintjob.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = newpaintmaterial;
        }
    } )

}

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
	paintjob.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	paintjob.add( otherhalf );
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
	car.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	car.add( otherhalf );
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
	car.add( gltf.scene );


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
	
	car.add( gltf.scene );

	
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
	car.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	car.add( otherhalf );
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
        	console.log("TYRE PART NAME: " + child.name);
        	//wheels.push(child);
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
	wheelcontainer.add(back);
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	var front = back.clone();
	wheelcontainer.add(front);
	//front.scale.z = -1;
	front.position.z += 2.4;
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
        	//wheels.push(child);
        	console.log("HUBCAP PART NAME: " + child.name);
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
	wheelcontainer.add(back);
	otherhalf.scale.x = -1;
	var xcorrection =-0.002;
	gltf.scene.position.x -= xcorrection;
	otherhalf.position.x += xcorrection;

	var front = back.clone();
	wheelcontainer.add(front);
	//front.scale.z = -1;
	front.position.z += 2.4;

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
	car.add( gltf.scene );
	var otherhalf = gltf.scene.clone();
	car.add( otherhalf );
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
	car.add( gltf.scene );
	//var otherhalf = gltf.scene.clone();
	//scene.add( otherhalf );
	//otherhalf.scale.x = -1;
	//var xcorrection =-0.002;
	//gltf.scene.position.x -= xcorrection;
	//otherhalf.position.x += xcorrection;


	finishedLoading();
	},function ( data ) {
		
		//var percentage = Math.ceil(100*(data.loaded/1720320));
		outputtext.innerHTML = "Loading Glass: " + data.loaded + " Bytes";
		
	} );

}

function finishedLoading(){
	outputtext.innerHTML  = "Finished Loading.<br/>Use left mouse button and move to rotate,<br/>right mouse button and move to pan,<br/>and mousewheel to zoom.<br/>Also use buttons on the right<br/>to move or jump the car,<br/>and rotate around it automatically.";//<br/>and to change its paint colour.";
	buttons.innerHTML = "<button type='button' id='button360'>360</button><br/><button type='button' id='buttonmove'>Move</button><br/><button type='button' id='buttonjump'>Jump</button><br/>Colours:<br/><button type='button' id='buttonoriginal'>Original</button><br/><button type='button' id='buttonblack'>Black</button><br/><button type='button' id='buttonblue'>Blue</button>";
	xyzww = true;
	document.getElementById("buttonmove").onclick = function () { if(moving){moving=false}else{moving=true} };
	document.getElementById("button360").onclick = function () { if(rotating){rotating=false;orbitcontrols.autoRotate=false;}else{rotating=true; orbitcontrols.autoRotate=true;} };
	document.getElementById("buttonjump").onclick = function () { vy=0.1};
	document.getElementById("buttonblack").onclick = function () { changecolour("#000000")};
	document.getElementById("buttonblue").onclick = function () { changecolour("#1122ff")};
	document.getElementById("buttonoriginal").onclick = function () { changecolour("#611212")};
	car.traverse(function( child ) {
        if ( child instanceof THREE.Mesh ) {
        	if(child.name.substring(0,5)=="wheel"){
        		wheels.push(child);
        	}
        	
        }
    } )
}


function animate(){
    requestAnimationFrame(() => { animate() } );
    //console.log("a");
    if(xyzww){
    	//console.log("b");
    	var oldyposition = car.position.y;
    	car.position.y += vy;
    	
    	if (car.position.y<yo){
    		car.position.y=yo;
    		vy = vy *-0.3;
    	} else if (car.position.y>yo+0.01){
    		vy-=0.012;
    	} else{
    		vy=0;
    		car.position.y=yo;
    	}

    	var dy = oldyposition-car.position.y;
    	wheelcontainer.position.y = dy;
    	
    	if(rotating){
    		orbitcontrols.update();

    	}
    	if(moving){

    		car.position.z += vz;
    		if(car.position.z>0){vz-=0.001}
    		if(car.position.z<0){vz+=0.001}
    		for (var i = wheels.length - 1; i >= 0; i--) {
    			//console.log("c");
    			wheels[i].rotation.x = car.position.z*-1.7;
    		}
    	}
    }
    renderer.render(scene, camera);
}
