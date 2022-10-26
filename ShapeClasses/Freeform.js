class Freeform extends Shape
{
     constructor(p)
     {
          super(p);

          this.type       = "Free_form";
          this.xy         = [];
          this.x          = p.x;
          this.y          = p.y;

          this.scale      = p.scale;
          this.rotation   = p.rotation;
          this.zoom       = p.zoom;
          this.isSelected = false;   
     }

     draw()
     {
          super.draw();

          s.ctx.save();

          s.ctx.restore();
     }

     createEscapeEventHandler(e) 
     {
          super.createEscapeEventHandler(e);
          if(e.code === 'Escape') s.rectMode();
     }
}

s.rectangleMode = () => {
     s.canvas.onmousemove = undefined;

}

s.createRectangle = (x, y) => {

}





