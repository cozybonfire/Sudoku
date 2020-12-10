import React from 'react';
import ReactDOM from 'react-dom';
//import Solver from './Solver';
import Button from 'react-bootstrap/Button';
import { confirmAlert } from 'react-confirm-alert';
import './index.css';

const ROW_SIZE = 9;
const BOARD_SIZE = ROW_SIZE ** 2;
const DEFAULT_DIFFICULTY = "Easy";

function Square(props) {
    return (
        <button 
            className={`
                ${props.isOpen ? "open-square" : (props.isInvalid ? "invalid-square" : "square")}
                ${props.isStartingSquare ? " starting-square" : ""}
            `} 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isInvalid={this.props.invalidSquares.includes(i)}
                isOpen={this.props.openSquare === i}
                isStartingSquare={this.props.startingBoard[i]}
            />
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < ROW_SIZE; i++) {
            let nums = [];
            for (let j = 0; j < ROW_SIZE; j++) {
                nums.push(i*ROW_SIZE + j);
            }
            rows.push(nums);
        }

        return (
            <div>
                <div className="board-row">
                    <div className="large-square">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                        {this.renderSquare(9)}
                        {this.renderSquare(10)}
                        {this.renderSquare(11)}
                        {this.renderSquare(18)}
                        {this.renderSquare(19)}
                        {this.renderSquare(20)}
                    </div>
                    <div className="large-square">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                        {this.renderSquare(12)}
                        {this.renderSquare(13)}
                        {this.renderSquare(14)}
                        {this.renderSquare(21)}
                        {this.renderSquare(22)}
                        {this.renderSquare(23)}
                    </div>
                    <div className="large-square">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                        {this.renderSquare(15)}
                        {this.renderSquare(16)}
                        {this.renderSquare(17)}
                        {this.renderSquare(24)}
                        {this.renderSquare(25)}
                        {this.renderSquare(26)}
                    </div>
                </div>
                <div className="board-row">
                    <div className="large-square">
                        {this.renderSquare(27)}
                        {this.renderSquare(28)}
                        {this.renderSquare(29)}
                        {this.renderSquare(36)}
                        {this.renderSquare(37)}
                        {this.renderSquare(38)}
                        {this.renderSquare(45)}
                        {this.renderSquare(46)}
                        {this.renderSquare(47)}
                    </div>
                    <div className="large-square">
                        {this.renderSquare(30)}
                        {this.renderSquare(31)}
                        {this.renderSquare(32)}
                        {this.renderSquare(39)}
                        {this.renderSquare(40)}
                        {this.renderSquare(41)}
                        {this.renderSquare(48)}
                        {this.renderSquare(49)}
                        {this.renderSquare(50)}
                    </div>
                    <div className="large-square">
                        {this.renderSquare(33)}
                        {this.renderSquare(34)}
                        {this.renderSquare(35)}
                        {this.renderSquare(42)}
                        {this.renderSquare(43)}
                        {this.renderSquare(44)}
                        {this.renderSquare(51)}
                        {this.renderSquare(52)}
                        {this.renderSquare(53)}
                    </div>
                </div>
                <div className="board-row">
                    <div className="large-square">
                        {this.renderSquare(54)}
                        {this.renderSquare(55)}
                        {this.renderSquare(56)}
                        {this.renderSquare(63)}
                        {this.renderSquare(64)}
                        {this.renderSquare(65)}
                        {this.renderSquare(72)}
                        {this.renderSquare(73)}
                        {this.renderSquare(74)}
                    </div>
                    <div className="large-square">
                        {this.renderSquare(57)}
                        {this.renderSquare(58)}
                        {this.renderSquare(59)}
                        {this.renderSquare(66)}
                        {this.renderSquare(67)}
                        {this.renderSquare(68)}
                        {this.renderSquare(75)}
                        {this.renderSquare(76)}
                        {this.renderSquare(77)}
                    </div>
                    <div className="large-square">
                        {this.renderSquare(60)}
                        {this.renderSquare(61)}
                        {this.renderSquare(62)}
                        {this.renderSquare(69)}
                        {this.renderSquare(70)}
                        {this.renderSquare(71)}
                        {this.renderSquare(78)}
                        {this.renderSquare(79)}
                        {this.renderSquare(80)}
                    </div>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        const startingBoard = requestGame(DEFAULT_DIFFICULTY);
        const optimalMoveCount = calculateOptimalMoveCount(startingBoard);

        const testBoard = [
            null,5,null,4,8,9,3,7,6,
            7,3,9,2,5,6,8,4,1,
            4,6,8,3,7,1,2,9,5,
            3,8,7,1,2,4,6,5,9,
            5,9,1,7,6,3,4,2,8,
            2,4,6,8,9,5,7,1,3,
            9,1,4,6,3,7,5,8,2,
            6,2,5,9,4,8,1,3,7,
            8,7,3,5,1,2,9,6,4
        ];

        this.state = {
            history: [{
                squares: startingBoard,
            }],
            stepNumber: 0,
            openSquare: -1,
            difficulty: DEFAULT_DIFFICULTY,
            optimalMoveCount: optimalMoveCount,
            invalidSquares: [],
        };
    }

    confirmLoseProgress() {
        return window.confirm("Are you sure? You will lose any progress on this game.");
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const invalidSquares = this.state.invalidSquares.slice();

        if (gameWon(squares, invalidSquares) || history[0].squares[i]) {
            return;
        }

        this.setState({
            openSquare: i,
        });
    }

    handleKeyPress(event) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const invalidSquares = this.state.invalidSquares.slice();
        const openSquare = this.state.openSquare;
        const key = event.key;
        const validInput = ["1","2","3","4","5","6","7","8","9","Backspace","Delete"];

        if (!validInput.includes(key) || openSquare === -1 || gameWon(squares, invalidSquares)) {
            return;
        }

        if (key === "Backspace" || key === "Delete") {
            if(!squares[openSquare]) {
                return;
            }
            squares[openSquare] = null;
        } else { 
            if(squares[openSquare] === key) {
                return;
            }
            squares[openSquare] = Number(key);
        }

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            invalidSquares: findInvalidSquares(squares),
        });
    }

    jumpTo(stepNumber) {
        if (stepNumber < 0) {
            return;
        }

        const currentHistory = this.state.history.slice(0, this.state.stepNumber + 1);
        const newHistory = currentHistory.slice(0, stepNumber + 1);
        const newBoard = newHistory[stepNumber].squares;

        this.setState({
            history: newHistory,
            stepNumber: stepNumber,
            invalidSquares: findInvalidSquares(newBoard),
        });
    }

    loadNewGame() {
        if (this.state.stepNumber > 0 && !this.confirmLoseProgress()) {
            return;
        }

        const startingBoard = requestGame(this.state.difficulty);

        this.setState({
            history: [{
                squares: startingBoard,
            }],
            stepNumber: 0,
            openSquare: -1,
            optimalMoveCount: calculateOptimalMoveCount(startingBoard),
            invalidSquares: [],
        });
    }

    resetGame() {
        if (this.state.stepNumber === 0 || !this.confirmLoseProgress()) {
            return;
        }

        this.setState({
            history: [
                this.state.history[0]
            ],
            stepNumber: 0,
            openSquare: -1,
            invalidSquares: [],
        });
    }

    setDifficulty(event) {
        this.setState({
            difficulty: event.target.value,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const invalidSquares = this.state.invalidSquares;
        const _gameWon = gameWon(current.squares, invalidSquares);

        return (
            <div className="game">
                <div className="board" onKeyDown={(event) => this.handleKeyPress(event)}>
                    <h1>{_gameWon ? "Winner!" : "Good Luck, Have Fun!"}</h1>
                    <div className="game-board banner-won">
                        <Board 
                            squares={current.squares}
                            openSquare={this.state.openSquare}
                            invalidSquares={this.state.invalidSquares}
                            onClick={(i) => this.handleClick(i)}
                            startingBoard={this.state.history[0].squares}
                        />
                    </div>
                </div>
                <div className="game-info">
                    <div className="spacer5"></div>
                    <div>
                        <div className="margin-bottom-10px">Difficulty:</div>
                        <div className="margin-bottom-5px" onChange={(event) => this.setDifficulty(event)}>
                            <label>
                                <input type="radio" name="difficulty" value="Easy" defaultChecked />
                                &nbsp;Easy&nbsp;
                            </label>
                            <label>
                                <input type="radio" name="difficulty" value="Medium" />
                                &nbsp;Medium&nbsp; 
                            </label>
                            <label>
                                <input type="radio" name="difficulty" value="Hard" />
                                &nbsp;Hard&nbsp; 
                            </label>
                        </div>
                    </div>
                    <div className="margin-bottom-10px">
                            <Button variant="info" size="sm" onClick={() => this.loadNewGame()}>Load New Game</Button>
                    </div>
                    <div className="spacer40"></div>

                    <div className="status">Moves: {this.state.stepNumber}</div>
                    <div className="status">Optimal: {this.state.optimalMoveCount}</div>
                    <div className="margin-bottom-5px">
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => this.jumpTo(history.length-2)}
                            disabled={_gameWon ? true : false}
                        >Undo
                        </Button>
                    </div>
                    <div>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => this.resetGame()}
                        >Start Over
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateOptimalMoveCount(startingBoard) {
    let squareCount = startingBoard.filter((value) => {
        return value != null;
    }).length;

    return BOARD_SIZE - squareCount;
}

// returns list of indexes of invalid squares
function findInvalidSquares(board) { 
    let result = new Set();

    function findDuplicates(arr) {
        let result = [];

        for (const [index, value] of arr.entries()) {
            if (!value || result.includes(index)) {
                continue;
            }

            let indexes = [];

            for (const [_index, _value] of arr.entries()) {
                if (value === _value) {
                    indexes.push(_index);
                }
            }
            if (indexes.length > 1) {
                result = result.concat(indexes);
            }
        }

        return Array.from(new Set(result));
    }

    // break into rows, columns, and squares, check for duplicate values and where found, add both those square numbers to the result
    let rows = [];
    for (let i = 0; i < ROW_SIZE; i++) {
        rows.push(board.slice(ROW_SIZE * i, ROW_SIZE * (i + 1)));
    }

    for (const [index, row] of rows.entries()) { // map index to square#
        for (let i = 0; i < ROW_SIZE; i++) {
            findDuplicates(row).map((value) => {
                return index * ROW_SIZE + value;
            }).map((invalidSquare) => {
                result.add(invalidSquare);
                return 0;
            });
        }
    }

    let columns = [];
    for (let i = 0; i < ROW_SIZE; i++) {
        columns.push([]);
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
        columns[i % ROW_SIZE].push(board[i]);
    }

    for (const [index, column] of columns.entries()) {
        for (let i = 0; i < ROW_SIZE; i++) {
            findDuplicates(column).map((value) => {
                return value * ROW_SIZE + index;
            }).map((invalidSquare) => {
                result.add(invalidSquare);
                return 0;
            });
        }
    }

    let squares = [];
    for (let i = 0; i < ROW_SIZE; i++) {
        squares.push([]);
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
        let squareNumber = Math.floor(i / Math.sqrt(ROW_SIZE)) % Math.sqrt(ROW_SIZE)                    // calculate horizontal position
                           + Math.floor(i / (ROW_SIZE * Math.sqrt(ROW_SIZE))) * Math.sqrt(ROW_SIZE);    // offset based on vertical position
        squares[squareNumber].push(board[i]);
    }

    for (const [index, square] of squares.entries()) {
        for (let i = 0; i < ROW_SIZE; i++) {
            findDuplicates(square).map((value) => {
                return value % Math.sqrt(ROW_SIZE) + Math.sqrt(ROW_SIZE) * (index % Math.sqrt(ROW_SIZE))
                        + ROW_SIZE * (Math.floor(value / Math.sqrt(ROW_SIZE)) + Math.sqrt(ROW_SIZE) * Math.floor(index / Math.sqrt(ROW_SIZE)));
            }).map((invalidSquare) => {
                result.add(invalidSquare);
                return 0;
            });
        }
    }

    return Array.from(result);
}

function gameWon(board, invalidSquares) {
    if (invalidSquares.length !== 0) {
        return false;
    }

    for (const [_,value] of board.entries()) {
        if (!value) {
            return false;
        }
    }

    return true;
}

function requestGame(difficulty) {
    const _difficulty = difficulty.toLowerCase();
    const http = new XMLHttpRequest();
    const url = "https://sugoku.herokuapp.com/board";
    http.open("GET", `${url}?difficulty=${_difficulty}`, false); // 3rd param sends synchronously; try to find alternate solution
    http.setRequestHeader("Accept", "*/*");
    http.send();

    const board = JSON.parse(http.responseText).board;

    let startingBoard = [];
    board.map((row) => {
        startingBoard = startingBoard.concat(row);
        return 0;
    });

    startingBoard.map((value, index) => {
        if(value === 0) {
            startingBoard[index] = null;
        }
        return 0;
    });

    return startingBoard;
}