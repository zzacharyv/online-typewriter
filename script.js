var lines = [""] // holds the typewriter input so it can be managed line by line
var shifted = false; // keeps track of when the shift button is pressed so the typewriter input can be capitalized, etc.
var alternate = true; // helps the shift_carriage() function alternate between two units so that the typewriter images remain well aligned with the displaying text
const hit = new Audio("./audio/typewriter-hit.mp3"); // audio for a key press
hit.load();
const returnn = new Audio("./audio/return.wav"); // audio for a carriage return
returnn.load();

/**
 * listener function for keyboard input
 * keypress is used instead of keydown because it works perfectly and without issues, will continue to use keypress until it is legitimatley deprecated
 */
window.addEventListener('keypress',function(e) {
    // e.repeat prevents keys from being held down
    if (e.repeat) {
        return;
    } else {
        // '/' and ''' open a search bar on the browser, this gis prevented so typing is uninterrupted
        if(e.key == '/') e.preventDefault();
        if(e.key == '\'') e.preventDefault();
        // type input on screen
        typeHit(e.key);
    }
});

/**
 * function to shift onscreen elements as a real typewriter would when a key is pressed
 */
function shift_carriage() {
    // decide how much space the elements should shift over by
    let unit = 0;
    if(alternate == true) {
        unit = 8;
    } else {
        unit = 9;
    }
    alternate = !alternate;

    // access html elements
    let letter = document.getElementById("letter");
    let top = document.getElementById("typewriter-top");
    let ent = document.getElementById("Enter");
    let behind_letter = document.getElementById("behind-letter")
    let bar = document.getElementById("bar");
    // modify element positions
    behind_letter.style.left = `${getComputedStyle(behind_letter).left.split('px')[0] - unit}px`;
    letter.style.left = `${getComputedStyle(letter).left.split('px')[0] - unit}px`;
    top.style.left = `${getComputedStyle(top).left.split('px')[0] - unit}px`;
    ent.style.left = `${getComputedStyle(ent).left.split('px')[0] - unit}px`;
    bar.style.left = `${getComputedStyle(bar).left.split('px')[0] - unit}px`;
}

/**
 * function that keeps track of when a shift button is clicked
 */
function shift_pressed() {
    shifted = !shifted;
}

/**
 * function to update text and on-screen display when an enter key is pressed or clicked
 */
function carriage_return() {
    // access html elements
    let letter = document.getElementById("letter");
    let top = document.getElementById("typewriter-top");
    let ent = document.getElementById("Enter");
    let behind_letter = document.getElementById("behind-letter");
    let bar = document.getElementById("bar");
    let text = document.getElementById("text");

    // update the text stored in the html
    text.textContent = text.textContent + "\r\n";

    // there are two html divs that make up the front (letter) and back (behind) of the paper goung around the cyclinder that holds the 'paper'
    // when the front side gets typed on more and goes upward with each return, the back side goes downward, like a real piece of paper would
    // move the front end up by a line
    letter.style.height = `${parseInt(getComputedStyle(letter).height.split('px')[0]) + 20}px`;
    // move the back end down by a line until it disappears
    if(parseInt(getComputedStyle(behind_letter).height.split('px')[0]) <= 20) {
        behind_letter.style.height = '0px';
    } else {
        behind_letter.style.height = `${parseInt(getComputedStyle(behind_letter).height.split('px')[0]) - 20}px`;
    }

    // update element positions appropriateley
    letter.style.left = '420px';
    text.style.marginLeft = '47px';
    top.style.left = '220px';
    behind_letter.style.left = '420px';
    bar.style.left = '145px';
    letter.style.top = `${getComputedStyle(letter).top.split('px')[0] - 20}px`;
    behind_letter.style.top = `${parseInt(getComputedStyle(behind_letter).top.split('px')[0]) + 20}px`;
    ent.style.left = `250px`;
}

/**
 * function to handle when a key is pressed or a key is clicked, called a 'hit' in typewriter language
 * @param {*} key 
 */
function typeHit(key) {
    // get the length aka the number of characters in the current line
    var len = lines[lines.length-1].length;
    // check if there is room for the current line on the paper
    // 26 is the maximum number of lines that can fit onto the paper within the margins 
    if(lines.length <= 26) {
        // check if there is space for another character on the current line
        // 48 characters can fit within the margins using the monospaced font 'Underwood-Champion'
        if(len == null || len < 49) {
            if(key == "Space") {
                // play typing sound
                hit.play();
                hit.currentTime = 0;
                // add a space to both the html stored text and the javascript stored text
                lines[lines.length-1] += " ";
                document.getElementById('text').textContent = document.getElementById('text').textContent + "\xa0";
            } else if(key == "Enter") {
                // play returning sound
                returnn.play();
                returnn.currentTime = 0;
                // update the javascript stored text array so the length can be used correctly in the preceding logic
                lines[lines.length] = " ";
                // handle a return with function
                carriage_return();
            } 
            // if the key is not whitespace, handle it like the majority of cases, a regular letter
              else {
                // play typing sound
                hit.play();
                hit.currentTime = 0;
                // update html text and javascript text if the html shift key is not pressed
                if(shifted == false) {
                    lines[lines.length-1] += key;
                    document.getElementById('text').textContent = document.getElementById('text').textContent + key;
                } 
                // if the html shift key is pressed, update the html text and javascript text using the appropriate capital/alternate key
                  else {
                    let el = '';
                    if(key == '?') {
                        el = '/';
                    } else if(key == '(') {
                        el = ')';
                    } else if(key == ';') {
                        el = ':';
                    } else if(key == '\'') {
                        el = '"';
                    } else if(key == '-') {
                        el = '_';
                    } else {
                        el = key.toUpperCase();
                    }
                    lines[lines.length-1] += el;
                    document.getElementById('text').textContent = document.getElementById('text').textContent + el;
                }
            }
            // shift the carriage appropriately
            shift_carriage();
        } 
        // if the current line is filled with characters, a return is still legal 
          else if(key == "Enter") {
             // play returning sound
             returnn.play();
             returnn.currentTime = 0;
             // update the javascript stored text array so the length can be used correctly in the preceding logic
             lines[lines.length] = "";
             // handle a return with function
             carriage_return();
        }
    }
    // after the character is typed, the sihft key will be unpressed
    shifted = false;
}