"use strict";

let gl; // WebGL "context"
let vertices = [vec2(1,0)];
let n;
window.onload = function init() {
  //n = document.getElementById("n").value
  n = 15;
  let canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  let program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  let theta = Math.PI / Math.pow(2,(n+1));
  const t = theta;
  var x = Math.cos(theta),y = Math.sin(theta);
  while (x!=1){
    vertices.push(vec2(x,y));
    x = Number(Math.cos(theta));
    y = Number(Math.sin(theta));
    theta +=t;
  }



  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

 
  render();
};



function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_LOOP, 0, vertices.length);
}