class Polygon extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `polygon${s.shapeCount}`;
          this.type       = "Polygon";
          this.xy         = [];
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

          // s.ctx.lineTo(this.xy[0].x, this.xy[0].y);
          s.ctx.closePath();
          s.ctx.stroke();
          s.ctx.fill();
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

s.polygonMode = () => {
     console.log("creating polygon...");
     s.canvas.onclick = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onclick = (e) => {
          s.canvas.onclick = undefined;
          s.canvas.onmousedown = undefined;
          s.canvas.onmousemove = undefined;
          s.canvas.onmouseup = undefined;
          let [x, y] = s.mousePosition(e);
          s.createpolygon(x, y);
     }
}

s.createpolygon = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property lineCap */
     s.shapeCount++;
     
     const newPolygon = new Polygon({xy: [x, y],
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          fillStyle: s.colors[1].value,
          fillAlpha: s.alphas[1].value,
          lineCap: s.lineCap.value,
          lineJoin: s.lineJoin.value
     });     
     
     newPolygon.xy.push({x: x, y: y});

     s.shapeArray.push(newPolygon);

     s.canvas.onclick = (e) => {
          let [x, y] = s.mousePosition(e);
          newPolygon.xy.push({x: x, y: y});

          s.drawAll();
     }

     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newPolygon.createEscapeEventHandler);

     s.canvas.ondblclick = () => {
          newPolygon.xy.pop();
          newPolygon.xy.push([newPolygon.xy[0].x, newPolygon.xy[0].y]);
          s.canvas.onclick = undefined;
          s.canvas.ondblclick = undefined;
          s.canvas.onmouseup = undefined;
          s.drawAll();
          document.removeEventListener('keydown', newPolygon.createEscapeEventHandler);
          s.polygonMode();
     }
}