"use strict";

let gl;
let points;
let redRange, greenRange, blueRange, colorPicker, PSRange, NOPRange, canvas;
let moveup, movedown, moveleft, moveright, shrink, grow, reset, increase, decrease;

const g = function(id) { return document.getElementById(id); }

const get = function(shader, callback) 
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onerror = function() {alert('Server not up')};
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

let program;

const render = function() 
{
    program.fr = gl.getUniformLocation(program, 'fr');
    program.fg = gl.getUniformLocation(program, 'fg');
    program.fb = gl.getUniformLocation(program, 'fb');

    gl.uniform1f(program.fr, parseFloat(redRange.value));
    gl.uniform1f(program.fg, parseFloat(greenRange.value));
    gl.uniform1f(program.fb, parseFloat(blueRange.value));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}

const loadDataIntoGPU = function() 
{
    if(!program) return;

    // Load the data into the GPU
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    program.vPointSize = gl.getUniformLocation(program, 'vPointSize')
    gl.uniform1f(program.vPointSize, parseFloat(PSRange.value));

    render();
}

let p, vertices;

const changeGeometry = function() 
{
    // And, add our initial point into our array of points
    points = [p];

    // Compute new points - Each new point is located midway between last point
    //  and a randomly chosen vertex
    for(let i = 0; points.length < NOPRange.value; ++i) 
    {
        const j = Math.floor(Math.random() * 3);
        p = add(points[i], vertices[j]);
        p = scale(0.5, p);
        points.push(p);
    }

    loadDataIntoGPU();
}

let pt1 = vec2(-1, -1);
let pt2 = vec2(0, 1);
let pt3 = vec2(1, -1);

const sierpinskiGasket = function() 
{
    // Specify a starting point p for our iterations p must lie inside any set
    //  of three vertices
    vertices = [pt1, pt2, pt3];
    const u = add(vertices[0], vertices[1]);
    const v = add(vertices[0], vertices[2]);
    p = scale(0.25, add(u, v));

    changeGeometry();

    getShaders(function() 
    {
        program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
        gl.useProgram( program );

        loadDataIntoGPU();
    });
}
 
function hexToRgb(hex)
{
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  	
 	return result ? 
    {
    	r: parseInt(result[1], 16)/255,
      	g: parseInt(result[2], 16)/255,
  		b: parseInt(result[3], 16)/255,
    } : null;
}

// window is the "this", the context therefore no need to specify it here.
//  Saves keystrokes. :)
onload = function init() 
{
    canvas = g( "sierpinskiCanvas" );
    let scale = 0.1;

    //  Configure WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0,0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    redRange    = g('redRange');
    greenRange  = g('greenRange');
    blueRange   = g('blueRange');
    PSRange     = g('PSRange');
    NOPRange    = g('NOPRange');
    colorPicker = g('colorPicker');

    redRange.oninput = render;
    greenRange.oninput = render;
    blueRange.oninput = render;
    PSRange.oninput = loadDataIntoGPU;
    NOPRange.oninput = changeGeometry;

    colorPicker.onchange = function() 
    {
        const hex = colorPicker.value;
        const result = hexToRgb(hex);
        redRange.value = result.r;
        greenRange.value = result.g;
        blueRange.value = result.b;
        render();
    };

    const randColorButton = g('randColorButton');
    randColorButton.onclick = function() 
    {
        redRange.value = Math.random();
        greenRange.value = Math.random();
        blueRange.value = Math.random();
        render();
    };

    const up = g('moveup');
    const down = g('movedown');
    const left = g('moveleft');
    const right = g('moveright');
    const shrink = g('shrink');
    const grow = g('grow');
    const reset = g('reset');
    const increase = g('increase');
    const decrease = g('decrease');

    up.onclick = function()
    {
        pt1[1] += scale;
        pt2[1] += scale;
        pt3[1] += scale;

        sierpinskiGasket();
    };

    down.onclick = function()
    {
        pt1[1] -= scale;
        pt2[1] -= scale;
        pt3[1] -= scale;

        sierpinskiGasket();
    };

    left.onclick = function()
    {
        pt1[0] -= scale;
        pt2[0] -= scale;
        pt3[0] -= scale;

        sierpinskiGasket();
    };

    right.onclick = function()
    {
        pt1[0] += scale;
        pt2[0] += scale;
        pt3[0] += scale;

        sierpinskiGasket();
    };

    shrink.onclick = function()
    {
        pt1[0] += scale;
        pt1[1] += scale;

        pt2[1] -= scale;

        pt3[0] -= scale;
        pt3[1] += scale;

        sierpinskiGasket();
    };

    grow.onclick = function()
    {
        pt1[0] -= scale;
        pt1[1] -= scale;

        pt2[1] += scale;

        pt3[0] += scale;
        pt3[1] -= scale;

        sierpinskiGasket();
    };

    increase.onclick = function()
    {
        scale += 0.1;
        sierpinskiGasket();
    };

    decrease.onclick = function()
    {
        scale -= 0.1;
        sierpinskiGasket();
    };

    reset.onclick = function()
    {
        pt1[0] = -1;
        pt1[1] = -1;

        pt2[0] = 0;
        pt2[1] = 1;

        pt3[0] = 1;
        pt3[1] = -1;

        scale = 0.1;

        sierpinskiGasket();
    };


    sierpinskiGasket();
};
