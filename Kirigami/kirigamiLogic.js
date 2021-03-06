/*!
  Business logic for the Kirigami parameters
*/
class kirigamiLogic {

    // ------------------------------------------------------------------------
    /*!
       Constructor
    */
    constructor() {
        var that = this;
        var canvas = document.getElementById("previewCanvas");
        var ctx = canvas.getContext("2d");
        var sX = parseInt(canvas.getAttribute('width'));
        var sY = parseInt(canvas.getAttribute('height'));
        this._builder = new kirigami3DBuilder();
        this._painter = new kirigamiPainter(sX, sY, ctx);

        var image1 = document.getElementById("image1");
        var image2 = document.getElementById("image2");
        this._image1Mgr = new kirigamiImgManager(image1, img => that.setImgLeft(img));
        this._image2Mgr = new kirigamiImgManager(image2, img => that.setImgRight(img));
    }

    // ------------------------------------------------------------------------
    /*!
       Callback to update the data once the left image is ready.
       @param[in] img New image data.
    */
    setImgLeft(img) {
        this._painter.imageLeft = img;

        // Send a global refresh to the bapge body.
        var event = new CustomEvent("RefreshPage", {
            detail: { trigger: 'imageLeft' }
        });
        document.body.dispatchEvent(event);
    }

    // ------------------------------------------------------------------------
    /*!
       Callback to update the data once the right image is ready.
       @param[in] img New image data.
    */
    setImgRight(img) {
        this._painter.imageRight = img;

        // Send a global refresh to the bapge body.
        var event = new CustomEvent("RefreshPage", {
            detail: { trigger: 'imageRight' }
        });
        document.body.dispatchEvent(event);
    }

    // ------------------------------------------------------------------------
    /*!
      Recompute the resolution, adjust the canvas and display actual
      resolution.
      @param[in] data all the parameters set from the UI.
    */
    doResolution(data) {
        // paper size in inches
        const resolutions = {
            'Letter': [11, 8.5],
            'A4':     [11.7, 8.3],
            'A3':     [16.5, 11.7]
        };


        var displayRatio = parseInt(data.previewDensity)/100;
        var sX = 0;
        var sY = 0;

        // Recompute the resolution
        if (data.pageFormat in resolutions) {
            let dpi = parseInt(data.density);
            sX = Math.floor(resolutions[data.pageFormat][0] * dpi);
            sY = Math.floor(resolutions[data.pageFormat][1] * dpi);
        } else {
            console.error('Unknown Page Format', data.pageFormat);
        }

        var spX = Math.floor(sX * displayRatio);
        var spY = Math.floor(sY * displayRatio);
        var elem = document.getElementById('resolution');
        elem.innerHTML = `Print resolution ${sX}x${sY}<br/>Preview resolution ${spX}x${spY}`;

        elem = document.getElementById('previewCanvas');
        elem.setAttribute('width', spX);
        elem.setAttribute('height', spY);
    }

    // Update the enable state of the Display Tab
    doDisplayState(data) {
        var disabled = ! data.enableImages;
        var controls = ["enableBackground", "image1", "image2"];
        controls.forEach(control => {
            var elem = document.getElementById(control);
            elem.disabled = disabled;
        });
    }

    // Main entry point
    doIt(data) {
        this.doResolution(data);
        this.doDisplayState(data);

        // Update the complexity value.
        this._builder.complexity = data.complexity;

        var canvas = document.getElementById("previewCanvas");
        var sX = parseInt(canvas.getAttribute('width'));
        var sY = parseInt(canvas.getAttribute('height'));
        this._painter.setSize(sX, sY);
        this._painter.imageLeftParam = data.image1control;
        this._painter.imageRightParam = data.image2control;
        this._painter.setTextureMode(data.enableImages, data.enableBackground);
        this._painter.geometry = this._builder.geometry;

        this._painter.redraw();
    }
}
