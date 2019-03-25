import {vec3, vec2, vec4, mat2, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Lsystem from './Lsystem';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import Draw from './Draw';
import { format } from 'path';
import Terrain from './Terrain';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  highwayDensity: 0,
  gridDensity: 0,
  // angle: 1,
  // color1: [0.2314 * 255, 0.149 * 255, 0.0],
  // color2: [0.9333 * 255, 0.6706 * 255, 0.6706 * 255],
  terrian_map: false,
  density_map: false,

};

const  m = mat2.fromValues( 0.80,  0.60, -0.60,  0.80 );

let square: Square;
let road: Square;
let screenQuad: ScreenQuad;
let branch: Mesh;
let petal:Mesh;
let time: number = 0.0;

let map: Terrain;

function loadScene() {

  screenQuad = new ScreenQuad();
  screenQuad.create();

  square = new Square();
  square.create();

  road = new Square();
  road.create();


  map = new Terrain();


  // let transform = mat4.create();


}


function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
  let flag = false;

  var show = { add:function(){ flag = true }};

  // Add controls to the gui
  const gui = new DAT.GUI();

  gui.add(controls, 'highwayDensity', 0, 10).step(1);
  gui.add(controls,'gridDensity', 0, 40).step(1);
  // gui.add(controls, 'angle', 0, 2).step(0.1);
  // gui.addColor(controls, 'color1');
  // gui.addColor(controls, 'color2');
  // gui.add(show, 'add').name('Do L-System');
  gui.add(controls, 'terrian_map').onChange(function(){controls.terrian_map == true});
  gui.add(controls, 'density_map').onChange(function(){controls.density_map == true});



  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  //const camera = new Camera(vec3.fromValues(50, 50, 50), vec3.fromValues(50, 50, 50));
  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  //generate L-System
  let l = new Lsystem(0);


  // let curIter = controls.iteration;

  //         l.iteration = controls.iteration;
  //         //.log("check iteration: " + l.iteration + "\n");
  //         //var grammar = l.expansion();
  //         let c1 = vec3.fromValues(controls.color1[0] / 255.0, controls.color1[1] / 255.0, controls.color1[2] / 255.0 );
  //         let c2 = vec3.fromValues(controls.color2[0] / 255.0, controls.color2[1] / 255.0, controls.color2[2] / 255.0 );
  //         l.c1 = c1;
  //         l.c2 = c2;
          //l.draw(branch, petal, 1.0);

  //renderer.render(camera, instancedShader, [pot]);


  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.clear();

    var terrain = 0.0;

    if(controls.terrian_map == true)
    {
      terrain = 1.0;
    }

    var density = 0.0;

    if(controls.density_map == true)
    {
      density = 1.0;
    }

    

    //console.log(terrain);
    

    // let c1 = vec3.fromValues(controls.color1[0] / 255.0, controls.color1[1] / 255.0, controls.color1[2] / 255.0 );
    // let c2 = vec3.fromValues(controls.color2[0] / 255.0, controls.color2[1] / 255.0, controls.color2[2] / 255.0 );
    // let angle = controls.angle;
    // l.c1 = c1;
    // l.c2 = c2;
    // if(flag == true)
    // {
    //   // branch.colorsArray = [];
    //   // // branch.transArray1 = [];
    //   // // branch.transArray2 = [];
    //   // // branch.transArray3 = [];
    //   // // branch.transArray4 = [];
      
    //   // petal.colorsArray = [];

      
    //   //branch.destory;
      
    //   renderer.clear();
    //   //branch.create();

    //   let c1 = vec3.fromValues(controls.color1[0] / 255.0, controls.color1[1] / 255.0, controls.color1[2] / 255.0 );
    //   let c2 = vec3.fromValues(controls.color2[0] / 255.0, controls.color2[1] / 255.0, controls.color2[2] / 255.0 );
    //   let angle = controls.angle;
    //   l.c1 = c1;
    //   l.c2 = c2;

    //   console.log('check updating');
    //       //LSystem
    if(l.iteration != controls.highwayDensity && l.gridIter != controls.gridDensity)
    {
      l.iteration = controls.highwayDensity;
      l.gridIter = controls.gridDensity;
      l.drawMap(square,road, 2);
    }
    else if(l.iteration != controls.highwayDensity)
    {
        l.iteration = controls.highwayDensity;
        //var grammar = l.expansion();
      
        //  l.draw(branch, petal, angle);
        l.drawMap(square, road, 0);
    }
    else if(l.gridIter != controls.gridDensity)
    {
      l.gridIter = controls.gridDensity;
      l.drawMap(square, road, 1);
    }
           
    //       //.log("check iteration: " + l.iteration + "\n");
           
    // }


    flag = false;

    renderer.render(camera, flat, [screenQuad], terrain, density);
    
    renderer.render1(camera, instancedShader, [
      square, road
    ]);


    //renderer.render(camera, instancedShader, [branch, petal]);
    // renderer.render(camera, instancedShader, [branch, petal, pot]);

    //renderer.render(camera, instancedShader, [petal]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
