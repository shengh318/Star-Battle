"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.WebClient = void 0;
/**
 * ADT representing the state of the web client of the Star Battle puzzle web interface.
 */
class WebClient {
    constructor() {
        throw new Error("Not implemented");
    }
    async requestPuzzle(fileId) {
        throw new Error("Not implemented");
    }
    drawPuzzle() {
        throw new Error("Not implemented");
    }
    showVictoryMessage() {
        throw new Error("Not implemented");
    }
}
exports.WebClient = WebClient;
/**
 * Represents a state that a listener can be bound to (in the style of web frameworks such as React).
 */
class State {
    /**
     * @param initialValue some immutable value.
     * @param onStateChanged listener to call once this state changes.
     */
    constructor(initialValue, onStateChanged) {
        this.onStateChanged = onStateChanged;
        this.currentValue = initialValue;
    }
    /**
     * Updates this state with a new value.
     *
     * @param newState the new value this state should take on.
     */
    setState(newState) {
        if (this.currentValue !== newState) {
            this.currentValue = newState;
            this.onStateChanged(this.currentValue);
        }
    }
}
exports.State = State;
/**
 *  Runs the web client.
 */
function main() {
    // TODO: initialize the Web Client with the appropriate parameters, if any
}
main();
//# sourceMappingURL=WebClient.js.map