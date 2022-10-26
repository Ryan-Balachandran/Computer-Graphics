class Rectangle extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `rectangle${s.shapeCount}`;
          this.type       = "Rectangle";
          this.x1         = p.x1;
          this.y1         = p.y1;
          this.x2         = 0;
          this.y2         = 0;
          this.x3         = 0;
          this.y3         = 0;
          this.x4         = 0;
          this.y4         = 0;
          this.width      = p.width;
          this.height     = p.height;
     }

     draw()
     {
          super.draw();

          s.ctx.save();
          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);

          // s.ctx.beginPath();
          // s.ctx.rect(this.x1, this.y1, this.width, this.height);
          // s.ctx.stroke();
          // s.ctx.fill();

          s.ctx.beginPath();
          s.ctx.moveTo(this.x1, this.y1);
          s.ctx.lineTo(this.x2, this.y2);
          s.ctx.lineTo(this.x3, this.y3);
          s.ctx.lineTo(this.x4, this.y4);
          s.ctx.closePath();
          s.ctx.stroke();
          s.ctx.fill();

          s.ctx.restore();
     }

     createEscapeEventHandler(e) 
     {
          super.createEscapeEventHandler(e);
          if(e.code === 'Escape') s.rectMode();
     }

     objectOutput()
     {
          const returnObject = super.objectOutput();
          returnObject.id = this.id;
          returnObject.type = "Rectangle";
          returnObject.x1 = this.x1;
          returnObject.y1 = this.y1;
          returnObject.x2 = this.x2;
          returnObject.y2 = this.y2;
          returnObject.x3 = this.x3;
          returnObject.y3 = this.y3;
          returnObject.x4 = this.x4;
          returnObject.y4 = this.y4;
          returnObject.width = this.width;
          returnObject.height = this.height;

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

s.rectangleMode = () => {
     s.canvas.onmousemove = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onmousedown = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createRectangle(x, y);
     }
}

s.createRectangle = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property fillStyle */
     /** @property fillAlpha */
     /** @property lineCap */
     /** @property lineJoin */
     s.shapeCount++;
     
     const newRect = new Rectangle({x1: x, y1: y, x2: x, y2: y, x3: x, y3: y, x4: x, y4: y, 
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          fillStyle: s.colors[1].value,
          fillAlpha: s.alphas[1].value,
          lineJoin: s.lineJoin.value
          // stroke: s.mStrokeShapes, 
          // fill: s.mFillShapes,
     });

     s.shapeArray.push(newRect);

     // const r = s.canvas.getBoundingClientRect();
     s.canvas.onmousemove = (e) => {
          [x3, y3] = s.mousePosition(e);
     
          [newRect.x2, newRect.y2] = [x3, newRect.y1];
          [newRect.x3, newRect.y3] = [x3, y3];
          [newRect.x4, newRect.y4] = [newRect.x1, y3];
  
          // [newRect.width, newRect.height] = [x3 - newRect.x1, y3 - newRect.y1];
          
          s.drawAll();
     }

     // capture keydown events to exit from the mode
     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newRect.createEscapeEventHandler);

     s.canvas.onmouseup = () => {
          s.canvas.onmouseup = undefined;
          document.removeEventListener('keydown', newRect.createEscapeEventHandler);
          s.rectangleMode();
     }
}





/*
rect(x, y, width, height) - outlines where a rectangle or square should be, but does not fill it.
fillRect(x, y, width, height) - creates a rectangle and immediately fills it.
strokeRect(x, y, width, height) - creates a rectangle and immediately outlines it with a stroke.
*/