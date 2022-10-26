class Circle extends Shape
{
     constructor(p)
     {
          super(p);

          this.id         = `circle${s.shapeCount}`;
          this.type       = "Circle";
          this.centerX    = p.x;
          this.centerY    = p.y;
          this.radius     = p.radius;
     }

     draw()
     {
          super.draw();

          s.ctx.save();
          // s.ctx.translate(this.panX, this.panY);
          s.ctx.scale(this.scale, this.scale); // always scale equally
          s.ctx.rotate(this.rotation);

          s.ctx.beginPath();
          s.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
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
          returnObject.type = "Circle";
          returnObject.centerX = this.centerX;
          returnObject.centerY = this.centerY;
          returnObject.radius = this.radius;

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

     // select()
     // {
     //      console.log("I AM HERE");
     //      // let [x, y] = s.mouseMove(e);
     //      // let dx = x - Circle.centerX;
     //      // let dy = y - Circle.centerY;
     //      // console.log(dx);
     // }
}

s.circleMode = () => {
     s.canvas.onmousemove = undefined;

     // capture keydown events to exit from the mode
     document.addEventListener('keydown', s.modeEscapeEventHandler);

     s.canvas.onmousedown = (e) => {
          let [x, y] = s.mousePosition(e);
          s.createCircle(x, y);
     }
}

s.createCircle = (x, y) => {
     // create the shape object and push it to the shape array
     /** @property linewidth */
     /** @property strokeStyle */
     /** @property strokeAlpha */
     /** @property fillStyle */
     /** @property fillAlpha */
     s.shapeCount++;

     const newCircle = new Circle({x: x, y: y,
          lineWidth: s.linewidth.value,
          strokeStyle: s.colors[0].value,
          strokeAlpha: s.alphas[0].value,
          fillStyle: s.colors[1].value,
          fillAlpha: s.alphas[1].value,
     });

     s.shapeArray.push(newCircle);

     s.canvas.onmousemove = (e) => {
          let [mx, my] = s.mousePosition(e);

          newCircle.radius = Math.abs(mx - newCircle.centerX);

          s.drawAll();
     }

     // capture keydown events to exit from the mode
     document.removeEventListener('keydown', s.modeEscapeEventHandler);
     document.addEventListener('keydown', newCircle.createEscapeEventHandler);

     s.canvas.onmouseup = () => {
          s.canvas.onmouseup = undefined;
          document.removeEventListener('keydown', newCircle.createEscapeEventHandler);
          s.circleMode();
     }
}