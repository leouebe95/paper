/*!
  UI to control offset and scale parameters
*/
class controlPad {

    // ------------------------------------------------------------------------
    /*!
       Constructor
    */
    constructor(parent) {
        this.reset();
        this._root = this._buildUI(parent);
    }

    // ------------------------------------------------------------------------
    /*!
       Reset to default values
    */
    reset() {
        this._offsetX = 0;
        this._offsetY = 0;
        this._scale = 1;
    }

    // ------------------------------------------------------------------------
    /*!
      Called after the user interacted with the pad and changed some values.
    */
    _valueChanged() {
        // Send a global refresh to the bapge body.
        var event = new Event("change");
        this._root.dispatchEvent(event);
    }

    // ------------------------------------------------------------------------
    /*!
      Change the internal value depending o the user interaction.

       @param[in] change the user action
       @param[in] value the amount of change
    */
    _applyChange(change, value) {
        switch(change) {
        case 'offsetX':   this._offsetX += value; break;
        case 'offsetY':   this._offsetY += value; break;
        case 'reset':     this.reset(); break;
        case 'scaleUp':   this._scale *= value; break;
        case 'scaleDown': this._scale /= value; break;
        }

        this._valueChanged();
    }

    // ------------------------------------------------------------------------
    /*!
      Construct the UI elements to edit the offset and scale.
      @param[in] parent the DOMelement to construct the UI under.
    */
    _createElementUnder(tag, parent) {
        var elem = document.createElement(tag);
        parent.appendChild(elem);
        return elem;
    }

    // ------------------------------------------------------------------------
    /*!
      Create a button with the given icon and the function to call on click.
      @param[in] parent the DOMelement to construct the UI under.
    */
    _createButtonIcon(type, parent, onClick) {
        var button = this._createElementUnder('button', parent);
        var span = this._createElementUnder('span', button);
        span.classList.add('material-icons-round');
        span.classList.add('md-24');
        span.innerText = type;
        button.addEventListener("click", onClick);
        return button;
    }

    // ------------------------------------------------------------------------
    /*!
       Create a new row in the table with icon buttons

       @param table The parent table
       @param rowDesc Description of the row content. This is an
       array of
       - null for empty cells
       - [icon name, change to apply, value of the change]

       @return The newly created row
    */
    _makerow(table, rowDesc) {
        var that = this;
        var row = document.createElement('tr');
        rowDesc.forEach(x => {
            if (x) {
                var iconName = x[0];
                var elem = this._createElementUnder('td', row);
                this._createButtonIcon(iconName, elem,
                                       () => that._applyChange(x[1], x[2]));
            } else {
                // Empty cell
                this._createElementUnder('td', row);
            }
        });
        table.appendChild(row);
        return row;
    }

    // ------------------------------------------------------------------------
    /*!
      Construct the UI elements to edit the offset and scale.
      @param[in] parent the DOMelement to construct the UI under.
    */
    _buildUI(parent) {
        var row, elem;
        var table = document.createElement('table');
        table.classList.add('controlPad');

        this._makerow(table,
                      [null, null,
                       ['keyboard_arrow_up', 'offsetY', 1],
                       null,
                       ['zoom_in', 'scaleUp']]);

        this._makerow(table,
                      [null, null,
                       ['keyboard_double_arrow_up', 'offsetY', 10],
                       null, null]);

        this._makerow(table,
                      [['keyboard_arrow_left',        'offsetX',  1],
                       ['keyboard_double_arrow_left', 'offsetX', 10],
                       ['restart_alt', 'reset'],
                       ['keyboard_double_arrow_right', 'offsetX', -10],
                       ['keyboard_arrow_right',        'offsetX',  -1]]);

        this._makerow(table,
                      [null, null,
                       ['keyboard_double_arrow_down', 'offsetY', -10],
                       null, null]);

        this._makerow(table,
                      [['zoom_out', 'scaleDown', 1.1],
                       null,
                       ['keyboard_arrow_down', 'offsetY', -1],
                       null, null]);

        parent.appendChild(table);

        // The UI is fully built, declare the containing parent as a UI
        // element of type controlPad
        parent.classList.add('UIdata');
        parent.setAttribute('type', 'controlPad');

        parent.UIharness = this;
        return parent;
    }
    /*!
      The value is an object with 3 attributes offsetX, offsetY, and scale.
      @return The current value of the pad as an object.
    */
    get value() {
        return {
            'offsetX': this._offsetX,
            'offsetY': this._offsetY,
            'scale': this._scale
        };
    }
}
