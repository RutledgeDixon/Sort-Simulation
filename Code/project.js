
var gl;
var program;
var vPosition;
var vColor;
var vNormal;
var vertexBuffer;
var indexBuffer; 
var colorBuffer;
var normalBuffer;

var points = [];
var vertices = [];
var indices = [];
var colors = [];
var normals = [];
var ambientColor = [0.2, 0.2, 0.2];

var objYs = [0.1, 0.2, 0.3]; // array of just the y values for sorting
var currentAlgorithm = 'bubble';
var rectProperties = {
    x: 0.1,
    z: 0.2,
} // the x and z properties of all rectangles

function main() {
    //load the canvas and context
    var canvas = document.getElementById("webgl");
    var header = document.getElementById("header");

    gl = getWebGLContext(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    if (!program) { return; }
    gl.useProgram(program);
    gl.program = program;
    vPosition = gl.getAttribLocation(program, "a_Position");
    gl.enableVertexAttribArray(vPosition);
    vColor = gl.getAttribLocation(program, "a_Color");
    gl.enableVertexAttribArray(vColor);
    vNormal = gl.getAttribLocation(program, "a_Normal");
    gl.enableVertexAttribArray(vNormal);

    //set up buffers
    vertexBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer(); 
    colorBuffer = gl.createBuffer();   
    normalBuffer = gl.createBuffer();

    //define ambient light color (fragment shader expects this uniform)
    var aLoc = gl.getUniformLocation(program, "u_Ambient_color");
    if (aLoc) gl.uniform3f(aLoc, ambientColor[0], ambientColor[1], ambientColor[2]);

    runProgram();
    
}

function runProgram() {
    //clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //loop through obj array and draw rectangles
    var startingX = -0.5;
    for (var i = 0; i < objYs.length; i++) {
        var obj = {
            x: rectProperties.x,
            y: objYs[i],
            z: rectProperties.z,
        }
        drawRect(obj, startingX);
        startingX += 0.15; // must be bigger than size in drawRect to avoid overlap
    }

    requestAnimationFrame(runProgram);
}

//takes an obj with x, y, z, id properties, and an extra x value, and draws a 3D rectangle
//can be called multiple times in a row and webgl will still draw multiple rectangles
function drawRect(obj, startingX) {
    //define rectangle vertices based on obj properties
    var rectVertices = [
        startingX, 0, 0,
        startingX + obj.x, 0, 0,
        startingX + obj.x, 0, obj.z,
        startingX, 0, obj.z,
        startingX, obj.y, 0,
        startingX + obj.x, obj.y, 0,
        startingX + obj.x, obj.y, obj.z,
        startingX, obj.y, obj.z
    ];
    var rectIndices = [
        0, 1, 2,   0, 2, 3, // front face
        4, 5, 6,   4, 6, 7, // back face
        0, 1, 5,   0, 5, 4, // bottom face
        2, 3, 7,   2, 7, 6, // top face
        0, 3, 7,   0, 7, 4, // left face
        1, 2, 6,   1, 6, 5  // right face
    ];
    var rectColors = [
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    var rectNormals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];  
    //bind and set buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectNormals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rectIndices), gl.STATIC_DRAW);

    //draw the rectangle
    gl.drawElements(gl.TRIANGLES, rectIndices.length, gl.UNSIGNED_SHORT, 0);
}

// Small runtime health check for quick verification from the browser
window.__projectHealthCheck = function() {
    return {
        glAvailable: !!gl,
        programLoaded: !!program,
        attribs: {
            position: (vPosition !== undefined && vPosition !== -1),
            color: (vColor !== undefined && vColor !== -1),
            normal: (vNormal !== undefined && vNormal !== -1)
        },
        objCount: (typeof objYs !== 'undefined' ? objYs.length : 0)
    };
};