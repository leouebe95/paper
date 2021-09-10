
class g {
    static add2(v ,
v2) { return [0, 1].map(i => v1[i] + v2[i]); }
    static dif2(v1, v2) { return [0, 1].map(i => v1[i] - v2[i]); }
    static mul2(x, v) { return [0, 1].map(i => v[i] * x); }
    static div2(x, v) { return [0, 1].map(i => v[i] / x); }

    static add(v1, v2) { return [0, 1, 2].map(i => v1[i] + v2[i]); }
    static dif(v1, v2) { return [0, 1, 2].map(i => v1[i] - v2[i]); }
    static mul(x, v) { return [0, 1, 2].map(i => v[i] * x); }
    static div(x, v) { return [0, 1, 2].map(i => v[i] / x); }

    static dot(v1, v2) { return v1[0] * v2[0] +
                         v1[1] * v2[1] +
                         v1[2] * v2[2]; }
    static cross(v1, v2) { return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0] ]; }
    static norm(v) {
        return Math.sqrt(g.dot(v, v));
    }
    static normalized(v) {
        return g.div(g.norm(v), v);
    }
    static normal(v1, v2, v3) {
        let edge1 = g.dif(v1, v2)
        let edge2 = g.dif(v2, v3)
        return g.normalized(g.cross(edge1, edge2));
    }
}

const Styles = {
    FOLD:     'Fold',
    MOUNTAIN: 'Mountain',
    VALLEY:   'Valley',
    CUT:      'Cut'
};

class p {
    // Helper class for 2D painter

    /*! Constructor
     */
    constructor(context) {
        this._context = context;
    }


    setStyle(style) {
        switch (style) {
        case Styles.FOLD:
            this._context.setLineDash([5, 5]);
            this._context.lineWidth = 0.5;
            this._context.strokeStyle = '#808080';
            break;
        case Styles.MOUNTAIN:
            this._context.setLineDash([]);
            this._context.lineWidth = 1;
            this._context.strokeStyle = 'red';
            break;
        case Styles.VALLEY:
            this._context.setLineDash([]);
            this._context.lineWidth = 1;
            this._context.strokeStyle = 'green';
            break;
        case Styles.CUT:
            this._context.setLineDash([]);
            this._context.lineWidth = 1;
            this._context.strokeStyle = 'black';
            break;
        }
    }

    line(v1, v2) {
        this._context.beginPath();
        this._context.moveTo(v1[0], v1[1]);
        this._context.lineTo(v2[0], v2[1]);
        this._context.stroke();
    }
}

const Location = {
    LEFT:  0,
    RIGHT: 1
};

class kirigamiPainter {

    /*! Constructor */
    constructor(sizeX, sizeY, context, withTexture=true, withBackground=true) {
        this._pattern = [null, null];
        this.setSize(sizeX, sizeY);
        this._context = context;
        this._p = new p(context);
        this.setTextureMode(withTexture, withBackground);
    }

    // Update the 3D geometry
    set geometry(geom) {
        this._curShape = geom;
    }

    // Resize the rendered area
    setTextureMode(withTexture, withBackground) {
        this._withTexture = withTexture;
        this._withBackground = withBackground;
    }

    // Resize the rendered area
    setSize(sizeX, sizeY) {
        if ((this._sizeX == sizeX) && (this._sizeY == sizeY)) {
            return;
        }

        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._foldX = sizeX/2;

        // Coordinate mapping from obj to canvas
        this._offsetX = sizeX/2;
        this._offsetY = sizeY/2;
        this._scale = sizeY/2 * 1.2; // negative 20% margin

        // Re-render the patterns at the right size
        if (this._pattern[Location.LEFT]) {
            this._pattern[Location.LEFT].width = this._sizeX/2;
            this._pattern[Location.LEFT].height = this._sizeY;
        }
        if (this._pattern[Location.RIGHT]) {
            this._pattern[Location.RIGHT].width = this._sizeX/2;
            this._pattern[Location.RIGHT].height = this._sizeY;
        }
    }

    /*!
      Actual setter code for the left and right images
      @param[in] Image img A valid image object or null
      @param[in] Enum which Location.LEFT or Location.RIGHT
    */
    _setImage(img, which) {
        if (img) {
            if (this._pattern[which]) {
                // FIXME: recompute the scaling values
                this._pattern[which].image = img;
            } else {
                this._pattern[which] = new imagePattern(img, this._context, this._sizeX/2, this._sizeY);
            }
        } else {
            this._pattern[which] = null;
        }
    }

