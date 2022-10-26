class Shape
{
     constructor(p)
     {
          this.lineWidth   = p.lineWidth;
          this.fillStyle   = p.fillStyle;
          this.fillAlpha   = p.fillAlpha;
          this.fill        = p.fill;
          this.strokeStyle = p.strokeStyle;
          this.strokeAlpha = p.strokeAlpha;
          this.stroke      = p.stroke;
          this.lineCap     = p.lineCap;
          this.lineJoin    = p.lineJoin;
          this.show        = true;

          this.translateX  = p.translateX;
          this.translateY  = p.translateY;
          this.scale       = p.scale;
          this.rotation    = p.rotation;
          this.zoom        = p.zoom;
          this.isSelected  = false;
          this.showHitbox  = false;

          this.updateScale();
          this.updateStrokeStyleOrAlpha();
          this.updateFillStyleOrAlpha();
     }

     updateScale() 
     {
          this.scale = Math.pow(1.1, this.zoom);
     }

     constructColors(type) 
     {
          const hexString = this[`${type}Style`];
          // color pickers do not output a value with alpha so to do this the way
          //  I want I have to construct a CSS rgba function. Get hex string
          //  values from '#RRGGBB' and then the alpha.

          return `rgba(${
               parseInt(hexString.substring(1, 3), 16).
               toString(10)}, ${
               parseInt(hexString.substring(3, 5), 16).
               toString(10)}, ${
               parseInt(hexString.substring(5), 16).
               toString(10)}, ${this[`${type}Alpha`] / 100})`;   
     }

     updateStrokeStyleOrAlpha() 
     {
          if (!this.strokeStyle || this.strokeStyle[0] === 'r') return;
          this.strokeStyle = this.constructColors('stroke');
     }

     updateFillStyleOrAlpha() 
     {
          if (!this.fillStyle || this.fillStyle[0] === 'r') return;
          this.fillStyle = this.constructColors('fill');
     }

     draw() 
     {
          s.ctx.lineWidth = this.lineWidth;
          if(this.strokeStyle) s.ctx.strokeStyle = this.strokeStyle;  
          if(this.strokeAlpha) s.ctx.strokeAlpha = this.strokeAlpha;  
          if(this.fillStyle) s.ctx.fillStyle = this.fillStyle;
          if(this.fillAlpha) s.ctx.fillAlpha = this.fillAlpha;
          if(this.lineCap) s.ctx.lineCap = this.lineCap;
          if(this.lineJoin) s.ctx.lineJoin = this.lineJoin;
     }

     createEscapeEventHandler(e) 
     {
          e.preventDefault();
          e.stopPropagation();
          // WARNING: UNDOES SHAPES WHEN MOUSE IN HELD DOWN AFTER DRAWING POLYLINE******************
          if(e.code === 'Escape') 
          {
               // console.log(e.code);
               s.shapeArray.pop();
               s.shapeCount--;
               s.drawAll();
          }
     }

     edit()
     {
          // TO DO
     }

     select()
     {
          // TO DO
     }

     objectOutput()
     {
          return{
               lineWidth: this.lineWidth,
               fillStyle: this.fillStyle,
               fillAlpha: this.fillAlpha,
               fill: this.fill,
               strokeStyle: this.strokeStyle,
               strokeAlpha: this.strokeAlpha,
               stroke: this.stroke,
               lineCap: this.lineCap,
               lineJoin: this.lineJoin,
               show: true,
               scale: this.scale,
               rotation: this.rotation,
               zoom: this.zoom,
               selected: this.isSelected,
          }
     }
}

s.mousePosition = (e) => {
     e.preventDefault();
     e.stopPropagation();
     // find the mouse position
     const r = s.canvas.getBoundingClientRect();
     let x = e.clientX - r.x;
     let y = e.clientY - r.y;

     // console.log(x, y);

     // reverse the angle
     // let angle = Math.atan2(y - s.panY, x - s.panX);
     // angle -= s.rotation;
     // const distance = Math.sqrt((x - s.panX)**2 + (y - s.panY)**2);
     // x = Math.cos(angle) * distance;
     // y = Math.sin(angle) * distance;

     // reverse the scale
     // return [x / s.scale, y / s.scale]
     return [x, y];
}
