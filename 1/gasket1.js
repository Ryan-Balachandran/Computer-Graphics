"use strict";

var gl;
var points;

var NumPoints = 5000;      // CHANGE NUMBER OF POINTS

const get = function(shader, callback) 
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onerror = function() { alert('Server not up') };
    xmlHttp.onreadystatechange = callback;
    xmlHttp.open('GET', `http://localhost/${shader}`,true);
    xmlHttp.send();
}

const getShaders = function(callback) 
{
    //  Load shaders and initialize attribute buffers
    get('fshader21.glsl', function() 
    {
        if(this.readyState === 4 && this.status === 200) 
        {
            const s = document.createElement('script');
            s.id = "fragment-shader";
            s.type = "x-shader/x-fragment";
            s.textContent = this.responseText;
            document.head.appendChild(s);
            getVertexShader(callback);
        }
    });
}

const getVertexShader = function(callback) 
{
    //  Load shaders and initialize attribute buffers
    get('vshader21.glsl', function() 
    {
        if(this.readyState === 4 && this.status === 200) 
        {
            const s = document.createElement('script');
            s.id = "vertex-shader";
            s.type = "x-shader/x-vertex";
            s.textContent = this.responseText;
            document.head.appendChild(s);
            callback();
        }
    });
}

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices
    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points
    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex
    NumPoints = randomNum(600, 15000);
    
    for ( var i = 0; points.length < NumPoints; ++i ) 
    {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    //
    //  Configure WebGL
    //

    var size = randomNum(1, 4);
    gl.viewport( 0, 0, canvas.width/size, canvas.height/size );       // CHANGE SIZE OF TRIANGLE HERE
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    getShaders( function ()
    {
        //  Load shaders and initialize attribute buffers
        var program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        // Load the data into the GPU
        var bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        // Associate out shader variables with our data buffer
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        program.uColor = gl.getUniformLocation(program, "uColor");
        gl.uniform4fv(program.uColor, [randomNum(0.0, 1.0), randomNum(0.0, 1.0), randomNum(0.0, 1.0), 1.0]);
    
        render();
    });
};


function render() 
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.points, 0, points.length );
    setTimeout( function () {location.reload(); }, 1000)
}

function randomNum(min, max) 
{
    return Math.random() * (max - min) + min;
}