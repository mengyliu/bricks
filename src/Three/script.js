/* Edit from three.js interactive voxelpainter example
https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_voxelpainter.html */

var THREE = window.THREE = require('three');
var TWEEN = require('@tweenjs/tween.js');
require('three/examples/js/loaders/STLLoader');
require('three/examples/js/controls/OrbitControls');

var colorDict = {
    yellow:"#fece0a",
    green:"#2e9850",
    red:"#ca3032",
    orange:"#f07438",
    blue:"#3a66a9"
};

var camera, scene, renderer;
var controls;
var plane;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh;
var cubeGeo, cubeMaterial;
var objects = [];
var loader = new THREE.STLLoader();
var cubeColor = "#fece0a";
var current;

function setColor(color) {
    cubeColor = colorDict[color]
    rollOverMesh.material.color.setStyle( cubeColor );
}

function setBackgroundColor(color) {
    var tween = new TWEEN.Tween(scene.background).to(new THREE.Color(color), 400).onUpdate(function() {
      scene.background = scene.background;
    }).start();
}

function init() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(500, 800, 1300);
    camera.lookAt(0,0,0)
    controls = new THREE.OrbitControls( camera );
 
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e3959);
    scene.receiveShadow = true;

    //roll-over helpers
    var rollOverGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
    var rollOverMaterial = new THREE.MeshBasicMaterial( { color: cubeColor, opacity: 0.5, transparent: true } );
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    rollOverMesh.visible = false;
    scene.add( rollOverMesh );

    //grid
    var gridHelper = new THREE.GridHelper(1000, 20, "#ffffff","#d0d0d0");
    scene.add(gridHelper);

    // raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geometry.rotateX( - Math.PI / 2 );
    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );
    objects.push( plane );

    // lights
    var ambientLight = new THREE.AmbientLight( 0xffffff);
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2);
    directionalLight.position.set( 400, 800, 500);
    directionalLight.castShadow = true; 
    scene.add( directionalLight );

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 4096*2;  // default
    directionalLight.shadow.mapSize.height = 4096*2; // default
    directionalLight.shadow.camera.near = -0.5;    // default
    directionalLight.shadow.camera.far = 1500;     // default
    directionalLight.shadow.camera.left = -700;
    directionalLight.shadow.camera.right = 700;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -600;

    // var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
    // scene.add( helper );

    // var spotLight = new THREE.DirectionalLight( 0xffffff, 0.7);
    // spotLight.position.set( -1000, 1500, -500 );
    // scene.add( spotLight );
    // spotLight.shadow.mapSize.width = 4096;
    // spotLight.shadow.mapSize.height = 4096;
    // spotLight.penumbra = 0.5;
    // spotLight.decay = 2;

    // var helper = new THREE.CameraHelper( spotLight.shadow.camera );
    // scene.add( helper );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

       //Add base
    var baseMaterial = new THREE.MeshStandardMaterial({
        color: "#d5d5d3",
        metalness: 0.1,
        roughness: 0.5,
        });
    var base = initBase(baseMaterial)
    base.castShadow = true;
    base.receiveShadow = true;
    base.position.set(0,-12.5,0)
    scene.add(base);

    var geometry = new THREE.PlaneGeometry( 1000, 1000, 32 );
   
    var sig_url = process.env.PUBLIC_URL + '/signature.png'
    var texture = THREE.ImageUtils.loadTexture( sig_url );
    var material = new THREE.MeshLambertMaterial({ map : texture });
    var plane = new THREE.Mesh( geometry, material );
    plane.material.side = THREE.DoubleSide;

    plane.rotation.set(THREE.Math.degToRad(90),0,0)
    plane.position.set(0,-25,0)
    scene.add( plane );


    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('.World').appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );
    //listen to window size change
    window.addEventListener( 'resize', onWindowResize, false );
}

