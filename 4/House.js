"use strict";

var canvas;
var gl;

var numVertices = 51; 

var pointsArray = [];
var colorsArray = [];

var isLocked = false;
var cameraTraverse = false;

let x1, y1, z1, x2, y2, z2;
let start;
let ex, ey, ez;

const g = function (id) { return document.getElementById(id); }

var vertices = [
    vec4(0, 0, 30, 1.0),
    vec4(16, 0, 30, 1.0),
    vec4(16, 10, 30, 1.0),
    vec4(8, 16, 30, 1.0),
    vec4(0, 10, 30, 1.0),

    vec4(0, 0, 54, 1.0),
    vec4(16, 0, 54, 1.0),
    vec4(16, 10, 54, 1.0),
    vec4(8, 16, 54, 1.0),
    vec4(0, 10, 54, 1.0)
];

var vertexColors = [
    vec4( 0.9, 0.4, 0.2, 1.0 ),  // orange
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 0.3, 0.1, 0.1, 1.0 ),  // brown
    vec4( 0.6, 0.6, 0.6, 1.0 ),  // gray
];

var near   = -1;
var far    = 1;
var radius = 1;
var theta  = 0.0;
var phi    = 0.0;
var dr     = 5.0 * Math.PI/180.0;

var left   = -1.0;
var right  = 1.0;
var ytop   = 1.0;
var bottom = -1.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d)
{
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
}

function colorCube()
{
    quad(1, 0, 4, 2);
    quad(2, 3, 4, 2);
    
    quad(6, 1, 2, 7);

    quad(5, 6, 1, 0);
    quad(0, 5, 9, 4);

    quad(4, 3, 8, 9);
    quad(3, 2, 7, 8);

    quad(7, 9, 5, 6);
    quad(8, 7, 9, 8);
}

window.onload = function init() 
{
    // Get the base layer canvas object
    canvas = g("layer");

    gl = WebGLUtils.setupWebGL( canvas );
    if (!gl) { alert( "WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Normalizing House Coordinates 
    vertices.forEach((x, i) => {
        // console.log(u);
        x.forEach((yz, j) => {
            if(j == 3)
            {
                // NOP
            }
            else
            {
                if(j == 0)
                {
                    vertices[i][j] = (yz - 8)/20;
                }
                else if(j == 1)
                {
                    vertices[i][j] = (yz - 5)/20;
                }
                else if(j == 2)
                {
                    vertices[i][j] = (yz - 42)/20;
                }
            }
        })
        // console.log(u)
    })

    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // sliders for viewing parameters
    g("depthSlider").oninput = function(event) 
    {
        far = event.target.value/2;
        near = -event.target.value/2;
    };

    g("radiusSlider").oninput = function(event) 
    {
       radius = event.target.value;
    };

    g("thetaSlider").oninput = function(event) 
    {
        theta = event.target.value* Math.PI/180.0;
    };
    
    g("phiSlider").oninput = function(event) 
    {
        phi = event.target.value* Math.PI/180.0;
    };

    g("heightSlider").oninput = function(event) 
    {
        ytop = event.target.value/2;
        bottom = -event.target.value/2;
    };

    g("widthSlider").oninput = function(event) 
    {
        right = event.target.value/2;
        left = -event.target.value/2;
    };

    let positions = [g("X1"), g("Y1"), g("Z1"), g("X2"), g("Y2"), g("Z2")];
    let outputs = [g("output_x1"), g("output_y1"), g("output_z1"), g("output_x2"), g("output_y2"), g("output_z2")];

    for(let i = 0; i < 6; i++)
    {
        outputs[i].innerHTML = positions[i].value;
    }

    positions[0].oninput = function () 
    {
        outputs[0].innerHTML = this.value;
    }

    positions[1].oninput = function () 
    {
        outputs[1].innerHTML = this.value;
    }

    positions[2].oninput = function () 
    {
        outputs[2].innerHTML = this.value;
    }

    positions[3].oninput = function () 
    {
        outputs[3].innerHTML = this.value;
    }

    positions[4].oninput = function () 
    {
        outputs[4].innerHTML = this.value;
    }

    positions[5].oninput = function () 
    {
        outputs[5].innerHTML = this.value;
    }

    g("pointlock").onclick = function ()
    {
        if(isLocked == false)
        {
            g("X1").disabled = true;
            g("Y1").disabled = true;
            g("Z1").disabled = true;

            g("X2").disabled = true;
            g("Y2").disabled = true;
            g("Z2").disabled = true;
            g("pointlock").style.color = "red";
            g("pointlock").style.fontWeight = "bold";
            isLocked = true;
        }
        else if(isLocked == true)
        {
            g("X1").disabled = false;
            g("Y1").disabled = false;
            g("Z1").disabled = false;

            g("X2").disabled = false;
            g("Y2").disabled = false;
            g("Z2").disabled = false;
            g("pointlock").style.color = "black";
            g("pointlock").style.fontWeight = "normal";
            isLocked = false;
        }
    }

    g("camera").onclick = function()
    {
        start = Date.now();
        cameraTraverse = !cameraTraverse;

        if(cameraTraverse)
        {
            x1 = g("X1").value;
            y1 = g("Y1").value;
            z1 = g("Z1").value;

            x2 = g("X2").value;
            y2 = g("Y2").value;
            z2 = g("Z2").value;
        }
    }

    render();
}

var render = function() 
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let camera = g("cameraSlider").value
    const scalar = camera;

    ex = radius*Math.sin(phi);
    ey = radius*Math.sin(theta);
    ez = radius*Math.cos(phi);

    if(cameraTraverse)
    {
        const elapsed_time = (Date.now() - start) * scalar;
        // ex = (x1 - x2) * elapsed_time;
        // ey = (y1 - y2) * elapsed_time;
        // ez = (z1 - z2) * elapsed_time;

        ex = (1 - elapsed_time) * x1 + elapsed_time * x2;
        ex = (1 - elapsed_time) * y1 + elapsed_time * y2;
        ex = (1 - elapsed_time) * z1 + elapsed_time * z2;

        console.log(elapsed_time);

        if(elapsed_time > 2)
        {
            cameraTraverse = false;
        }
    }

    // eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta), radius*Math.cos(phi));
    eye = vec3(ex, ey, ez);
    // const at = vec3(g("X1").value, g("Y1").value, g("Z1").value);

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);

    requestAnimFrame(render);
}
