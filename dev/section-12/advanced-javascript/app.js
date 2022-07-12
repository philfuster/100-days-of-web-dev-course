// variables always available to developers when code running in browser.
// - `window` object holds info and functionality related to the active browser window / tab
// - `document` object (window.document) - holds info and functionality to the loaded website content
// utility functions to access HTML elements
//
// "The DOM" - Document Object Model
// console.dir(document);
// document.body.children[1].children[0].href = "https://google.com";
// console.log(document.body.children[1].children[0].href);

// let anchorElement = document.getElementById('external-link');
// anchorElement.href = "https://google.com";

// anchorElement = document.querySelector("p a");
// anchorElement.href = "https://academind.com"

// add an element
// 1. create new element

let newAnchorElement = document.createElement('a');
newAnchorElement.textContent = 'My site';
newAnchorElement.href = 'https://fuster.dev'

// 2. get access to the parent element that should hold the new element

let firstParagraph = document.querySelector('p');

// 3. insert the new element into the parent

firstParagraph.append(newAnchorElement);

// Remove Elements
// 1. select the element should be removed.

let firstH1Element = document.querySelector('h1');

// 2. remove it

firstH1Element.remove();
// firstH1Element.parentElement.removeChild(firstH1Element); // for older browsers

// Move Elements

firstParagraph.parentElement.append(firstParagraph);

// innerHtml

firstParagraph.innerHTML = "Hi! This is <strong>important!</strong>";