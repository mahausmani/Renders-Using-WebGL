"use strict";
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
  let program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  let a = vec2(0,Number(Math.pow(3,1/2)/2));
  let b  = vec2(-0.5,0);
  let c = vec2(0.5,0);
  //vertices.push();
  current.push([a,b],[b,c],[c,a]);
  let n = 1;
  for(var i = 0; i<n;i++){
      generate();
  }
  for(var i = 0;i<current.length;i++){
      vertices.push(current[i][0]);
      if(i==current.length-1){
          vertices.push(current[i][1]);
      }
  }
  console.log(vertices);



  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

 
  render();
};

function generate(){
    var next = [];
    let u,v,p,q,r,a,b;
    for(var i =0; i< current.length;i++){
        u = vec2(current[i][1][0] - current[i][0][0], current[i][1][1] - current[i][0][1]);
        v = vec2(current[i][0][1] - current[i][1][1], current[i][1][0]- current[i][0][0]);
        a = vec2(current[i][0][0],current[i][0][1]);
        b = vec2(current[i][1][0],current[i][1][1]);
        p = add(a , mult(1/3 , u));
        //Q=A+(1/2)*U+(sqrt(3)/6)*V
        q = subtract(add(a, mult(1/2,u)), mult(Number(Math.sqrt(3)/6),v));
        q = vec2(q[0],q[1]);
        r = add(a,mult(2/3,u));
        next.push([a,p],[p,q],[q,r],[r,b]);
        //console.log("m",next);
    }
    current = next;
}
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
}