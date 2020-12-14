/* jshint esversion: 6, browser: true, devel: true */

document.addEventListener('DOMContentLoaded', () => {

    let headings = document.querySelectorAll('.hd');
    let texts = document.querySelectorAll('.bd');

    Array.from(headings).forEach( (heading, index) => {
        // heading.onclick = function() {
        //     texts[index].style.display = texts[index].style.display === 'none' ? 'block' : 'none';
        // }
        heading.onmouseover = function() {
            texts[index].style.display = 'block';
        }
        heading.onmouseout = function () {
            texts[index].style.display = 'none';
        }
    });

});