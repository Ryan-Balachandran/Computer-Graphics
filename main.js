onload = () => {
     s.shapeCount         = 0;     // # of shapes on the canvas
     s.shapeArray         = [];    // Array of shapes on the canvas
     s.redoCount          = 0;     // $ of shapes om the redp array
     s.redoArray          = [];    // shapes removed from canvas ready to be put back
     s.copyArray          = [];    // copied shape to be pasted
     s.isimported         = false; // boolean for if JSON was imported
     s.showGrid           = false; // boolean to show/hide the grid
     s.gridArray          = [];    // array of points in grid for snapping
     s.shapeObject        = [];    // holds imported shapes

     s.multiSelect        = [];    // current shape selected by mouse
     s.singleSelect       = null;    // current shape selected by mouse
     // CHANGE SELECTEDSHAPE WHEN RESETING CANVAS
     s.selectedShapeIndex = undefined;    // index of selected shape in shapeArray
     s.isDrag             = false; // user is moving a shape

     s.mFillShapes = false;
     s.mStrokesShapes = true;
     


     s.redraw = 20;      //redraw interval
     s.canvasValid = false;



     document.body.addEventListener('mousedown', e => { s.mouse_down(e) });
     document.body.addEventListener('mouseup', e => { s.mouse_up(e) });
     document.body.addEventListener('mousemove', e => { s.mouse_move(e) });
     document.addEventListener('keydown', s.undo_redo);

     // Get the base layer canvas object
     s.canvas = s.g("Editorcanvas");
     s.ctx = s.canvas.getContext("2d");

     s.transformCanvas = s.g("Editorcanvas");
     s.trctx = s.canvas.getContext("2d");

     s.BB = s.canvas.getBoundingClientRect();
     s.offsetX = s.BB.left;
     s.offsetY = s.BB.top;
     s.WIDTH = s.canvas.width;
     s.HEIGHT = s.canvas.height;

     s.gridPoints();          // initialize grid points for snapping
     s.setUpElements();       // set up html elements

     // setup the options in shapesSelect
     s.shapeSelect.onchange = function () 
     {
          s.transformSelect.value = 'none';      // make sure we are not drawing any shapes while selecting
          s.noneMode();
          switch (s.shapeSelect.value) 
          {    
               // case s.shapes[0]: s.freeformMode(); break;
               case s.shapes[1]: s.lineMode(); break;
               case s.shapes[2]: s.triangleMode(); break;
               case s.shapes[3]: s.squareMode(); break;
               case s.shapes[4]: s.rectangleMode(); break;
               case s.shapes[5]: s.circleMode(); break;
               case s.shapes[6]: s.ellipseMode(); break;
               case s.shapes[7]: s.curveMode(); break;
               case s.shapes[8]: s.polylineMode(); break;
               case s.shapes[9]: s.polygonMode(); break;
               case s.shapes[10]: s.noneMode(); break;
               default: break;
          }
     }

     // setup the options in transformSelect
     s.transformSelect.onchange = function () 
     {
          // s.canvas.onmousemove = undefined;
          // s.canvas.onmousedown = undefined;
          // s.canvas.onmouseup = undefined;
          // s.canvas.ondblclick = undefined;
          
          s.shapeSelect.value = 'none';      // make sure we are not drawing any shapes while selecting
          switch (s.transformSelect.value) 
          {
               // case s.shapes[0]: s.free_form_mode(); break;
               case s.transformations[0]: 
                    s.shapeArray.forEach(shape => { shape.showHitbox = true; });
                    console.log("SELECTING SHAPE");
               break;

               case s.transformations[1]: 
                    console.log("ROTATING SHAPE");
               break;

               case s.transformations[2]: 
                    console.log("SCALING SHAPE");
               break;

               case s.transformations[3]: 
                    console.log("GOING BACK TO DOING NOTHING");
                    s.shapeArray.forEach(shape => { shape.showHitbox = false; });
                    s.noneMode();
               break;

               default: break;
          }
          s.drawAll();
     }

     s.output.innerHTML = s.linewidth.value;
     s.linewidth.oninput = function()
     {
         s.output.innerHTML = this.value;
     }

     /*----------------------------------------- MENU BUTTONS -----------------------------------------*/

     // CREATE NEW DIAGRAM
     s.menubtns[0].onclick = function()
     {
          if(s.shapeArray.length != 0)
          {
               swal({
                    title: "Are you sure?",
                    text: "You still have shapes on the canvas, do you want to save this diagram?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true })
               .then(willDelete => {
                    if(willDelete)
                    {
                         // EXPORT SHAPES TO JSON FILE
                         // s.shapeObject = JSON.stringify(s.shapeArray);
                         s.exportToJsonFile(s.shapeObject);

                         s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
                         s.shapeCount = 0;        
                         s.shapeArray = [];      
                         s.redoCount = 0;  
                         s.redoArray = [];    
                         s.copyArray = [];  
                         s.selectedShape = [];    
                         s.selectedShapeIndex = null;
                         s.mFillShapes = false;
                         s.mStrokeShapes = true;
                         // s.rotation = 0;
                         s.drawAll();
                         swal("aaaand.....Voila!", "...Time for a new idea");
                    }
                    else
                    {
                         swal("Alright!");
                    }
               })
          }
          else
          {
               s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
               s.shapeCount = 0;        
               s.shapeArray = [];      
               s.redoCount = 0;  
               s.redoArray = [];    
               s.copyArray = [];  
               s.selectedShape = [];    
               s.selectedShapeIndex = null;
               s.mFillShapes = false;
               s.mStrokeShapes = true;
               // s.rotation = 0;
               s.drawAll();
          }
     }

     // SAVE CANVAS AS PNG
     s.menubtns[1].onclick = function () 
     {
          let canvasUrl = s.canvas.toDataURL("image/png", 1.0);
          const createEl = document.createElement('a');
          createEl.href = canvasUrl;
          createEl.download = "ShapeImage.png";
          createEl.click();
          createEl.remove();
          swal("Nice!", "Image Saved in downloads.", "success");
     }

     // EXPORT SHAPES TO JSON FILE 
     s.menubtns[2].onclick = function () 
     {
          console.log(s.shapeObject);
          s.exportToJsonFile(s.shapeArray);
          swal("Success", "Canvas shapes saved as JSON in downloads.", "success");
          s.drawAll();
     }

     // IMPORT JSON SHAPES FROM FILE
     s.menubtns[3].onclick = function () 
     {
          fetch('./shape.json')
               .then(response => { 
                    return response.json();
                })
               .then(data => { 
                    s.shapeObject = data; 
                    s.instantiateShapes();
                    s.drawAll();
                    swal("Success!", "Shapes reappearing now!", "success");
               })
               .catch(error => { 
                    console.error('Error:', error); 
               });
     }

     // UNDO LAST OPERATION <----------------------------- UNDO / REDO TRANSFORMATION ACTION?
     s.menubtns[4].onclick = function () 
     {
          if (s.shapeArray.length === 0) 
          {
               swal("ERROR!", "YOU CANT UNDO ANYMORE, THERE ARE NO MORE SHAPES ON THE CANVAS!!!", "error");
          }
          else 
          {
               s.redoArray.push(s.shapeArray.pop());

               console.log("Shape: ", s.shapeArray);
               console.log("Redo: ", s.redoArray);
               s.shapecount--;
               s.redoCount++;
          }
          s.drawAll();
     }

     // REDO LAST OPERATION
     s.menubtns[5].onclick = function () 
     {
          if (s.redoArray.length === 0) 
          {
               swal("ERROR!", "YOU CANT PUT ANY MORE SHAPES BACK, THE REDO ARRAY IS EMPTY!!!", "error");
          }
          else 
          {
               s.shapeArray.push(s.redoArray.pop());

               console.log("Shape: ", s.shapeArray);
               console.log("Redo: ", s.redoArray);
               s.shapeCount++;
               s.redoCount--;
          }
          s.drawAll();
     }

     // COPY PASTE OBJECT WITHOUT CHANGING ORIGINAL OBJECT VALUE  <---------------------------------- TROUBLE SHOOT
     s.menubtns[6].onclick = function () 
     {
          // COPY SHAPE OBJECT            --IMPLEMENT INTO SHAPE CLASS?

          // SEARCH THROUGH ARRAY OF OBJECTS TO FIND THE SELECTED OBJECT
          // s.copyAray = {...s.shapeArray[s.selectedShapeIndex]};

          s.copyArray = { ...s.shapeArray[1] };

          console.log("SHAPE[1]: ", s.shapeArray[1]);
          console.log("COPY: ", s.copy);
     }

     // PASTE SHAPE OBJECT         <----------------------------------------------------------------- TROUBLE SHOOT
     s.menubtns[7].onclick = function () 
     {
          // IMPLEMENT INTO SHAPE CLASS?
          // OFFSET PASTED OBJECT 
          s.copy.score = 10;
          s.copy.firstname = "charles";
          s.copy.lastname = s.shapeArray[3].lastname;
          console.log("PASTE1: ", s.copy);

          s.shapeArray.push(new testshape(s.copy));
          console.log("PASTE2: ", s.shapeArray);

          // DRAW PASTED OBJECT ON CANVAS
          // s.drawAll();
     }

     // CLEAR CANVAS
     s.menubtns[8].onclick = function () 
     {
          if (s.shapeArray.length != 0) 
          {
               swal({
                    title: "Are you sure?",
                    text: "Once deleted, you wont be able to undo this action!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true })
               .then((willDelete) => {
                    if (willDelete) 
                    {
                         s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
                         s.shapeCount = 0;
                         s.shapeArray = [];
                         s.redoCount = 0;
                         s.redoArray = [];
                         s.copyArray = [];
                         s.selectedShape = [];
                         s.selectedShapeIndex = null;
                         s.mFillShapes = false;
                         s.mStrokeShapes = true;
                         // s.rotation = 0;
                         swal("Canvas successfully cleared!", { icon: "success" });

                         s.drawAll();
                    }
                    else 
                    {
                         swal({ title: "Keep on drawing!" });
                    }
               });
          }
          else {
               s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
               s.shapeCount = 0;
               s.shapeArray = [];
               s.redoCount = 0;
               s.redoArray = [];
               s.copyArray = [];
               s.selectedShape = [];
               s.selectedShapeIndex;
               s.mFillShapes = false;
               s.mStrokeShapes = true;
               // s.rotation = 0;
               s.drawAll();
               swal("Cleared!", "...Time to start something new!");
          }
     }

     s.grid.onclick = function ()
     {
          switch(s.showGrid)
          {
               case false:
                    s.showGrid = true;
                    s.grid.style.backgroundColor = 'lightblue';
                    s.drawGrid();
               break;

               case true:
                    s.showGrid = false;
                    s.grid.style.backgroundColor = '#dfe7bd';
                    s.drawAll();
               break;
          }
     }
     s.noneMode();
     s.drawAll();
}