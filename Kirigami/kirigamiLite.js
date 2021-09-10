/*
  Main
*/

function bootStrap() {
    var logic = new kirigamiLogic();
    var harness = new dataHarness(data => logic.doIt(data));
    harness.bind();
}

window.addEventListener('DOMContentLoaded', bootStrap);
