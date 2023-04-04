"use strict";

let verticesT = [];
let verticesP = [];
let verticesQ = [];
let n = 0;
let gl; // WebGL "context"
let program;/////////
let width, height;
let mode = "T";
var colorLocation;
window.addEventListener('keydown',this.myfunction,false);
window.onload = function init() {
    let canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL 2.0 isn't available");
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    width = canvas.width;
    height = canvas.height;
    let canvasElem = document.querySelector("canvas");
    canvasElem.addEventListener("mousedown", function(e)
    {
      getMousePosition(canvasElem, e);
    });

    colorLocation = gl.getUniformLocation(program, "vColor");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    


    
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = map_point(0,width,1,-1,x);
    y = map_point(0,height,-1,1,y);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    if (mode=="T"){
        if(verticesP.length<3){
            verticesP.push(vec2(x,y));
        }
        if (verticesP.length==3){
            verticesT.push(verticesP[0],verticesP[1],verticesP[2]);
            verticesP = [];
        }
    }
    if (mode=="Q"){
        if(verticesP.length<4){
            verticesP.push(vec2(x,y));
        }
        if (verticesP.length==4){
            var a = verticesP[0];
            var b = verticesP[1];
            var c = verticesP[2];
            var d = verticesP[3];
            verticesQ.push( a,b,c,d,c,b);
            // verticesQ.push(verticesP[0],verticesP[1],verticesP[2],verticesP[3]);
            
            initializeBuffers(verticesQ);
            for(var i = 0; i<(verticesQ.length)/4;i++){
                gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(),1);
                //drawQuad(gl,verticesP[0],verticesP[1],verticesP[2],verticesP[3],verticesQ);
                //gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesQ), gl.STATIC_DRAW);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
            }
            verticesP = [];
        }
    }
   
    if(verticesP.length!=0){
        initializeBuffers(verticesP);
        gl.drawArrays(gl.POINTS, 0, verticesP.length);
    }
    if(verticesT.length!=0){

        initializeBuffers(verticesT);
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(),1);
        gl.drawArrays(gl.TRIANGLES, 0, verticesT.length);
    }
}


function draw(){
}

function initializeBuffers(vertices){
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    if(vertices.length!=0){
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    }

  
   let vPosition = gl.getAttribLocation(program, "vPosition");
   gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(vPosition);

   
}


// function drawQuad(gl, a,b,c,d,v) {
//     v.push()
//     gl.bufferData(gl.ARRAY_BUFFER, flatten([
//        a,b,c,d,c,b]
//     ), gl.STATIC_DRAW);
//   }
  
function myfunction(e){
    var code = e.keyCode;
    switch (code) {
        case 84: alert("toggled"); 
        if (mode=="T"){
            mode = "Q";
        }
        else{
            mode = "T";
        }
        break; //Left key
        case 82: alert("Reset"); 
        window.location.reload();
        default: ; //Everything else
    }

}