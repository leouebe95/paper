/*
  Main
*/

function instanciateUI() {
    var control1 = document.getElementById("image1control");
    var control2 = document.getElementById("image2control");
    var pad1 = new controlPad(control1);
    var pad2 = new controlPad(control2);
}

function bootStrap() {
    instanciateUI();
    var logic = new kirigamiLogic();
    var harness = new dataHarness(data => logic.doIt(data));
    harness.bind();
}

window.addEventListener('DOMContentLoaded', bootStrap);
