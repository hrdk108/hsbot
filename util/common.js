/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

var Util = {
  string2literal : string2literal
};

function string2literal(value){
  var maps = {
    "NaN": NaN,
    "null": null,
    "undefined": undefined,
    "Infinity": Infinity,
  };
  return ((value in maps) ? maps[value] : value);
}

module.exports = Util;