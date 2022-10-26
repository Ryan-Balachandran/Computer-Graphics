class Triangle extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `triangle${s.shapeCount}`;
          this.type       = "Triangle";
          this.x1         = p.x1;
          this.y1         = p.y1;
          this.x2         = p.x2;
          this.y2         = p.y2;
          this.x3         = p.x3;
          this.y3         = p.y3;
     }

     draw()
     {
          super.draw();

          s.ctx.save();
          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);

          s.ctx.beginPath();
          s.ctx.moveTo(this.x1, this.y1);
          s.ctx.lineTo(this.x2, this.y2);
          s.ctx.lineTo(this.x3, this.y3);
          s.ctx.lineTo(this.x1, this.y1);
          s.ctx.closePath();
          s.ctx.stroke();
          s.ctx.fill();
          s.ctx.restore();
     }

     createEscapeEventHandler(e) 
     {
          super.createEscapeEventHandler(e);
          if (e.code === 'Escape') s.triangleMode();
     }

     objectOutput()
     {
          const returnObject = super.objectOutput();
          returnObject.id = this.id;
          returnObject.type = "Triangle";
          returnObject.x1 = this.x1;
          returnObject.y1 = this.y1;
          returnObject.x2 = this.x2;
          returnObject.y2 = this.y2;
          returnObject.x3 = this.x3;
          returnObject.y3 = this.y3;

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


s.triangleMode = () => {
     s.canvas.onmousemove = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onmousedown = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createTriangle(x, y);
     }
}

s.createTriangle = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property fillStyle */
     /** @property fillAlpha */
     /** @property lineCap */
     /** @property lineJoin */
     s.shapeCount++;

     const newTriangle = new Triangle({ x1: x, y1: y, x2: x, y2: y, x3: x, y3: y,
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          fillStyle: s.colors[1].value,
          fillAlpha: s.alphas[1].value,
          lineCap: s.lineCap.value,
          lineJoin: s.lineJoin.value
     });

     s.shapeArray.push(newTriangle);

     // let tri_width = Math.abs()
     s.canvas.onmousemove = (e) => {
          let [x, y] = s.mousePosition(e);

          let tri_width = Math.abs(x - newTriangle.x1);

          [newTriangle.x2, newTriangle.y2] = [x, y];

          if(x >= newTriangle.x1)
          {
               [newTriangle.x3, newTriangle.y3] = [newTriangle.x2 - (2 * tri_width), newTriangle.y2];
          }
          else
          {
               [newTriangle.x3, newTriangle.y3] = [newTriangle.x2 + (2 * tri_width), newTriangle.y2];
          }

          s.drawAll();
     }

     // capture keydown events to exit from the mode
     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newTriangle.createEscapeEventHandler);

     s.canvas.onmouseup = () => {
          s.canvas.onmouseup = undefined;
          document.removeEventListener('keydown', newTriangle.createEscapeEventHandler);
          s.triangleMode();
     }
}