function onDocumentMouseMove( event ) {
    //TODO: detect overlap
    if (current) {
        current.object.material.wireframe = false;
    }
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0  && !isShiftDown) {
        rollOverMesh.visible = true;
        var intersect = intersects[0];
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    }
    else if (intersects.length > 0  && isShiftDown) {
        var intersect = intersects[0];
        if (intersect.object !== plane) {
            //remove and change to wireframe
            current = intersect;
            current.object.material.wireframe = true;
        }
    }
    //animate();
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if (intersects.length > 0) {
        var intersect = intersects[0];
        // delete cube
        if (isShiftDown) {
            if (intersect.object !== plane) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            }
            // create cube
        } else {
            var material = new THREE.MeshStandardMaterial({
                color: cubeColor,
                metalness: 0.1,
                roughness: 0.5,
            });
            var voxel = createMesh(material)
            // voxel.rotation.set( -Math.PI / 2 ,0, 0);
            voxel.castShadow = true;
            voxel.receiveShadow = true;
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25.5 );
            scene.add(voxel);
            objects.push( voxel );
        }
        //animate();
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
 

function onDocumentKeyDown( event ) {
    switch ( event.keyCode ) {
        case 16:
            isShiftDown = true; 
            rollOverMesh.visible = false;

            //TODO: CHECK INTERSECTS HERE
        break;
    }
}

function onDocumentKeyUp( event ) {
    switch ( event.keyCode ) {
        case 16: 
            isShiftDown = false; 
            rollOverMesh.visible = true;
            if (current) {
                current.object.material.wireframe = false;
            }
        break;
    }
}

function animate(color) {
    requestAnimationFrame( animate );
    TWEEN.update();
    controls.update();
    renderer.render( scene, camera );
}
function initBase(material) {
    //20*20
    var base = 50;
    let width = 50*20;
    let height = 25;
    let depth = 50*20;
    let knobSize = 16;
    var knobHeight = 10;
    var dimensions = new THREE.Vector3(20,1,20);
    var brickGeo = new THREE.Geometry();
    var cubeGeo = new THREE.BoxGeometry( width, height, depth);
    var cylinderGeo = new THREE.CylinderGeometry( knobSize, knobSize, knobHeight, 32);
    brickGeo.mergeMesh(new THREE.Mesh(cubeGeo));

    for ( var i = 0; i < dimensions.x; i++ ) {
        for ( var j = 0; j < dimensions.z; j++ ) {
            //hah
          var cylinder = new THREE.Mesh(cylinderGeo, material);
          cylinder.position.setX(base * i - ((dimensions.x - 1) * base / 2));
          cylinder.position.setY(height/2 + knobHeight/2);  // TODO to be reworked
          cylinder.position.setZ(base * j - ((dimensions.z - 1) * base / 2));

          cylinder.castShadow = true;
          cylinder.receiveShadow = true;
          brickGeo.mergeMesh( cylinder );
        }
    }
    brickGeo.mergeVertices();
    brickGeo.castShadow = true;
    brickGeo.receiveShadow = true;
    var brick = new THREE.Mesh(brickGeo, material)
    return brick;
}
function createMesh(material) {
    //defalut: 1*1
    var base = 50;
    let width = 50;
    let height = 50;
    let depth = 50;
    let knobSize = 16;
    var knobHeight = 10;
    var dimensions = new THREE.Vector3(1,1,1);
    var brickGeo = new THREE.Geometry();
    var cubeGeo = new THREE.BoxGeometry( width, height, depth );
    var cylinderGeo = new THREE.CylinderGeometry( knobSize, knobSize, knobHeight, 20);
    brickGeo.mergeMesh(new THREE.Mesh(cubeGeo));

    for ( var i = 0; i < dimensions.x; i++ ) {
        for ( var j = 0; j < dimensions.z; j++ ) {
            //hah
          var cylinder = new THREE.Mesh(cylinderGeo, material);
          cylinder.position.setX(base * i - ((dimensions.x - 1) * base / 2));
          cylinder.position.setY(height/2+knobHeight/2);  // TODO to be reworked
          cylinder.position.setZ(base * j - ((dimensions.z - 1) * base / 2));

          cylinder.castShadow = true;
          cylinder.receiveShadow = true;
          brickGeo.mergeMesh( cylinder );
        }
    }
    brickGeo.mergeVertices();
    brickGeo.castShadow = true;
    brickGeo.receiveShadow = true;
    var brick = new THREE.Mesh(brickGeo, material)
    return brick;
    
    
}

export {init, animate, setColor,setBackgroundColor};