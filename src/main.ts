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
  iteration: 1,
  // angle: 1,
  // color1: [0.2314 * 255, 0.149 * 255, 0.0],
  // color2: [0.9333 * 255, 0.6706 * 255, 0.6706 * 255],
  terrian_map: false,
  density_map: false,

};

const  m = mat2.fromValues( 0.80,  0.60, -0.60,  0.80 );

let square: Square;
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


  map = new Terrain();


  // let transform = mat4.create();


  // let offsetsArray = [];
  // let colorsArray = [];
  // let n: number = 0.0;
  
  //   //square.transArray1.push(transform[0] );
  //   square.transArray1.push(1);
  //   square.transArray1.push(transform[1]);
  //   square.transArray1.push(transform[2]);
  //   square.transArray1.push(transform[3] );

  //   square.transArray2.push(transform[4]);
  //   // square.transArray2.push(transform[5] );
  //   square.transArray2.push(1);
  //   square.transArray2.push(transform[6]);
  //   square.transArray2.push(transform[7] );
    
  //   square.transArray3.push(transform[8]);
  //   square.transArray3.push(transform[9]);
  //   // square.transArray3.push(transform[10]);
  //   square.transArray3.push(1);
  //   square.transArray3.push(transform[11]);

  //   // square.transArray4.push(transform[12]);
  //   // square.transArray4.push(transform[13]);
  //   // square.transArray4.push(transform[14]);
  //   // square.transArray4.push(transform[15]);

  // square.transArray1.push(0.01);
  // square.transArray1.push(0);
  // square.transArray1.push(0);
  // square.transArray1.push(0);

  // square.transArray2.push(0);
  // square.transArray2.push(10);
  // square.transArray2.push(0);
  // square.transArray2.push(0);

  // square.transArray3.push(0);
  // square.transArray3.push(0);
  // square.transArray3.push(1);
  // square.transArray3.push(0);

  //   square.transArray4.push(0);
  //   square.transArray4.push(0);
  //   square.transArray4.push(0);
  //   square.transArray4.push(1);



    // square.transArray1.push(10);
    // square.transArray1.push(0);
    // square.transArray1.push(0);
    // square.transArray1.push(0);
  
    // square.transArray2.push(0);
    // square.transArray2.push(0.01);
    // square.transArray2.push(0);
    // square.transArray2.push(0);
  
    // square.transArray3.push(0);
    // square.transArray3.push(0);
    // square.transArray3.push(1);
    // square.transArray3.push(0);
  
    //   square.transArray4.push(0);
    //   square.transArray4.push(0);
    //   square.transArray4.push(0);
    //   square.transArray4.push(1);

  //     n ++;
    


  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     offsetsArray.push(i);
  //     offsetsArray.push(j);
  //     offsetsArray.push(0);

  //     colorsArray.push(i / n);
  //     colorsArray.push(j / n);
  //     colorsArray.push(1.0);
  //     colorsArray.push(1.0); // Alpha channel
  //   }
  // }
  // let offsets: Float32Array = new Float32Array(offsetsArray);
  // let colors: Float32Array = new Float32Array(colorsArray);


  // let array1: Float32Array = new Float32Array(square.transArray1);
  //       let array2: Float32Array = new Float32Array(square.transArray2);
  //       let array3: Float32Array = new Float32Array(square.transArray3);
  //       let array4: Float32Array = new Float32Array(square.transArray4);
  // square.setInstanceVBOs1(array1, array2, array3, array4);
  // square.setNumInstances(2);


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

  gui.add(controls, 'iteration', 1, 8).step(1);
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
    if(l.iteration != controls.iteration)
    {
        l.iteration = controls.iteration;
        //var grammar = l.expansion();
      
        //  l.draw(branch, petal, angle);
        l.drawRoad(square);
    }
           
    //       //.log("check iteration: " + l.iteration + "\n");
           
    // }


    flag = false;

    renderer.render(camera, flat, [screenQuad], terrain, density);
    
    renderer.render1(camera, instancedShader, [
      square,
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
