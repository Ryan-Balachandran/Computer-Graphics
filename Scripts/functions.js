s.exportToJsonFile = (JSONData) => {
     const filename = 'shape.json';

     let dataStr = JSON.stringify(JSONData);
     let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

     let linkElement = document.createElement('a');
     linkElement.setAttribute('href', dataUri);
     linkElement.setAttribute('download', filename);

     linkElement.style.display = 'none';
     document.body.appendChild(linkElement);
     linkElement.click();
     document.body.removeChild(linkElement);
}


// callback for mouse down events
s.mouse_down = function (e) 
{
     s.xDown = parseInt(e.clientX - s.offsetX);
     s.yDown = parseInt(e.clientY - s.offsetY);

     s.isDrag = true;
     s.coords = "Mouse Down => X: " + s.xDown + " Y: " + s.yDown;
     s.g("val1").textContent = s.coords;
     // return [s.xDown, s.yDown];
}


// callback for mouse move events
s.mouse_move = function (e)
{
    s.x = parseInt(e.clientX - s.offsetX);
    s.y = parseInt(e.clientY - s.offsetY);
//     if(!s.isDrag) return;

    s.coords = "Mouse Move => X: " + s.x + " Y: " + s.y;
    s.g("val2").textContent = s.coords;
//     return [s.x, s.y];
}


// callback for mouse up events
s.mouse_up = function (e) 
{
     s.xUp = parseInt(e.clientX - s.offsetX);
     s.yUp = parseInt(e.clientY - s.offsetY);
     s.isDrag = false;

     s.coords = "Mouse Up => X: " + s.xUp + " Y: " + s.yUp;
     s.g("val3").textContent = s.coords;

     let dx = s.xUp - s.xDown;
     let dy = s.yUp - s.yDown

     s.coords = "Down -> Up => dX: " + dx + " dY: " + dy;
     s.g("val4").textContent = s.coords;
     // return [s.xUp, s.yUp];
}


s.isMouseOnShape = () => {
     // <------------------------------------------------------------------------------------------------
}






s.detectHandles = () => {
     let handle = [];
     s.canvas.onmousedown = (e) => {
          let [startX, startY] = s.mousePosition(e);
          // console.log(x, y);

          s.shapeArray.forEach(shape => {
               if(shape.showHitbox === true)
               {
                    // console.log("Look for that hitbox!");
                    handle = shape.handles;

                    for(let i = 0; i < handle.length; i++)
                    {
                         if(Math.sqrt(Math.pow(startX - handle[i].x, 2) + Math.pow(startY - handle[i].y, 2)) < 10)
                         {
                              s.isDrag = true;

                              if(i === 0)
                              {
                                   s.ctx.save();

                                   s.canvas.onmousemove = (e) => {
                                        if(!s.isDrag) return;
                                        let [x, y] = s.mousePosition(e);

                                        var dx = x - startX;
                                        var dy = y - startY;

                                        s.ctx.translate(dx, dy);
                                        // shape.x1 += dx;
                                        // shape.y1 += dy;
                                        // shape.x2 += dx;
                                        // shape.y2 += dy;

                                        s.drawAll();

                                        startX = x;
                                        startY = y;
                                   }

                                   s.canvas.onmouseup = (e) => {
                                        s.isDrag = false;
                                        s.drawAll();
                                   }
                                   s.ctx.restore();
                              }

                              if(i === 1)
                              {
                                   s.ctx.save();

                                   s.canvas.onmousemove = (e) => {
                                        if(!s.isDrag) return;
                                        let [x, y] = s.mousePosition(e);

                                        var dx = x - startX;
                                        var dy = y - startY;

                                        s.ctx.translate(dx, dy);
                                        s.ctx.beginPaath();
                                        s.ctx.rect(dx,dy, 2, 2);
                                        s.ctx.stroke();
                                        // shape.x1 += dx;
                                        // shape.y1 += dy;
                                        // shape.x2 += dx;
                                        // shape.y2 += dy;

                                        s.drawAll();

                                        startX = x;
                                        startY = y;
                                   }

                                   s.canvas.onmouseup = (e) => {
                                        s.isDrag = false;

                                        s.drawAll();
                                   }
                                   s.ctx.restore();

                              }

                              if(i === 2)
                              {
                                   s.ctx.save();

                                   s.canvas.onmousemove = (e) => {
                                        if(!s.isDrag) return;
                                        let [x, y] = s.mousePosition(e);

                                        var dx = x - startX;
                                        var dy = y - startY;

                                        s.ctx.translate(dx, dy);
                                        // shape.x1 += dx;
                                        // shape.y1 += dy;
                                        // shape.x2 += dx;
                                        // shape.y2 += dy;

                                        s.drawAll();

                                        startX = x;
                                        startY = y;
                                   }

                                   s.canvas.onmouseup = (e) => {
                                        s.drawAll();
                                   }
                                   s.ctx.restore();

                              }
                         }
                    }
               }
          });
     }
}







