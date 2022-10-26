"use strict"

const s = {};		// use this singleton instead of global variables

// use this as a shortcut for getting DOM objects
s.g = function (id) { return document.getElementById(id); }
s.q = function (id) { return document.querySelector(id); }
s.qs = function (id) { return document.querySelectorAll(id); }
