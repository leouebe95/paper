import {MDCSwitch} from '@material/switch';

/*
  Instanciate material element for the known tags
*/
class materialBuilder {


    /* ------------------------------------------------------------------------------
       Helper method to store all key/value pairs in the DOMelement attributes
    */
    _setAttributes(elem, dict) {
        for (const [key, value] of Object.entries(dict)) {
            console.log(key, value);
            elem.setAttribute(key, value);
        }
    }
    /* ------------------------------------------------------------------------------
       Helper method to get attributes from a DOMelement int a dictionary.
       Missing optional attributes are ignored.
       Missing mandatory attributes generate an error.

       return the dictionnary or null on error.
    */
    _getAttributes(elem, mandatory, optional=[]) {
        var res = {};
        for (let i = 0; i < mandatory.length; i++) {
            if (elem.hasAttribute(mandatory[i])) {
                let val = elem.getAttribute(mandatory[i]);
                res[mandatory[i]] = val;
            } else {
                return null;
            }
        }

        for (let i = 0; i < optional.length; i++) {
            if (elem.hasAttribute(optional[i])) {
                let val = elem.getAttribute(optional[i]);
                res[optional[i]] = val;
            }
        }

        return res;
    }

    /* ------------------------------------------------------------------------------
      Expands <checkbox name="Enable Images" /> into a material checkbox
     */
    _makeSwitch(elem) {
        // TODO:  assert elem.tagName == "SWITCH"
        var dict = this._getAttributes(elem, ["name"], ["id", "selected"]);
        // TODO: Error if dict is null
        dict["type"] = "button";
        dict["role"] = "switch";
        var res = document.createElement("BUTTON");
        this._setAttributes(res, dict);

        res.classList.add("mdc-switch")
        const switchControl = new MDCSwitch(el);
        switchControl.selected = dict["selected"] ? true : false;

        elem.parentNode.replaceChild(res, elem);
        var template = `
            <button class="mdc-switch mdc-switch--unselected" aria-checked="false" disabled>
  <div class="mdc-switch__track"></div>
  <div class="mdc-switch__handle-track">
    <div class="mdc-switch__handle">
      <div class="mdc-switch__shadow">
        <div class="mdc-elevation-overlay"></div>
      </div>
      <div class="mdc-switch__ripple"></div>
      <div class="mdc-switch__icons">
        <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
          <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
        </svg>
        <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
          <path d="M20 13H4v-2h16v2z" />
        </svg>
      </div>
    </div>
  </div>
</button>
<label for="disabled-switch">off/on</label>
`
    }

    _makeSwitches() {
        var elems = document.getElementsByTagName("SWITCH");
        for (let i = 0; i < elems.length; i++) {
            this._makeSwitch(elems[i]);
        }
    }

    makeAll() {
        this._makeSwitches();
    }
}
