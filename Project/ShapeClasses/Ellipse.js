class Ellipse extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `ellipse${s.shapeCount}`;
          this.type       = "Ellipse";
          this.centerX    = p.x;
          this.centerY    = p.y;
          this.radiusX    = p.rx;
          this.radiusY    = p.ry;
     }

     draw()
     {
          super.draw();

          var deg = 0;
          var rotation = deg * (Math.PI / 180.0);

          s.ctx.save();
          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);

          s.ctx.beginPath();
          s.ctx.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, rotation, 0, 2 * Math.PI);
          s.ctx.stroke();
          s.ctx.fill();
          s.ctx.restore();
     }

     createEscapeEventHandler(e)
     {
          super.createEscapeEventHandler(e);
          if(e.code === 'Escape') s.circleMode();
     }

     objectOutput()
     {
          const returnObject = super.objectOutput();
          returnObject.id = this.id;
          returnObject.type = "Ellipse";
          returnObject.centerX = this.centerX;
          returnObject.centerY = this.centerY;
          returnObject.radiusX = this.radiusX;
          returnObject.radiusY = this.radiusY;

          return returnObject;
     }

     select() 
     {
   
     }

     translate()
     {

     }

     rotate()
     {

     }

     scale()
     {
          
     }
}

s.ellipseMode = () => {
     s.canvas.onmousemove = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onmousedown = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createEllipse(x, y);
     }
}

s.createEllipse = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property shapeAlpha */
     /** @property shapeStrokeStyle */
     /** @property shapeFillStyle */
     s.shapeCount++;

     const newEllipse = new Ellipse({ x: x, y: y, radiusX: x, radiusY: y,
          lineWidth: s.g('lineSlider').value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          fillStyle: s.colors[1].value,
          fillAlpha: s.alphas[1].value,
     });

     s.shapeArray.push(newEllipse);
     [newEllipse.centerX, newEllipse.centerY] = [x, y];


     s.canvas.onmousemove = (e) => {
          let [x, y] = s.mousePosition(e);

          let rx = Math.abs((x - newEllipse.centerX));
          let ry = Math.abs((y - newEllipse.centerY));

          [newEllipse.radiusX, newEllipse.radiusY] = [rx, ry];
          s.drawAll();
     }

     // capture keydown events to exit from the mode
     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newEllipse.createEscapeEventHandler);

     s.canvas.onmouseup = () => {
          s.canvas.onmouseup = undefined;
          document.removeEventListener('keydown', newEllipse.createEscapeEventHandler);
          s.ellipseMode();
     }
}