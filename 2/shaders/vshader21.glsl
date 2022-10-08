attribute vec4 vPosition;
uniform float vPointSize;

void main() 
{
    gl_PointSize = vPointSize;
    gl_Position = vPosition;
}
