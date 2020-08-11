var shadows =  true; // dynamic shadows
var wheels = []; // list of parts to rotate
var finished= false; // loading finished 
var vz = 0.1; // lateral velocity
var zo = 0; // lateral start position
var moving = false; // is moving back and forth
var rotating = false; // orbtocontrols auto rotate
var vy = 0; // vertical velocity
var yo = 0; // vertical start position
var car = new THREE.Object3D();  // container for entire car
var wheelcontainer = new THREE.Object3D(); // container for wheels
var paintjob = new THREE.Object3D(); // container for paint work only

// SET UP RENDERER
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById("canvas3d"),antialias:true});
renderer.physicallyCorrectLights = true;      // these two settings are required for 
renderer.outputEncoding = THREE.sRGBEncoding; // certain gltf features or extensions
renderer.setSize(window.innerWidth, window.innerHeight);
if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;
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

// SET UP RESIZE EVENT
var tanFOV = Math.tan((Math.PI / 360) * camera.fov);
var windowHeight = window.innerHeight;
window.addEventListener('resize', onWindowResize, false);

// SET UP LIGHTS
var light1 = new THREE.DirectionalLight("#999988",2);
light1.position.set(100, 200,-200);
var light2 = new THREE.DirectionalLight("#999988",2);
light2.position.set(-100, 200,200);
scene.add(light2);
scene.add(light1);
if(shadows){
	light1.castShadow = light2.castShadow = true;
	light1.shadow.mapSize.width = light1.shadow.mapSize.height = light2.shadow.mapSize.width = light2.shadow.mapSize.height = 2048;
	light1.shadow.camera.near = light2.shadow.camera.near = 1;
	light1.shadow.camera.far = light2.shadow.camera.far = 500;
};

animate(); //START RENDERER BEFORE LOADING

// SET UI FOR LOADING
var outputtext = document.getElementById("overlay_left");
var buttons = document.getElementById("overlay_right");
var envloader = new THREE.CubeTextureLoader();
outputtext.innerHTML  = "Loading environment textures: 172KB";

// CONFIGURE LOADER
var loader, uloader, dloader, draco, path;
path = 'model_final_mix/';
uloader = new THREE.GLTFLoader().setPath( path );
dloader = new THREE.GLTFLoader().setPath( path );
var draco = new THREE.DRACOLoader();
//draco.setDecoderConfig({ type: 'js' });
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
dloader.setDRACOLoader( draco );
var currentComponent = -1;

// MATERIALS

var textureCube = this.envloader.load( ["textures/px.jpg", "textures/nx.jpg", "textures/py.jpg", "textures/ny.jpg", "textures/pz.jpg", "textures/nz.jpg"], () => { nextComponent()} );

var paintmaterial = new THREE.MeshPhysicalMaterial( {clearcoat:0.7,clearcoatRoughness:0.1,side: THREE.DoubleSide,envMap : textureCube,envMapIntensity :0.5,reflectivity : 0.8,metalness: 1,emissive: "#000000",color: "#611212",roughness : 0.1} );
var chromematerial = new THREE.MeshPhysicalMaterial( {clearcoat:0,side: THREE.DoubleSide,envMap : textureCube,envMapIntensity :3,reflectivity : 1,metalness: 1,color: "#111111",emissive: "#000000",roughness : 0  } );
var glassmaterial = new THREE.MeshPhysicalMaterial( {clearcoat:0,transparent:true,opacity:0.4,envMap : textureCube,envMapIntensity :3,reflectivity : 1,metalness: 0,color: "#000000",emissive: "#000000",roughness : 0 } );
var blackmaterial = new THREE.MeshPhysicalMaterial( {clearcoat:0.3,clearcoatRoughness:0.3,side: THREE.DoubleSide,reflectivity : 0.1,metalness: 0,color: "#030303",roughness : 0.3} );

// SET UP GROUND
var ggeometry = new THREE.BoxGeometry( 100, 100, 100 );
var gmaterial = blackmaterial;
var gbox = new THREE.Mesh( ggeometry, gmaterial );
gbox.position.set(0, -50.5, 0);
scene.add( gbox );
if(shadows){
	gbox.receiveShadow = true;
};

// LOADING AND COMPOSITION
var components = [ 
	{path:'paintbody.glb',          useDraco:true, castShadow:true, receiveShadow:false,material:paintmaterial, mirrorz:true, xshift:0.001, mirrorx:false,zshift:0,  parent:paintjob      },
	{path:'chrome.glb',             useDraco:true, castShadow:true, receiveShadow:true, material:chromematerial,mirrorz:true, xshift:0,     mirrorx:false,zshift:0,  parent:car           },
	{path:'chrome_asymmetric.glb',  useDraco:true, castShadow:true, receiveShadow:true, material:chromematerial,mirrorz:false,xshift:0,     mirrorx:false,zshift:0,  parent:car           },
	{path:'asymmetric_features.glb',useDraco:false,castShadow:true, receiveShadow:false,material:false,         mirrorz:false,xshift:0,     mirrorx:false,zshift:0,  parent:car           },
	{path:'black.glb',              useDraco:true, castShadow:true, receiveShadow:true, material:blackmaterial, mirrorz:true, xshift:-0.002,mirrorx:false,zshift:0,  parent:car           },
	{path:'wheel_black.glb',        useDraco:false,castShadow:true, receiveShadow:true, material:false,         mirrorz:true, xshift:-0.002,mirrorx:true, zshift:2.4,parent:wheelcontainer},
	{path:'wheel_chrome.glb',       useDraco:true, castShadow:true, receiveShadow:true, material:chromematerial,mirrorz:true, xshift:-0.002,mirrorx:true, zshift:2.4,parent:wheelcontainer},
	{path:'lights.glb',             useDraco:false,castShadow:true, receiveShadow:true, material:false,         mirrorz:true, xshift:-0.002,mirrorx:false,zshift:0,  parent:car           },
	{path:'windscreen.glb',         useDraco:true, castShadow:false,receiveShadow:false,material:glassmaterial, mirrorz:false,xshift:0,  	 mirrorx:false,zshift:0,  parent:car           }
];

