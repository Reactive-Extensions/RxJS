(function (global) {

    function main () {
        var dragTarget = document.getElementById('dragTarget');

        // Get the three major events
        var mouseup = Rx.Observable.fromEvent(dragTarget, 'mouseup');
        var mousemove = Rx.Observable.fromEvent(document, 'mousemove');
        var mousedown = Rx.Observable.fromEvent(dragTarget, 'mousedown');

        var mousedrag = mousedown.selectMany(function (md) {

            // calculate offsets when mouse down
            var startX = md.offsetX, startY = md.offsetY;

            // Calculate delta with mousemove until mouseup
            return mousemove.select(function (mm) {
                (mm.preventDefault) ? mm.preventDefault() : event.returnValue = false; 

                return {
                    left: mm.clientX - startX,
                    top: mm.clientY - startY
                };
            }).takeUntil(mouseup);
        });

        // Update position
        subscription = mousedrag.subscribe(function (pos) {          
            dragTarget.style.top = pos.top + 'px';
            dragTarget.style.left = pos.left + 'px';
        });
    }

    main();

}(window));