    /*!
      Setter for the left image
      @param[in] Image img a valid image object or null
    */
    set imageLeft(img) {
        this._setImage(img, Location.LEFT);
    }

    /*!
      Setter for the left image
      @param[in] Image img a valid image object or null
    */
    set imageRight(img) {
        this._setImage(img, Location.RIGHT);
    }

    /*!
     */
    paintFace(verts2Din, verts3D, isHorizontal) {
        // Transform obj normalized coordinates to Canvas
        var verts2D = verts2Din.map(v => [v[0] * this._scale + this._offsetX,
                                          v[1] * this._scale + this._offsetY])

        // Draw the textured face
        let pattern = null;
        let offset = 0;
        let ctx = this._context;
        if (this._withTexture) {
            if (isHorizontal) {
                if (this._pattern[Location.RIGHT]) {
                    offset = - verts3D[0][2] * this._scale; // FIXME
                    pattern = this._pattern[Location.RIGHT];
                }
            } else {
                if (this._pattern[Location.LEFT]) {
                    offset = verts3D[0][0] * this._scale; // FIXME
                    pattern = this._pattern[Location.LEFT];
                }
            }
        }
        if (pattern) {
            ctx.fillStyle = pattern.pattern;
        } else {
            // If no image is available, fill with white. Otherwise
            // the other image may be seen through
            ctx.fillStyle = 'white';
        }

        ctx.beginPath();
        ctx.moveTo(verts2D[0][0], verts2D[0][1]);
        for (let i = 1; i < verts2D.length ; i++) {
            ctx.lineTo(verts2D[i][0], verts2D[i][1]);
        }
        ctx.closePath();

        // Apply the texture offet to the context
        ctx.save();
        ctx.translate(offset, 0);
        ctx.fill();
        ctx.restore();

        // Draw the edges
        verts2D.push(verts2D[0]);
        verts3D.push(verts3D[0]);
        // Loop on all edges
        for (let i = 0; i < verts2D.length-1 ; i++) {
            let v1 = verts2D[i];
            let v2 = verts2D[i+1];
            let dir = g.dif2(v2, v1);
            if (Math.abs(dir[1]) < 0.1) {
                // horizontal edge, this is a cut
                this._p.setStyle(Styles.CUT);
            } else if (dir[1] > 0) {
                /* vertical edge:
                   for horizontal face: up is valley, down is mountain
                   Opposite for vertical face.
                */
                this._p.setStyle(isHorizontal? Styles.VALLEY: Styles.MOUNTAIN);
            } else {
                this._p.setStyle(isHorizontal? Styles.MOUNTAIN: Styles.VALLEY);
            }
            this._p.line(v1, v2);
        }
    }

    /*!
      Face is in the YZ plane
     */
    paintFaceX(verts) {
        // Compute the 2D coordinates
        let v2D = verts.map(v => [v[0]-v[2], v[1]]);
        this.paintFace(v2D, verts, false);
    }

    /*!
      Face is in the XY plane
    */
    paintFaceZ(verts) {
        // Compute the 2D coordinates
        let v2D = verts.map(v => [v[0]-v[2], v[1]]);
        this.paintFace(v2D, verts, true);
    }

    /*!
      Paint the left and right images
     */
    drawImages() {
        if (this._withTexture && this._withBackground) {
            if (this._pattern[Location.LEFT]) {
                this._context.fillStyle = this._pattern[Location.LEFT].pattern;
                this._context.fillRect(0, 0, this._sizeX/2, this._sizeY);
            }

            if (this._pattern[Location.RIGHT]) {
                this._context.fillStyle = this._pattern[Location.RIGHT].pattern;
                this._context.fillRect(this._sizeX/2, 0, this._sizeX/2, this._sizeY);
            }
        }
    }

    /*!
     */
    redraw() {

        this.drawImages();

        // Draw fold
        this._p.setStyle(Styles.FOLD);
        this._p.line([this._foldX, 0], [this._foldX, this._sizeY]);

        this._curShape.faces.forEach(face => {
            // vertex coordinates of the face
            let v = face.map( i => this._curShape.verts[i]);
            let n = g.normal(v[0], v[1], v[2])

            if (Math.abs(n[0]) > 0.9) {
                // horizontal face
                this.paintFaceX(v);
            } else if (Math.abs(n[2]) > 0.9) {
                // Front face
                this.paintFaceZ(v);
            }
        });
    }
}

