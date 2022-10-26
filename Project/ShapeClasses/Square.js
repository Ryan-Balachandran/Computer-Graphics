class Square extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `square${s.shapeCount}`;
          this.type       = "Square";
          this.x1         = p.x1;
          this.y1         = p.y1;
          this.x2         = 0;
          this.y2         = 0;
          this.x3         = 0;
          this.y3         = 0;
          this.x4         = 0;
          this.y4         = 0;
          this.width      = p.width;
     }

     draw()
     {
          super.draw();

          s.ctx.save();
          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);

          // s.ctx.beginPath();
          // s.ctx.rect(this.x1, this.y1, this.width, this.width);
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
          if(e.code === 'Escape') s.squareMode();
     }

     objectOutput()
     {
          const returnObject = super.objectOutput();
          returnObject.id = this.id;
          returnObject.type = "Square";
          returnObject.x1 = this.x1;
          returnObject.y1 = this.y1;
          returnObject.x2 = this.x2;
          returnObject.y2 = this.y2;
          returnObject.x3 = this.x3;
          returnObject.y3 = this.y3;
          returnObject.x4 = this.x4;
          returnObject.y4 = this.y4;
          returnObject.width = this.width;

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

s.squareMode = () => {
     s.canvas.onmousemove = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onmousedown = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createSquare(x, y);
     }
}

s.createSquare = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property fillStyle */
     /** @property fillAlpha */
     /** @property lineCap */
     /** @property lineJoin */
     s.shapeCount++;
     
     const newSquare = new Square({x1: x, y1: y, x2: x, y2: y, x3: x, y3: y, x4: x, y4: y, 
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          fillStyle: s.colors[1].value,
          fillAlpha: s.alphas[1].value,
          lineJoin: s.lineJoin.value
          // stroke: s.mStrokeShapes, 
          // fill: s.mFillShapes,
     });

     s.shapeArray.push(newSquare);

     // const r = s.canvas.getBoundingClientRect();
     s.canvas.onmousemove = (e) => {
          [x3, y3] = s.mousePosition(e);
  
          [newSquare.width, newSquare.width] = [x3 - newSquare.x1, y3 - newSquare.y1];

          [newSquare.x2, newSquare.y2] = [newSquare.x1 + newSquare.width, newSquare.y1];
          [newSquare.x3, newSquare.y3] = [newSquare.x1 + newSquare.width, y3];
          [newSquare.x4, newSquare.y4] = [newSquare.x1, newSquare.y1 + newSquare.width];

          s.drawAll();
     }

     // capture keydown events to exit from the mode
     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newSquare.createEscapeEventHandler);

     s.canvas.onmouseup = () => {
          s.canvas.onmouseup = undefined;
          document.removeEventListener('keydown', newSquare.createEscapeEventHandler);
          s.squareMode();
     }
}