s.drawAll = () => {
     // clear the canvas before painting stuff
     s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);

     //------------------------------------------------------------------------
     /* ADD SHAPES TO LIST */
     // get the select #menu
     // const shape = document.querySelector('#list');

     // let object = s.shapeArray;
     // // add shape object
     // s.shapeArray.forEach(x => {
     //      shape.appendChild(s.createOptionItem('Home'));
     // });

     // shape.appendChild(s.createOptionItem('Home'));
     // shape.appendChild(s.createOptionItem('Services'));
     // shape.appendChild(s.createOptionItem('About Us'));
     //------------------------------------------------------------------------

     // call isMouseInShape()

     s.ctx.save();

     // FOR EACH, DO TRANSLATE, SCALE, ROTATE
     // s.ctx.translate(s.panX, s.panY);
     s.ctx.scale(s.scale, s.scale); // always scale equally
     s.ctx.rotate(s.rotation);

     if(s.showGrid === false)
     {
          s.shapeArray.forEach(shape => { if(shape.show) {shape.draw(); }});    
     }
     if(s.showGrid === true)
     {
          s.drawGrid();
          s.shapeArray.forEach(shape => { if(shape.show) shape.draw(); });
     }

     if(s.shapeSelect.value === 'none' && s.transformSelect.value === 'Select')
     {
          // s.ctx.save();
          s.detectHandles();
          // s.ctx.restore();

          // for(let i = 0; i < s.shapeArray.length; i++)
          // {
          //      s.shapeArray[i].select();

          //      if(s.shapeArray[i].isSelected === true)
          //      {
          //           console.log("WE HAVE A SHAPE");
          //           s.singleSelect = s.shapeArray[i];
          //      }
          // }

          // if(s.selectedShapeIndex != undefined)
          // {
          //      console.log("Selected a shape");
          //      console.log(s.singleSelect);
     
          // }
     }

     s.ctx.restore();

     // console.log(s.shapeArray);
     // SELECT HERE?
}


s.instantiateShapes = () => {
     s.shapeObject.forEach(shape => { 
          // console.log("SHAPE TYPE: ", shape.type); 
          
          switch(shape.type)
          {
               case "Line": s.shapeArray.push(new Line(shape)); break;
               case "Triangle": s.shapeArray.push(new Triangle(shape)); break;
               case "Square": s.shapeArray.push(new Square(shape)); break;
               case "Rectangle": s.shapeArray.push(new Rectangle(shape)); break;
               case "Circle": s.shapeArray.push(new Circle(shape)); break;
               case "Curve": s.shapeArray.push(new Curve(shape)); break;
               case "Ellipse": s.shapeArray.push(new Ellipse(shape)); break;
               case "Polyline": s.shapeArray.push(new Polyline(shape)); break;
               case "Polygon": s.shapeArray.push(new Polygon(shape)); break;
               default: break;
          }
     });
}


s.drawGrid = () => {
     let width = s.canvas.width;
     let height = s.canvas.height;
     let offset = 0.5;

     let x1 = [];
     let y1 = [];

     s.ctx.save();

     for(let x = 0; x < width; x += 20)
     {
          s.ctx.moveTo(x + offset, 0);
          s.ctx.lineTo(x + offset, height);
          x1.push(x + offset);
     }

     for(let y = 0; y < height; y += 20)
     {
          s.ctx.moveTo(0, y + offset);
          s.ctx.lineTo(width, y + offset);
          y1.push(y + offset);
     }

     s.ctx.moveTo(width, 0);
     s.ctx.lineTo(width, height);
     s.ctx.lineTo(0, height);
     s.ctx.strokestyle = 'black';
     s.ctx.stroke();

     s.ctx.restore();
}


s.gridPoints = () => {
     let width = s.canvas.width;
     let height = s.canvas.height;
     let offset = 0.5;

     let x1 = [];
     let y1 = [];

     for(let x = 0; x < width; x += 20)
     {
          x1.push(x + offset);
     }

     for(let y = 0; y < height; y += 20)
     {
          y1.push(y + offset);
     }

     for(let i = 0; i < x1.length; i++)
     {
          for(let j = 0; j < y1.length; j++)
          {
               s.gridArray.push({x: x1[i], y: y1[j]});
          }
     }
}


