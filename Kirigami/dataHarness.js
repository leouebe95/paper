/*
  Binds UI elements to data
*/
class dataHarness {

    // ------------------------------------------------------------------------
    /*!
       Constructor

       @param changeCB function to call when data changes
    */
    constructor(changeCB) {
        this._changeCB = changeCB;
        this.data = {};
    }

    // ------------------------------------------------------------------------
    /*!
      @param[in] elem the DOMelement to compute the type for
      @return a normalized type for this element
    */
    _elemType(elem) {
        switch (elem.tagName) {
        case 'SELECT': return 'select';
        case 'INPUT':  return elem.getAttribute('type').toLowerCase();
        case 'SPAN':   return elem.getAttribute('type').toLowerCase();
        }

        console.error('Unknow type for tag', elem.tagName);
        return null;
    }

    // ------------------------------------------------------------------------
    /*!
      @param[in] callback the function to call on each UI element
      Call a function on all declared UI elements
    */
    _forAllUIElems(callback) {
        var UIelems = document.getElementsByClassName("UIdata");
        for (var i=0 ; i<UIelems.length; i++ ) {
            var elem = UIelems[i];
            callback.call(this, elem);
        }
    }

    // ------------------------------------------------------------------------
    /*!
      @param[in] elem the DOMelement to add the listener to
      Add the proper listener to the UI element
    */
    _bind(elem) {
        var that = this;
        switch(this._elemType(elem)) {
        case 'checkbox':
        case 'number':
        case 'range':
        case 'select':
        case 'file':
        case 'controlpad':
            elem.addEventListener("change", event => that.refresh(event));
            break;

        default:
            console.error("Cannot bind element", this._elemType(elem), elem);
        }
    }

    // ------------------------------------------------------------------------
    /*!
      @param[in] elem the DOMelement to read the data from
      Read and store that element data
    */
    _readData(elem) {
        var value = null;
        switch(this._elemType(elem)) {
        case 'checkbox':
            value = elem.checked;
            break;

        case 'number':
        case 'range':
            value = parseFloat(elem.value);
            break;

        case 'file':
            value = elem.value;
            break;

        case 'select':
            value = elem.options[elem.selectedIndex].value;
            break;

        case 'controlpad':
            value = elem.UIharness.value;
            break;

        default:
            console.error("Cannot read data from", this._elemType(elem), elem);
        }
        this.data[elem.id] = value;
    }

    // ------------------------------------------------------------------------
    /*!
      Recompute the edited data or all of it (event is null)
      Refresh the UI
    */
    refresh(event) {
        if (event) {
            this._readData(event.target);
        } else {
            // No event passed, refresh all data
            this.data = {}; // reset the dataset
            this._forAllUIElems(this._readData);

            console.log('Global refresh'); //FIXME:
        }
        this._changeCB(this.data);

        console.log(this.data); // FIXME
    }

    // ------------------------------------------------------------------------
    /*!
      Add listeners to all UI elements to recompute the data on user input.
    */
    bind() {
        var that = this;

        // Listen to a catch all custom "RefreshPage" event on <body>
        // This provides a way from async function to trigger a refresh
        document.body.addEventListener("RefreshPage", () => that.refresh());

        this._forAllUIElems(this._bind);
        // Init the data and apply initial "changes"
        this.refresh();
    }
}
