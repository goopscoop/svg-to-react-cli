'use strict'

/**
 * Removes style tags from a node and its children
 * *Note* This mututates the passed in node
 * @param  node A node produced by jsdom
 * @return undefined
 */
module.exports = function removeStyle(node) {
  const elements = node.getElementsByTagName('*');
    for(var key in elements) {
      if(elements[key].removeAttribute) {
        elements[key].removeAttribute('style');
      }
    }
}