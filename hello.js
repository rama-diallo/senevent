"use strict";
(function () {
  window.addEventListener("load", init); // init == main

  function init() {
   id("hi").addEventListener("click",greet)
   setTimeout(changeColor, 10000);
  }
  function changeColor() {
    qs("p").style.color = "dodgerblue";
  }
  function greet(){
    let name = id("nom").value;
    let p = qs("p");
    let para = qs("p");
    p.innerHTML = "Bonjours " + name;
  
  }

  function id(id) {
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }
})();