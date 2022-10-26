class Curve extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `curve${s.shapeCount}`;
          this.type       = "Curve";
          this.x1         = p.x1;
          this.y1         = p.y1;
          this.x2         = p.x2;
          this.y2         = p.y2;
          this.x3         = p.x3;
          this.y3         = p.y3;
          this.x4         = p.x4;
          this.y4         = p.y4;
     }

     draw()
     {
          s.ctx.save();

          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);

          s.ctx.beginPath();
          s.ctx.moveTo(this.x1, this.y1);
          s.ctx.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
          s.ctx.stroke();

          s.ctx.restore();
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
          returnObject.type = "Curve";
          returnObject.x1 = this.x1;
          returnObject.y1 = this.y1;
          returnObject.x2 = this.x2;
          returnObject.y2 = this.y2;
          returnObject.x3 = this.x3;
          returnObject.y3 = this.y3;
          returnObject.x4 = this.x4;
          returnObject.y4 = this.y4;

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

s.curveMode = (e) => {
     s.canvas.onmousemove = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);
     
     s.canvas.onclick = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createCurve(x, y);
     }
}

s.point = (x, y) => {
     s.ctx.beginPath();
     s.ctx.moveTo(x, y - 10);
     s.ctx.lineTo(x, y + 10);
     s.ctx.moveTo(x - 10, y);
     s.ctx.lineTo(x + 10, y);
     s.ctx.stroke();
}

s.createCurve = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property lineCap */
     s.shapeCount++;
      let p = 0;
     
     const newCurve = new Curve({x1: x, y1: y, x2: x, y2: y, x3: x, y3: y, x4: x, y4: y,
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          lineCap: s.lineCap.value
     });     
     
     s.shapeArray.push(newCurve);

     [newCurve.x1, newCurve.y1] = [x, y];
     p++;
     s.point(x, y);

     s.canvas.onclick = (e) => {
          let [x, y] = s.mousePosition(e);

          switch(p)
          {               
               case 1:
                    [newCurve.x2, newCurve.y2] = [x, y];
                    p++;
                    s.point(x, y);
               break;
               
               case 2:
                    [newCurve.x3, newCurve.y3] = [x, y];
                    p++;
                    s.point(x, y);
               break;

               case 3:
                    [newCurve.x4, newCurve.y4] = [x, y];
                    p = 0;
                    s.point(x, y);

                    document.removeEventListener('keydown', s.modeEscapeEventHandler);
                    document.addEventListener('keydown', newCurve.createEscapeEventHandler);

                    s.canvas.onclick = undefined;
                    s.drawAll();
                    document.removeEventListener('keydown', newCurve.createEscapeEventHandler);
          
                    s.curveMode();
               break;

               default:
                    console.log("ERROR");
               break;
          }
          // Watch Line being made
          // s.drawAll();     
     }
}