"use strict";

var canvas;
var gl;

var points = [];
var colors = [];

var NumTimesToSubdivide = 3;
var theta = [0,0,0];
var thetaLoc;
var stop;
var axis = 2;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var n = 2;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext("webgl2");
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];
    document.getElementById( "bn" ).onclick = function () {
        n = document.getElementById("n").value;
    
        divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                     n);
                     
                     
                     
                     gl.viewport( 0, 0, canvas.width, canvas.height );
                     gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
                     gl.enable(gl.DEPTH_TEST);
                     var program = initShaders( gl, "vertex-shader", "fragment-shader" );
                     gl.useProgram( program );
                     var cBuffer = gl.createBuffer();
                     gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                     gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
                     
                     var vColor = gl.getAttribLocation( program, "vColor" );
                     gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
                     gl.enableVertexAttribArray( vColor );
                     
                     var vBuffer = gl.createBuffer();
                     gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                     gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
                     
                     var vPosition = gl.getAttribLocation( program, "vPosition" );
                     gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    thetaLoc = gl.getUniformLocation(program, "theta");
    document.getElementById( "xButton" ).onclick = function () {
      axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
      axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
      axis = zAxis;
    };
    document.getElementById( "stop" ).onclick = function () {
      stop = 0;
    };
    document.getElementById( "resume" ).onclick = function () {
      stop = 1;
    };
    render();
  };
  
};
function triangle( a, b, c, color )
{

    var baseColors = [
        vec3(1.0, 0.0, 0.0),//r
        vec3(0.0, 1.0, 0.0),//g
        vec3(0.0, 0.0, 1.0),//b
        vec3(0.0, 0.0, 0.0)//bl
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
}

function tetra( a, b, c, d )
{
    triangle( a, c, b, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
    triangle( b, c, d, 3 );
}

function divideTetra( a, b, c, d, count )
{
    // check for end of recursion

    if ( count === 0 ) {
        tetra( a, b, c, d );
    }

    // find midpoints of sides
    // divide four smaller tetrahedra

    else {
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var ad = mix( a, d, 0.5 );
        var bc = mix( b, c, 0.5 );
        var bd = mix( b, d, 0.5 );
        var cd = mix( c, d, 0.5 );

        --count;

        divideTetra(  a, ab, ac, ad, count );
        divideTetra( ab,  b, bc, bd, count );
        divideTetra( ac, bc,  c, cd, count );
        divideTetra( ad, bd, cd,  d, count );
    }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(stop!=0)
    theta[axis] += 0.5;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    requestAnimationFrame(render);
}