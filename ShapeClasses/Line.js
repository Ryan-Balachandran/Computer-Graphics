class Line extends Shape
{
     constructor(p) 
     {
          super(p);

          this.id         = `line${s.shapeCount}`;
          this.type       = "Line";
          this.x1         = p.x1;
          this.y1         = p.y1;
          this.x2         = p.x2;
          this.y2         = p.y2;
          this.handles    = [];
          this.numPoints  = 2;
          this.handleSize = 10;
          // this.length     = 
     }

     draw() 
     {
          super.draw();

          if(this.showHitbox == true)
          {
               s.ctx.save();
               s.ctx.translate(this.translateX, this.translateY);
               s.ctx.scale(this.scale, this.scale); // always scale equally
               s.ctx.rotate(this.rotation);
     
               s.ctx.beginPath();
               s.ctx.moveTo(this.x1, this.y1);
               s.ctx.lineTo(this.x2, this.y2);
               s.ctx.stroke();
               s.ctx.restore();
     
               this.hitBox(); 
          }
          else
          {
               s.ctx.save();
               s.ctx.translate(this.translateX, this.translateY);
               s.ctx.scale(this.scale, this.scale); // always scale equally
               s.ctx.rotate(this.rotation);
     
               s.ctx.beginPath();
               s.ctx.moveTo(this.x1, this.y1);
               s.ctx.lineTo(this.x2, this.y2);
               s.ctx.stroke();
               s.ctx.restore();
          }
     }

     createEscapeEventHandler(e) 
     {
          super.createEscapeEventHandler(e);
          if (e.code === 'Escape') s.lineMode();
     }

     objectOutput()
     {
          const returnObject = super.objectOutput();
          returnObject.id = this.id;
          returnObject.type = "Line";
          returnObject.x1 = this.x1;
          returnObject.y1 = this.y1;
          returnObject.x2 = this.x2;
          returnObject.y2 = this.y2;
          returnObject.handles = this.handles;

          return returnObject;
     }

     hitBox()
     {
          const cx = (this.x1 + this.x2) / 2;
          const cy = (this.y1 + this.y2) / 2;

          s.ctx.save();
          s.ctx.beginPath();
          s.ctx.arc(this.x1, this.y1, this.handleSize, 0, 2 * Math.PI, false);

          s.ctx.fillStyle = 'red';
          s.ctx.strokeStyle = 'red';
          s.ctx.globalAlpha = 0.8;
          s.ctx.fill();

          s.ctx.beginPath();
          s.ctx.lineWidth = 1;
          s.ctx.moveTo(this.x1, this.y1);
          s.ctx.lineTo(cx, cy);
          s.ctx.lineTo(this.x2, this.y2);
          s.ctx.stroke();

          s.ctx.beginPath();
          s.ctx.arc(cx, cy, this.handleSize, 0, 2 * Math.PI, false);
          s.ctx.fill();


          s.ctx.beginPath();
          s.ctx.arc(this.x2, this.y2, this.handleSize, 0, 2 * Math.PI, false);
          s.ctx.fill();

          s.ctx.restore();

          this.handles.push({x: this.x1, y: this.y1});
          this.handles.push({x: cx, y: cy});
          this.handles.push({x: this.x2, y: this.y2});
     }

     select() 
     {
          s.canvas.onmousedown = (e) => {
               let [startX, startY] = s.mousePosition(e);

               if(this.showHitbox === true)
               {
                    for(let i = 0; i < this.handles.length; i++)
                    {
                         if(Math.sqrt(Math.pow(startX - this.handles[i].x, 2) + Math.pow(startY - this.handles[i].y, 2)) < 10)
                         {
                              console.log("HERE?");
                              s.Drag = true;
                              this.isSelected = true;
                              // s.selectedShapeIndex = this.id;
                         }
                    }
               }
          }

          // s.canvas.onmouseup = (e) => {
          //      s.Drag = false;
          // }       
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

s.lineMode = () => {
     s.canvas.onmousemove = undefined;
     // s.canvas.onclick = undefined;
     // s.canvas.onmousedown = undefined;
     s.canvas.ondblclick = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);
     
     s.canvas.onmousedown = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createLine(x, y);
     }
}

s.createLine = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property lineCap */
     s.shapeCount++;

     const newLine = new Line({ x1: x, y1: y, x2: x, y2: y,
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          lineCap: s.lineCap.value
     });

     s.shapeArray.push(newLine);

     s.canvas.onmousemove = (e) => {
          // s.canvas.ondblclick = undefined;
          // s.canvas.onclick = undefined;
          [newLine.x2, newLine.y2] = s.mousePosition(e);
          s.drawAll();
     }

     // capture keydown events to exit from the mode
     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newLine.createEscapeEventHandler);

     s.canvas.onmouseup = () => {
          s.canvas.onmouseup = undefined;
          document.removeEventListener('keydown', newLine.createEscapeEventHandler);
          s.lineMode();
     }
}