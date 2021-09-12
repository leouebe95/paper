/*!
  Handles the mapping between an image (uploaded) and a pattern
  The image is scaled and offset to match the desired size of the
  pattern.
*/
class imagePattern {

    // ------------------------------------------------------------------------
    /*!
       Constructor

       @param img Source image
       @param context 2Dcontext that the pattern will be used in.
       @param sizeX, sizeY Target size for the pattern
    */
    constructor(img, context, sizeX, sizeY) {
        this._imgSource = img;      //!< Source image
        this._context = context;    //!< The target 2D context for the pattern
        this._pattern = null;       //!< Result pattern, lazy evaluation
        this._targetSizeX = sizeX;  //!< Desired pattern resolution
        this._targetSizeY = sizeY;  //!< Desired pattern resolution

        /*!
          Coordinates of the pixel in the source image mapped to the
          top left corner of the pattern.
        */
        this._top = 0;
        this._left = 0;

        /*!
          Length in pixels in the source image mapped to the full
          width of the pattern. By default fit the image to the target
        */
        this._width = this._fitWidth();
    }

    // ------------------------------------------------------------------------
    /*!
      Reset the target size
      @param[in] sizeX,sizeY new size of the rendered pattern.
    */
    setTargetSize(sizeX, sizeY) {
        // If the aspect ratio of the target has change, fit the
        // source image again.
        //
        // Keep the manual image fit if the ratio has not changed
        // (e.g. change the preview ratio, or re-render at print size)
        var reset = false
        if (this._targetSizeX * sizeY != this._targetSizeY * sizeX) {
            reset = true;
        }

        this._targetSizeX = sizeX;  //!< Desired pattern resolution
        this._targetSizeY = sizeY;  //!< Desired pattern resolution

        if (reset) {
            this._top = 0;
            this._left = 0;
            this._width = this._fitWidth();
        }

        // Need to re-render the pattern
        this._pattern = null;
    }

    // ------------------------------------------------------------------------
    /*!
      @return the largest width so that the source image exactly fits the
      target area.
     */
    _fitWidth() {
        if (this._imgSource) {
            var scale = this._targetSizeX / this._imgSource.width;
            var targetHeight = this._imgSource.height * scale;
            if (targetHeight >= this._targetSizeY) {
                // Height will be higher than needed, fit the width
                return this._imgSource.width;
            }

            scale = this._targetSizeY / this._imgSource.height;
            return this._targetSizeX / scale;
        }

        // No image return a non zero value
        return 1;
    }

    // ------------------------------------------------------------------------
    /*!
      Sets the top coordinate of the sub-image to use.
      Invalidate the pattern.
     */
    set top(val) {
        if (top != this._top) {
            this._top = val;
            this._pattern = null;
        }
    }

    // ------------------------------------------------------------------------
    /*!
      Sets the left coordinate of the sub-image to use.
      Invalidate the pattern.
     */
    set left(val) {
        if (val != this._left) {
            this._left = val;
            this._pattern = null;
        }
    }

    // ------------------------------------------------------------------------
    /*!
      Sets the source width of the sub-image to use.
      Invalidate the pattern.
     */
    set width(val) {
        if (val != this._width) {
            this._width = val;
            this._pattern = null;
        }
    }

    // ------------------------------------------------------------------------
    /*!
      Sets the source width of the sub-image to use.
      Invalidate the pattern.
      @warning: this will invalidate the pattern. Call this only when
      the image has changed.
     */
    set image(val) {
        this._imgSource = val;
        this._width = this._fitWidth();
        this._pattern = null;
    }

    // ------------------------------------------------------------------------
    /*!
      @return the pattern. Recompute it if it's not up to date.
     */
    get pattern() {
        if (!this._pattern) {
            if (!this._imgSource) {
                this._pattern = "white";
            } else {
                // Create temporary Canvas to render the pattern
                var tmpCanvas = document.createElement("canvas")
                tmpCanvas.width  = this._targetSizeX;
                tmpCanvas.height = this._targetSizeY;
                var tmpCtx = tmpCanvas.getContext("2d");

                // Paint a resized version of the image in a canvas to fit the
                // given size.
                var sourceHeight = this._width * this._targetSizeY / this._targetSizeX;
                tmpCtx.drawImage(this._imgSource,
                                 this._left, this._top,
                                 this._width, sourceHeight,
                                 0, 0, this._targetSizeX, this._targetSizeY);

                this._pattern = this._context.createPattern(tmpCanvas, 'repeat');
            }
        }
        return this._pattern;
    }
}
