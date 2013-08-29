(function (global) {

    var // a model for the region of the image about to be cropped
        boundingBox,
        // an array of draggable elements that modify the crop region
        handles = [],
        // `overlay` is a canvas element that allows us to darken the portion  of the image that will be removed.
        overlay,
        // `ctx` will be the drawing context for `overlay`
        ctx;

    function loadImage () {
        var // `buffer` is a canvas element that displays the actual image to crop
            buffer = document.querySelector('#buffer'),
            // `img` is an img element we use to load the img, though we never add it to the DOM
            img = document.createElement('img');

        img.src = 'images/leaf twirl.jpg';

        // Returns an observable which fires when the image is loaded
        return Rx.DOM.fromEvent(img, 'load').select(function () {
            overlay.width = img.width;
            overlay.height = img.height;

            buffer.width = img.width;
            buffer.height = img.height;
            buffer.getContext('2d').drawImage(img, 0, 0);

            return {
                width: img.width,
                height: img.height
            };
        });
    } 

    function initBoundingBox(size) {
        boundingBox = {
            x: 0,
            y: 0,
            x2: size.width,
            y2: size.height
        };
    }

    function createHandles () {
        var container = document.getElementById('container');

        function createHandle (id, render, updateModel) {
            var handle = document.createElement('div');
            handle.className += ' handle';
            handle.setAttribute('id', id);
            container.appendChild(handle);

            // `render` allows us to visually update the handle after it has been dragged
            handle['render'] = render;
            // `updateModel` allows us to modify the correct part of the crop region model
            handle['updateModel'] = updateModel;

            handles.push(handle);            
        }

        // top left
        createHandle('tl', function () {
            this.style.top = boundingBox.y + 'px';
            this.style.left = boundingBox.x + 'px';
        }, function (x, y) {
            boundingBox.x = x;
            boundingBox.y = y;
        });

        //top right
        createHandle('tr', function () {
            this.style.top = boundingBox.y + 'px';
            this.style.left = boundingBox.x2 + 'px';
        }, function (x, y) {
            boundingBox.y = y;
            boundingBox.x2 = x;
        });

        // bottom left
        createHandle('bl', function (s) {
            this.style.top = boundingBox.y2 + 'px';
            this.style.left = boundingBox.x + 'px';
        }, function (x, y) {
            boundingBox.x = x;
            boundingBox.y2 = y;
        });

        // bottom right
        createHandle('br', function (s) {
            this.style.top = boundingBox.y2 + 'px';
            this.style.left = boundingBox.x2 + 'px';
        }, function (x, y) {
            boundingBox.y2 = y;
            boundingBox.x2 = x;
        });

        // render the handles in their initial positiions
        handles.forEach(function (element) { element['render'](); });
    }

    function respondToGestures() {
        var fromEvent = Rx.DOM.fromEvent;

        var moves = fromEvent(overlay, 'mousemove'),
            up = fromEvent(document, 'mouseup');

        // When the mouse is down on a handle, return the handle element
        return fromEvent(handles, 'mousedown')
            .selectMany(function (handle) {

                handle.preventDefault();

                return moves
                    // We combine the handle element with the position data from the move event
                    .select(function (pos) {
                        return {
                            element: handle.target,
                            offsetX: pos.offsetX,
                            offsetY: pos.offsetY
                        };
                    })
                    // However, when the mouse is up (anywhere on the document) then stop the stream
                    .takeUntil(up);
            });
    }

    function drawOverlay() {
        var x = boundingBox.x,
            y = boundingBox.y,
            w = boundingBox.x2 - boundingBox.x,
            h = boundingBox.y2 - boundingBox.y;

        ctx.globalCompositeOperation = 'source-over';

        ctx.clearRect(0, 0, overlay.width, overlay.height);

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, overlay.width, overlay.height);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(x, y, w, h);
        ctx.fill();

        handles.forEach(function (tool) { tool['render'](); });
    }    

    function main () {
        overlay = document.querySelector('#overlay');
        ctx = overlay.getContext('2d');

        var subscription = loadImage()
            .selectMany(function (size) {

                // Initialize after load
                initBoundingBox(size),
                createHandles();

                return respondToGestures();
            })
            .subscribe(function (data) {

                // Update model and redraw via an async operation
                data.element.updateModel(data.offsetX, data.offsetY);

                Rx.Scheduler.requestAnimationFrameScheduler.schedule(drawOverlay);
            });
    }

    main();

}(window));