function loadComponent(component){
	if(component.useDraco){ loader=dloader} else {loader=uloader};
	loader.load(
		component.path,
		function ( gltf ) {
			gltf.scene.traverse(
				function( child ) {
       	 			if ( child instanceof THREE.Mesh ) {
       	 			    if(component.material){child.material = component.material};
       	 			    if(child.name.substring(0,7)=="blacken"){child.material = blackmaterial;};
       	 			    if(shadows){
       	 			    	child.castShadow = component.castShadow;
       	 			    	child.receiveShadow = component.receiveShadow;
						}
       	 			}
    			}
    		)
    		component.parent.add(gltf.scene);

    		if(component.mirrorz){
    			var otherhalf = gltf.scene.clone();
				component.parent.add( otherhalf );
				otherhalf.scale.x = -1;
				gltf.scene.position.x -= component.xshift;
				otherhalf.position.x += component.xshift;

				if(component.mirrorx){
    				var back = new THREE.Object3D();
					back.add( gltf.scene );
					back.add( otherhalf );
					component.parent.add(back);
					var front = back.clone();
					component.parent.add(front);
					front.position.z += component.zshift;
					if(shadows){
            			front.castShadow = component.castShadow;
						front.receiveShadow = component.receiveShadow;
						back.castShadow = component.castShadow;
						back.receiveShadow = component.receiveShadow;
					}
    			}
    		}
    		nextComponent();
    	},
    	function ( data ) { outputtext.innerHTML = "Loading " + component.path + " " + data.loaded + " Bytes";}
    );
}

function nextComponent(){
	currentComponent+=1;
	if(currentComponent<9){
		loadComponent(components[currentComponent]);
	} else {
		finishedLoading();
	}
}

function finishedLoading(){
	finished = true;
	// ADD LOADED TEXT
	outputtext.innerHTML  = "Finished Loading.<br/>Use left mouse button and move to rotate,<br/>right mouse button and move to pan,<br/>and mousewheel to zoom.<br/>Also use buttons on the right<br/>to move or jump the car,<br/>and rotate around it automatically.<br/>and to change its paint colour.";
	// ADD BUTTONS
	buttons.innerHTML = "<button type='button' id='button360'>360</button><br/><button type='button' id='buttonmove'>Move</button><br/><button type='button' id='buttonjump'>Jump</button><br/>Colours:<br/><button type='button' id='buttonoriginal'>Original</button><br/><button type='button' id='buttonblack'>Black</button><br/><button type='button' id='buttonblue'>Blue</button>";
	// ADD BUTTON FUNCTION CALLS
	document.getElementById("buttonmove").onclick = function () { if(moving){moving=false}else{moving=true} };
	document.getElementById("button360").onclick = function () { if(rotating){rotating=false;orbitcontrols.autoRotate=false;}else{rotating=true; orbitcontrols.autoRotate=true;} };
	document.getElementById("buttonjump").onclick = function () { vy=0.1};
	document.getElementById("buttonblack").onclick = function () { changecolour("#000000")};
	document.getElementById("buttonblue").onclick = function () { changecolour("#1122ff")};
	document.getElementById("buttonoriginal").onclick = function () { changecolour("#611212")};
	// FIND ALL ROTATING ELEMMENTS
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
    if(finished){
    	// JUMPING ANIMATION
    	var oldyposition = car.position.y;
    	car.position.y += vy; 
    	if (car.position.y<yo){car.position.y=yo;vy = vy *-0.3;} else if (car.position.y>yo+0.01){vy-=0.012;} else{vy=0;car.position.y=yo;}

    	var dy = oldyposition-car.position.y; wheelcontainer.position.y = dy; // take dy for wheel movement while jumping
    	// 360 ROTATION
    	if(rotating){ orbitcontrols.update();}
    	// MOVING BACK AND FORTH
    	if(moving){
    		car.position.z += vz;
    		if(car.position.z>zo){vz-=0.001}
    		if(car.position.z<zo){vz+=0.001}
    		for (var i = wheels.length - 1; i >= 0; i--) {
    			wheels[i].rotation.x = car.position.z*-1.7;
    		}
    	}

    }
    renderer.render(scene, camera);
}

// CHANGE PAINT JOB
function changecolour(col){
	var newpaintmaterial = new THREE.MeshPhysicalMaterial( {clearcoat:0.7,clearcoatRoughness:0.1,side: THREE.DoubleSide,envMap : textureCube,envMapIntensity :0.5,reflectivity : 0.8,metalness: 1,emissive: "#000000",color: col,roughness : 0.1} );
	paintjob.traverse(
		function( child ) {
        	if ( child instanceof THREE.Mesh ) {
            	child.material = newpaintmaterial;
        	}
    	}
    )
}

// RESIZE VIEWPORT TO WINDOW
function onWindowResize(event) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight));
        camera.updateProjectionMatrix();
        camera.lookAt(scene.position);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
}