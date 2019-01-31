/* Edit from three.js interactive voxelpainter example
https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_voxelpainter.html */

var THREE = window.THREE = require('three');
require('three/examples/js/loaders/STLLoader');
require('three/examples/js/controls/OrbitControls');
var camera, scene, renderer;
var controls;
var plane;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;
var objects = [];
var loader = new THREE.STLLoader();
 

function init() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(500, 800, 1300);
    camera.lookAt(0,0,0)
    controls = new THREE.OrbitControls( camera );
 
    scene = new THREE.Scene();
    scene.background = new THREE.Color (0xf8f8f8)

    //roll-over helpers
    var rollOverGeo = new THREE.BoxBufferGeometry( 50, 58, 50 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    scene.add( rollOverMesh );


    //grid
    var gridHelper = new THREE.GridHelper(1000, 20, "#a8a8a8","#d0d0d0");
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
    var ambientLight = new THREE.AmbientLight( 0xf3f0f0);
    scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
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
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    }
    animate();
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
            // var url = process.env.PUBLIC_URL + '/3003.stl'
            // loader.load(url, geometry => {
            //     var material = new THREE.MeshStandardMaterial({
            //         //"red"
            //           color: "#ff0000",
            //           // specular: CSSToHex(shadeColor(color, -20)),
            //           // shininess: 5,
            //           metalness: 0.4,
            //           roughness: 0.5,
            //         });
            //     var voxel = new THREE.Mesh(geometry, material);
            var material = new THREE.MeshStandardMaterial({
            //"red"
              color: "#ff0000",
              // specular: CSSToHex(shadeColor(color, -20)),
              // shininess: 5,
              metalness: 0.4,
              roughness: 0.5,
            });
            var voxel = createMesh(material)
            // voxel.rotation.set( -Math.PI / 2 ,0, 0);
            voxel.scale.set( 3, 3, 3 );
            voxel.castShadow = true;
            voxel.receiveShadow = true;
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25.5 );
            console.log(voxel.position)
            scene.add(voxel);
            objects.push( voxel );
            

        }
        animate();
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
 

function onDocumentKeyDown( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = true; 
        rollOverMesh.visible = false;
        break;
    }
}

function onDocumentKeyUp( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = false; 
        rollOverMesh.visible = true;
        break;
    }
}

function animate() {
    // requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

function createMesh(material) {
    //defalut: 1*1
    var base = 17;
    let width = 17;
    let height = 20;
    let depth = 17;
    let knobSize = 6;
    var dimensions = new THREE.Vector3(1,1,1);
    var brickGeo = new THREE.Geometry();
    var cubeGeo = new THREE.BoxGeometry( width - 0.1, height - 0.1, depth - 0.1 );
    var cylinderGeo = new THREE.CylinderGeometry( knobSize, knobSize, knobSize, 20);
    brickGeo.mergeMesh(new THREE.Mesh(cubeGeo));

    for ( var i = 0; i < dimensions.x; i++ ) {
        for ( var j = 0; j < dimensions.z; j++ ) {
            //hah
          var cylinder = new THREE.Mesh(cylinderGeo, material);
          cylinder.position.setX(base * i - ((dimensions.x - 1) * base / 2));
          cylinder.position.setY(base / 1.6);  // TODO to be reworked
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

export {init, animate};