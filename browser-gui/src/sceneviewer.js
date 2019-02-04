import * as THREE from 'three';
// See https://stackoverflow.com/a/44960831/
import 'three-examples/controls/OrbitControls';
import 'three-examples/controls/TransformControls';


function directionalLight() {
  var color = 0xffffff;
  var intensity = 1;

  var light = new THREE.DirectionalLight( color, intensity );
  light.name = 'MyDirectionalLight';
  light.target.name = 'MyDirectionalLight Target';

  light.position.set( 1, 1, 1 );
  return light;
}


function pointLight() {
  var color = 0xffffff;
  var intensity = 1;
  var distance = 0;

  var light = new THREE.PointLight( color, intensity, distance );
  light.name = 'MyPointLight';
  light.position.x = 10;
  light.position.y = 10;
  light.position.z = 10;
  light.scale.set( .1, .1, .1);
  return light;
}


function hemisphereLight() {
  var skyColor = 0x70f0ff;
  var groundColor = 0x906000;
  var intensity = 1;

  var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
  light.name = 'MyHemisphereLight';
  light.position.x = 0;
  light.position.y = 0;
  light.position.z = 10;
  light.scale.set( .1, .1, .1);
  return light;
}


function shipGeometry() {
  // object is pointing in positive x direction
  // positive z is top!
  var ship = new THREE.Geometry();
  ship.vertices.push( new THREE.Vector3( .8, 0, 0 ) );  // 0: front
  ship.vertices.push( new THREE.Vector3( 0, .4, 0 ) );  // 1: left
  ship.vertices.push( new THREE.Vector3( -.2, 0, 0 ) );  // 2: back
  ship.vertices.push( new THREE.Vector3( 0, -.4, 0 ) );  // 3: right
  ship.vertices.push( new THREE.Vector3( 0, 0, .2 ) );  // 4: top
  ship.vertices.push( new THREE.Vector3( 0, 0, -.1 ) );  // 5: bottom

  ship.faces.push( new THREE.Face3( 0, 1, 4 ) );
  ship.faces.push( new THREE.Face3( 1, 2, 4 ) );
  ship.faces.push( new THREE.Face3( 2, 3, 4 ) );
  ship.faces.push( new THREE.Face3( 3, 0, 4 ) );

  ship.faces.push( new THREE.Face3( 1, 0, 5 ) );
  ship.faces.push( new THREE.Face3( 2, 1, 5 ) );
  ship.faces.push( new THREE.Face3( 3, 2, 5 ) );
  ship.faces.push( new THREE.Face3( 0, 3, 5 ) );

  ship.computeFaceNormals();

  // object is pointing in positive y direction
  ship.rotateZ( Math.PI / 2 );

  return ship;
}


export class SceneViewer {
  constructor( dom ) {
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    // TODO: separate helper functions for creating scene elements?

    this.dom = dom;

    // TODO: private attributes?

    let info = document.createElement( 'div' );
    info.id = 'info';
    //info.style.color = '#fff';

    let overlay_text = document.createElement( 'span' );
    overlay_text.className = 'Text';
    overlay_text.style.cursor = 'default';
    overlay_text.style.display = 'inline-block';
    overlay_text.style.verticalAlign = 'middle';
    overlay_text.style.marginLeft = '6px';
    overlay_text.textContent = 'Some Text';

    info.appendChild( overlay_text );

    this.dom.appendChild( info );

    //this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    //this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
    //this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 100000 );
    this.camera = new THREE.PerspectiveCamera();
    this.camera.fov = 50;
    this.camera.near = 0.01;
    this.camera.far = 1000;
    //this.focus = 10;
    // TODO: store camera position in browser (localStorage)?
    //this.camera.position.z = 1000;
    //this.camera.position.set( 10, 10, 5 );
    this.camera.position.set( 0, -10, 5 );
    this.camera.up.set( 0, 0, 1 );
    //this.camera.lookAt( new THREE.Vector3() );


    // TODO:
    //this.referenceCamera

    // TODO: signals?

    this.scene = new THREE.Scene();
    //this.scene.name = 'Scene';
    this.scene.background = new THREE.Color( 0xaaaaaa );

    this.scene.fog = null;
    // TODO: this.scene.userData?

    //this.signals.sceneGraphChanged.active = false;
    //while ( this.scene.children.length > 0 ) {
    //    this.addObject( this.scene.children[ 0 ] );
    //}
    //this.signals.sceneGraphChanged.active = true;
    //this.signals.sceneGraphChanged.dispatch();

    this.sceneHelpers = new THREE.Scene();

    let grid = new THREE.GridHelper( 20, 20, 0x444444, 0x888888 );
    grid.rotation.x = Math.PI/2;
    var array = grid.geometry.attributes.color.array;
    for ( var i = 0; i < array.length; i += 60 ) {
      for ( var j = 0; j < 12; j ++ ) {
        array[ i + j ] = 0.26;
      }
    }
    this.sceneHelpers.add( grid );

    //transformControls = new THREE.TransformControls( this.camera, this.dom );
    // TODO: addEventListener?
    // TODO: setMode etc.
    //this.sceneHelpers.add( transformControls );

    // TODO: Viewport: box, selectionBox?
    // TODO: raycaster, mouse


    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.autoClear = false;
    //this.renderer.autoUpdateScene = false;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    if ( this.renderer.shadowMap ) this.renderer.shadowMap.enabled = true;
    this.dom.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this.onWindowResize );
    this.onWindowResize();


    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new THREE.OrbitControls( this.camera, this.dom );
    this.controls.enabled = true;
    //this.controls.minDistance = 0;
    //this.controls.maxDistance = 1500;  // default: infinite
    this.controls.enableDamping = true;
    this.controls.enableKeys = true;  // only for panning (arrow keys)
    this.controls.dampingFactor = 0.2;
    this.controls.screenSpacePanning = true;
    this.controls.panSpeed = 0.3;
    this.controls.rotateSpeed = 0.1;
    //this.controls.target = ???;


