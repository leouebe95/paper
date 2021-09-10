
kirigamiShapes = {}; // FIXME:

class kirigami3DBuilder {
    static defaultShapeName = 'kiri-7'; // FIXME:

    /*! Constructor
     */
    constructor() {
        // Init all values to null
        this._complexity = null;
        this._geometry = null;
    }

    // Reconstruct the geometry
    _rebuildGeometry () {
        // FIXME: rebuild the geometry instead of fixed shapes
        var name = 'kiri-' + this._complexity;
        if (name in kirigamiShapes) {
            this._geometry = kirigamiShapes[name];
        } else {
            this._geometry = kirigamiShapes[kirigami3DBuilder.defaultShapeName];
        }
    }

    set complexity(comp) {
        // Do not rebuild if nothing changed
        if (comp != this._complexity) {
            this._complexity = comp;
            this._geometry = null; // Geometry is invalid now
        }
    }

    // Return the geometry matching the current parameters
    get geometry() {
        if (!this._geometry) {
            this._rebuildGeometry();
        }

        return this._geometry;
    }
}
