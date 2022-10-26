class Polyline extends Shape
{
     constructor(p)
     {
          super(p);

          this.id   = `polyline${s.shapeCount}`;
          this.type = "Polyline";
          this.xy   = [];  
     }

     draw() 
     {
          super.draw();
  
          s.ctx.save();
          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);
  
          s.ctx.beginPath();

          for(let i = 0; i < this.xy.length; i++)
          {
               if(i === 0)
               {
                    s.ctx.moveTo(this.xy[i].x, this.xy[i].y);
               }
               else
               {
                    s.ctx.lineTo(this.xy[i].x, this.xy[i].y);
               }
          }
          s.ctx.stroke();
          s.ctx.restore();
     }

     createEscapeEventHandler(e) 
     {
          super.createEscapeEventHandler(e);
          if(e.code === 'Escape') s.polylineMode();
     }

     objectOutput()
     {
          const returnObject = super.objectOutput();
          returnObject.id = this.id;
          returnObject.type = "Polyline";
          returnObject.xy = this.xy;

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

s.polylineMode = () => {
     s.canvas.onclick = undefined;
     s.canvas.onmousemove = undefined;
     s.canvas.onmouseup = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onclick = (e) => {
          s.canvas.onclick = undefined;
          s.canvas.onmousedown = undefined;
          s.canvas.onmousemove = undefined;
          s.canvas.onmouseup = undefined;
          // s.canvas.ondblclick = undefined;
          let [x, y] = s.mousePosition(e);
          s.createpolyline(x, y);
     }
}

s.createpolyline = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property lineCap */
     s.shapeCount++;
     
     const newPolyline = new Polyline({ xy: [x, y],
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          lineCap: s.lineCap.value
     });     
     
     newPolyline.xy.push({x: x, y: y});

     s.shapeArray.push(newPolyline);

     s.canvas.onclick = (e) => {
          // s.canvas.onmousemove = undefined;
          // s.canvas.onmouseup = undefined;
          let [x, y] = s.mousePosition(e);
          newPolyline.xy.push({x: x, y: y});
          s.drawAll();
     }

     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newPolyline.createEscapeEventHandler);

     // put double click inside click? <---------------------------------------------------------
     s.canvas.ondblclick = () => {
          newPolyline.xy.pop();
          s.canvas.onclick = undefined;
          s.canvas.ondblclick = undefined;
          // s.canvas.onmousemove = undefined;
          s.drawAll();
          document.removeEventListener('keydown', newPolyline.createEscapeEventHandler);
          // document.addEventListener('keydown', s.modeEscapeEventHandler);
          s.polylineMode();
     }
}