    //this.scene.add( pointLight() );
    this.scene.add( directionalLight() );
    //this.scene.add( hemisphereLight() );
    this.scene.add( new THREE.AmbientLight( 0x505050 ) );

    this.sources = {};
    this.reference = null;  // TODO
  }

  createSource() {
    //let shipMaterial = new THREE.MeshBasicMaterial( { color: 0x2685AA } );
    let shipMaterial = new THREE.MeshPhongMaterial( { color: 0xBC7349 } );
    //let shipMaterial = new THREE.MeshLambertMaterial( { color: 0xBC7349 } );

    let mesh = new THREE.Mesh( shipGeometry(), shipMaterial );
    this.scene.add( mesh );
    return mesh;
  }

  // TODO: change to updateObject() to be able to handle reference, too?
  updateSource(source_id, data) {
    // TODO: error if not available?
    let source = this.sources[source_id];
    let pos = data.pos;
    // TODO: check if Array?
    if (pos) {
      source.position.x = pos[0];
      source.position.y = pos[1];
      if (pos[2]) {
        source.position.z = pos[2];
      } else {
        source.position.z = 0;
      }
    }
    let rot = data.rot;
    // TODO: check if length == 4
    if (rot) {
      let quat = new THREE.Quaternion(rot[0], rot[1], rot[2], rot[3]);
      // TODO: quat.normalize()?
      source.setRotationFromQuaternion(quat);
    }
    let active = data.active;
    if (active !== undefined) {
      source.visible = active;
    }
  }

  removeSource(source_id) {
    // TODO: check if source exists?
    var source = this.sources[source_id];
    if (source === undefined) {
      throw Error(`Source "${source_id}" doesn't exist`);
    }
    this.scene.remove(source);
    delete this.sources[source_id];
  }

  onWindowResize( event ) {
    this.camera.aspect = this.dom.offsetWidth / this.dom.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.dom.offsetWidth, this.dom.offsetHeight );
  }

  animate() {
    requestAnimationFrame( this.animate );

    //this.sceneHelpers.updateMatrixWorld();
    //this.scene.updateMatrixWorld();

    // TODO: switch camera: 3D, reference, top, ???

		//this.referenceCamera.position.copy( pos );

    //splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
    //splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

    this.controls.update();  // needed for enableDamping
    this.renderer.render( this.scene, this.camera );
    this.renderer.render( this.sceneHelpers, this.camera );
  }

  handle_message(msg) {
    if (!(msg instanceof Array)) {
      throw Error(`Invalid message: ${msg}`);
    }
    while (true) {
      let command = msg.shift();
      if (command === undefined) {
        break;
      }

      // TODO: check if command is valid?

      let data = msg.shift();
      if (data === undefined) {
        throw Error(`No data for "${command}" command`);
      }

      switch (command) {
        case 'new':
          // TODO: error if no keys available?
          for (let source_id in data) {
            // TODO: 'reference' is not allowed as source ID
            if (this.sources.hasOwnProperty(source_id)) {
              throw Error(`Source "${source_id}" already exists`);
            }
            this.sources[source_id] = this.createSource();
            console.log(`Created source "${source_id}"`);
            this.updateSource(source_id, data[source_id]);
          }
          break;
        case 'modify':
          // TODO: error if no keys available?
          for (let source_id in data) {
            // TODO: handle reference?
            if (!this.sources.hasOwnProperty(source_id)) {
              throw Error(`Source "${source_id}" does not exist`);
            }
            this.updateSource(source_id, data[source_id]);
          }
          break;
        case 'delete':
          // TODO: check if "data" is Array?
          data.forEach(item => this.removeSource(item));
          break;
        default:
          throw Error(`Unknown command: "${command}"`);
      }
    }
  }
}