// NOT IN USE
s.fillNewShapeClick = () => {
     s.mFillShapes = !s.mFillShapes;
     if (!s.mFillShapes && !s.mStrokeShapes) s.mStrokeShapes = true;
     s.vStrokeNFill();
}


// NOT IN USE
s.strokeNewShapeClick = () => {
     s.mStrokeShapes = !s.mStrokeShapes;
     if (!s.mFillShapes && !s.mStrokeShapes) s.mFillShapes = true;
     s.vStrokeNFill();
}


// NOT IN USE
// STROKE AND FILL BUTTONS TO DETERMINE IT YOU ARE USING STROKE, FILL OR BOTH
s.vStrokeNFill = () => {
     let st = s.g('fillColor');
}


s.rotate = function (cx, cy, x, y, radians) 
{
     const
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
          ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
     return [nx, ny];
}


s.createOptionItem = (name ) => {
     let option = document.createElement('option');
     option.textContent = name;
     return option;
}


s.setUpElements = () => {
     s.menubtns = [s.g("new_diagram"), s.g("save_as_image"), s.g("save_as_diagram"), s.g("load"), s.g("undo"), s.g("redo"), s.g("copy"), s.g("paste"), s.g("clear")];

     s.colors = [s.g('strokeColor'), s.g('fillColor')];
     s.alphas = [s.g('strokeAlpha'), s.g('fillAlpha')];
 
     s.shapes = ["Free_form", "Line", "Triangle", "Square", "Rectangle", "Circle", "Ellipse", "Curve", "Polyline", "Polygon", "none"];
     s.shapeSelect = s.g('shapes');
 
     s.transformations = ['Select', 'Rotate', 'Scale', 'none'];
     s.transformSelect = s.g('transformation');

     s.linewidth = s.g("lineSlider");
     s.output = s.g("lineoutput");

     s.lineCap = s.g('lineCap');
     s.lineJoin = s.g('lineJoin');

     s.grid = s.g('grid');
     // s.curve = s.g('curve');
}


s.modeEscapeEventHandler = (e) => {
     if (e.code === 'Escape') 
     {
          s.shapeSelect.value = 'none';
          s.transformSelect.value = 'none';
          s.noneMode();
     }
}


s.undo_redo = (e) => {
     if (e.key === 'd') 
     {
          if (s.shapeArray.length === 0) 
          {
               swal("ERROR!", "YOU CANT UNDO ANYMORE, THERE ARE NO MORE SHAPES ON THE CANVAS!!!", "error");
          }
          else 
          {
               s.redoArray.push(s.shapeArray.pop());

               // console.log("Shape: ", s.shapeArray);
               // console.log("Redo: ", s.redoArray);
               s.shapecount--;
               s.redoCount++;
          }
          s.drawAll();
     }
     else if (e.key === 'D') 
     {
          if (s.redoArray.length === 0) 
          {
               swal("ERROR!", "YOU CANT PUT ANY MORE SHAPES BACK, THE REDO ARRAY IS EMPTY!!!", "error");
          }
          else 
          {
               s.shapeArray.push(s.redoArray.pop());

               // console.log("Shape: ", s.shapeArray);
               // console.log("Redo: ", s.redoArray);
               s.shapeCount++;
               s.redoCount--;
          }
          s.drawAll();
     }
}


s.noneMode = () => {
     console.log("Doing nothing");
     // if(s.shapeSelect.value === 'none' && s.transformSelect.value === 'none')
     // {
     //      console.log("DOING NOTHING IN BOTH SHAPES AND TRANSFORMS")
          s.canvas.onmousemove = undefined;
          s.canvas.onmousedown = undefined;
          s.canvas.onmouseup = undefined;
          s.canvas.onclick = undefined;
          s.canvas.ondblclick = undefined;
     // }
     // else if(s.shapeSelect.value != 'none' && s.transformSelect.value === 'none')
     // {
     //      console.log("DOING NOTHING IN TRANSFORMS")
     //      // s.canvas.onmousemove = undefined;
     //      // s.canvas.onmousedown = undefined;
     //      // s.canvas.onmouseup = undefined;
     //      // s.canvas.onclick = undefined;
     // }
     // else if(s.shapeSelect.value === 'none' && s.transformSelect.value != 'none')
     // {
     //      console.log("DOING NOTHING IN SHAPES")
     //      // s.canvas.onmousemove = undefined;
     //      // s.canvas.onmousedown = undefined;
     //      // s.canvas.onmouseup = undefined;
     //      // s.canvas.onclick = undefined;
     // }
}