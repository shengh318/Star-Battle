import {StarBattlePuzzle} from "./StarBattlePuzzle";

/**
 * ADT representing the state of the web client of the Star Battle puzzle web interface.
 */
export class WebClient {
    /**
     * Abstraction Function: puzzle represents the Star Battle puzzle the user is interacting with, possibly null
     * if the puzzle has yet to be loaded.
     * Rep invariant: true
     * Exposure: all mutable fields are private, and never returned nor do they use an alias.
     */

    private puzzle: State<StarBattlePuzzle | null>;
    public constructor() {
        throw new Error("Not implemented");
    }

    private async requestPuzzle(fileId: string): Promise<StarBattlePuzzle> {
        throw new Error("Not implemented");
    }

    private drawPuzzle(): void {
        throw new Error("Not implemented");
    }

    private showVictoryMessage(): void {
        throw new Error("Not implemented");
    }
}

/**
 * Represents a state that a listener can be bound to (in the style of web frameworks such as React).
 */
export class State<T> {
    /**
     * Abstraction Function: currentValue represents the current value of this state,
     * onStateChanged is the action to be taken once this state changes.
     * Rep invariant: true
     * Exposure: all fields are private immutable.
     */
    private currentValue: T;

    /**
     * @param initialValue some immutable value.
     * @param onStateChanged listener to call once this state changes.
     */
    public constructor(
        initialValue: T,
        private readonly onStateChanged: (newState: T) => void) {
        this.currentValue = initialValue;
    }

    /**
     * Updates this state with a new value.
     *
     * @param newState the new value this state should take on.
     */
    public setState(newState: T): void {
        if (this.currentValue !== newState) {
            this.currentValue = newState;
            this.onStateChanged(this.currentValue);
        }
    }
}

/**
 *  Runs the web client.
 */
function main(): void {
    // TODO: initialize the Web Client with the appropriate parameters, if any
}

main();