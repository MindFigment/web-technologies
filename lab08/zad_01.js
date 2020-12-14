/* jshint esversion: 6, browser: true, devel: true */

function getDocumentTreeDepth() {
    let depth = traverseTree(document);
    alert(`This document depth is ${depth}!`);
}

function traverseTree(elem) {
    // nodeType === 3 means if it's a text node
    ns = next_legit_sibling(elem);
    fc = next_legit_child(elem);
    vertical = fc === null ? 1 : traverseTree(fc) + 1;
    horizontal = ns === null ? 0 : traverseTree(ns);
    // vertical + 1 >= horizontal ? console.log(elem.nextSibling) : console.log(elem.firstChild);
    console.log(elem, horizontal, vertical)
    return vertical >= horizontal ? vertical : horizontal;
    // make two branches:
    // 1 to calculate your depth
    // 2 to calculater next sibling depth
    // then take greater value of these two

}

function is_all_ws(elem) {
    return !(/[^\t\n\r ]/.test(elem.nodeValue));
}

function is_ignorable(elem)
{
  return elem.nodeType == 8 || // A comment node
         (elem.nodeType == 3 && is_all_ws(elem)); // a text node, all ws
}

function next_legit_sibling(elem) {
    while ((elem = elem.nextSibling)) {
        if (!is_ignorable(elem)) return elem; 
    }
    return null;
}

function next_legit_child(elem) {
    elem = elem.firstChild;
    return next_legit_sibling(elem);
}

document.addEventListener('DOMContentLoaded', () => {

    let button = document.querySelector('button');
    button.onclick = function() {
        getDocumentTreeDepth();
    }

});


