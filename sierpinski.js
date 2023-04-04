"use strict";
// references:
//https://stackoverflow.com/questions/15367165/finding-coordinates-of-koch-curve/15368026#15368026
//https://github.com/nature-of-code/noc-examples-processing/blob/master/chp08_fractals/Exercise_8_02_KochSnowFlake/Exercise_8_02_KochSnowFlake.pde
let vertices = [];
let current = [];
let gl; // WebGL "context"
window.onload = function init() {
  let canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  let n = 2;
  let program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  let a = vec2(0,Number(Math.pow(3,1/2)/2));
  let b  = vec2(-0.5,0);
  let c = vec2(0.5,0);
  //vertices.push();
  current.push([a,b,c]);
  for(var i = 0; i<n;i++){
      generate();
  }
  for(var i = 0;i<current.length;i++){
    //   for(var j = 0;i<2;j++){
    //       if(!(current[i][j] in vertices)){
            vertices.push(current[i][0],current[i][1],current[i][2]);
    //       }
    //   }
  }
  //console.log(current);



  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

 
  render();
};

function generate(){
    var next = [];
    let a,b,x,y,z,c;
    for(var i =0; i< current.length;i++){
        //console.log(current[i][0]);
        // a = vec2(current[i][0]);
        //console.log("a",a);
        // b = vec2(current[i][1]);
        c = vec2(current[i][2]);
        x = vec2((current[i][0][0]+current[i][1][0])/2, (current[i][0][1]+current[i][1][1])/2);
        y = vec2((current[i][1][0]+current[i][2][0])/2, (current[i][1][1]+current[i][2][1])/2);
        z = vec2((current[i][0][0]+current[i][2][0])/2, (current[i][0][1]+current[i][2][1])/2);
        //console.log(a,b,c,x,y,z);
        next.push([current[i][0],x,z],[x,current[i][1],y],[z,y,current[i][2]]);
        //console.log("m",next);
    }
    current = next;
}
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}