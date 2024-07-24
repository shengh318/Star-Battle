/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.

import assert from 'assert';
import { WebClient } from './WebClient';
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
const PUZZLE = "kd-6-31-6";
// const PUZZLE = "kd-1-1-1";

// see ExamplePage.ts for an example of an interactive web page

/**
 * Clear the text from the html textArea Element and display the new message
 * 
 * @param message the message that you want to display on the html page
 * @param textArea the HTML element that the message will be displayed on
 */
function displayMessage(message:string, textArea: HTMLElement): void {
    textArea.innerText= message;
}

/**
 * Begins the client and the game on the canvas
 */
async function main(): Promise<void> {
    const canvas = document.getElementById('canvas') ?? assert.fail();

    //get a text area that informs the user when the game is finished
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');

    const winningMessage = "The Board has been solved!!";
    const startingDirection = "Click on any area on the board to place a star!";


    const webclient = await WebClient.request(PUZZLE, canvas as HTMLCanvasElement);
    //check to see if the board is already a solved board
    if (webclient.isBoardSolved()){
        console.log("is solved!");
        displayMessage(winningMessage, outputArea);
    }
    else{
        displayMessage(startingDirection, outputArea);
    }

    canvas.addEventListener('click', (e : MouseEvent) => {
        webclient.click(e.offsetX, e.offsetY);
        console.log(webclient.isBoardSolved());
        if (webclient.isBoardSolved()){
            console.log("is solved!");
            displayMessage(winningMessage, outputArea);
        }
        else{
            displayMessage("", outputArea);
        }
    });


}

void main();
