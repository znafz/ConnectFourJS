
var ConnFour = {
	// Utility function to add event listeners, even for IE
    addEvent : function(obj, type, fn) {
	"use strict";

	if ( obj.attachEvent ) {
	    obj['e'+type+fn] = fn;
	    obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
	    obj.attachEvent('on'+type, obj[type+fn] );
	} else {
	    obj.addEventListener( type, fn, false );
	}
    },

	// Dimensions of the game
    rows : 6,
    cols : 7,
    
	// This is the game board
    theBoard : null,
    
	// These are the players
    redPlayer : null,
    blackPlayer : null,

	// Constants for cell state and game state
    RED : 10,
    BLACK : 11,
    EMPTY : 12,

    NOT_FINISHED : 20,
    RED_WIN : 21,
    BLACK_WIN : 22,
    DRAW : 23,
    ACCEPTING_CLICKS : false,

    // Notice that nothing about the view
    //   is in this object, just game state.
    Board : function(){
	"use strict";

	var r, c, row;

	// Indexed by row, then column
	this.boardState = [];
	for(r=0; r<ConnFour.rows; r++){
	    row = [];
	    for(c=0; c<ConnFour.cols; c++){
		row.push(ConnFour.EMPTY);
	    }
	    this.boardState.push(row);
	}

	this.nextTurn = ConnFour.RED;
	this.status = ConnFour.NOT_FINISHED;

	return this;
    },

    Player : function(name, color){
	"use strict";

	this.name = (name || "");
	this.color = (color || null);
	//return this;
    },

    RandomPlayer : function(color){
	"use strict";
		this.name = "RandomPlayer";
		this.color = (color || null);
		//return this;
    },

    SmartPlayer : function(color){
	"use strict";
		this.name = "SmartPlayer";
		this.color = (color || null);
		//return this;
    },

    HumanPlayer : function(color){
	"use strict";
		this.name = "HumanPlayer";
		this.color = (color || null);
		//return this;
    },

    // Called when the window gets resized
    resizeHandler : function(){
	"use strict";

	var canvas, maxCellByWidth, maxCellByHeight, cellSize;

	//////////
	// Reset the canvas size
	canvas = document.getElementById('board_canvas');

	// See if the width or height is more constraining...
	maxCellByWidth = Math.ceil(window.innerWidth * 0.9) / ConnFour.cols;
	maxCellByHeight = Math.ceil(window.innerHeight * 0.8) / ConnFour.rows;

	cellSize = Math.min(maxCellByWidth, maxCellByHeight);

	canvas.height = cellSize * ConnFour.rows;
	canvas.width = cellSize * ConnFour.cols;

	if(ConnFour.theBoard){
	    // Redraw the board to the canvas
	    ConnFour.theBoard.drawBoard(canvas);
	}
    }

};

// DONE: set up the prototype chain
// Each of RandomPlayer, SmartPlayer, and HumanPlayer should
//   have their prototypes set to an instance of ConnFour.Player
ConnFour.RandomPlayer.prototype = new ConnFour.Player("name", "color");
ConnFour.SmartPlayer.prototype = new ConnFour.Player("name", "color");
ConnFour.HumanPlayer.prototype = new ConnFour.Player("name", "color");


// Handles click events on the canvas
ConnFour.clickHandler = function(evt){
    "use strict";
    
    var cellSize, e, posx, posy, row, col, bd, canvas;
    
    bd = ConnFour.theBoard;
    canvas = document.getElementById('board_canvas');

	// TODO: check if the board is ready/accepting clicks,
	//   returning if it is not
	if(!ConnFour.ACCEPTING_CLICKS){
		return false;
	}
	
	
    posx = 0;
    posy = 0;
    
    if (!evt){
	e = window.event;
    }
    else{
	e = evt;
    }
    
    if (e.pageX || e.pageY){
	posx = e.pageX;
	posy = e.pageY;
    }
    else if (e.clientX || e.clientY){
	posx = e.clientX + document.body.scrollLeft
	    + document.documentElement.scrollLeft;
	posy = e.clientY + document.body.scrollTop
	    + document.documentElement.scrollTop;
    }
    
    // posx and posy contain the mouse position relative to the **document**.
    // The code above is from http://www.quirksmode.org/js/events_properties.html#position

    // Now we adjust so it is relative to the **canvas**,
    //   following http://blog.webagesolutions.com/archives/135
    posx -= canvas.offsetLeft;
    posy -= canvas.offsetTop;

    cellSize = canvas.width / ConnFour.cols;

    row = Math.floor(posy / cellSize);
    col = Math.floor(posx / cellSize);

	// row and col are now set to the row and column indices where the user clicked
	
	// TODO: Handle the business/game logic
	console.log("CLICKED ROW " + row + " AND COL " + col);
	var newRow = ConnFour.theBoard.getTopRow(col);
	if(newRow < 0) //if this happens the column is full
		return -1;
	ConnFour.theBoard.boardState[newRow][col] = ConnFour.theBoard.nextTurn;
	if(ConnFour.theBoard.checkForWin(newRow, col)){
		if(ConnFour.theBoard.nextTurn == ConnFour.RED)
			ConnFour.status = ConnFour.RED_WIN;
		else ConnFour.status = ConnFour.BLACK_WIN;
	}
	//finally, set ACCEPTING_CLICKS false
	ConnFour.ACCEPTING_CLICKS = false;
	//now switch to the other player
	ConnFour.theBoard.changeActivePlayer();
	
	
};

// Handles clicks on the start game button
ConnFour.startGameHandler = function(){
    "use strict";

	// TODO: Set the main three components of the state:
	//   ConnFour.board, ConnFour.redPlayer, and ConnFour.blackPlayer
	// Create and/or initialize these objects according
	//   to the user's selected players (on the HTML form)
	if(document.getElementById("red_player_selector").value === "Human")
		ConnFour.redPlayer = new ConnFour.HumanPlayer(ConnFour.RED);
	else if(document.getElementById("red_player_selector").value === "Random")
		ConnFour.redPlayer = new ConnFour.RandomPlayer(ConnFour.RED);
	if(document.getElementById("black_player_selector").value === "Human")
		ConnFour.blackPlayer = new ConnFour.HumanPlayer(ConnFour.BLACK);
	else if(document.getElementById("black_player_selector").value === "Random")
		ConnFour.blackPlayer = new ConnFour.RandomPlayer(ConnFour.BLACK);

	var canvas = document.getElementById('board_canvas');
	ConnFour.theBoard = new ConnFour.Board(canvas);
	ConnFour.status = ConnFour.NOT_FINISHED;
	
	// Now that the board and players are set,
	// we start the game by calling the red player's makeMove() function
    
	if(ConnFour.redPlayer){
		ConnFour.redPlayer.makeMove();
    }
    else{
		console.log("ERROR: could not instantiate the red player.");
    }

	// Refresh the board
    ConnFour.resizeHandler();
};


// Sets this to a blank board, with RED's turn next
ConnFour.Board.prototype.reset = function(){
    "use strict";

    var i, j;

    for(i=0; i<ConnFour.rows; i++){
	for(j=0; j<ConnFour.cols; j++){
	    this.boardState[i][j] = ConnFour.EMPTY;
	}
    }

    this.nextTurn = ConnFour.RED;
    this.status = ConnFour.NOT_FINISHED;
};


// Draws the board to the canvas and sets
//   the status information about the turn
ConnFour.Board.prototype.drawBoard = function(canvas){
    "use strict";
    
    var dc;
    dc = canvas.getContext("2d");

    // Clear the canvas
    dc.clearRect(0, 0, canvas.width, canvas.height);

	
	// TODO: Draw the board to the canvas, including the grid lines and pieces
	var i;
	//Draw the gridlines
	for(i=0;i<ConnFour.cols;i++){
		dc.beginPath();
		dc.moveTo(i*canvas.width/ConnFour.cols,0);
		dc.lineTo(i*canvas.width/ConnFour.cols, canvas.height);
		dc.stroke();
	}

	for(i=0;i<ConnFour.rows;i++){
		dc.beginPath();
		dc.moveTo(0,i*canvas.height/ConnFour.rows);
		dc.lineTo(canvas.width, i*canvas.height/ConnFour.rows);
		dc.stroke();
	}

	//Draw the pieces
	var i,j;
	var noSpaces = true;
    for(i=0; i<ConnFour.rows; i++){
		for(j=0; j<ConnFour.cols; j++){
		    if(this.boardState[i][j] == ConnFour.RED){
		    	dc.beginPath();
				var pieceX = (canvas.width / ConnFour.cols)*(j + 0.5);
			    var pieceY = (canvas.height/ConnFour.rows)*(i + 0.5);
			    var radius = canvas.height/ConnFour.rows * 0.45;
			    dc.arc(pieceX, pieceY, radius, 0, 2 * Math.PI, false);
			    dc.fillStyle = 'red';
			    dc.fill();
		    } else if(this.boardState[i][j] == ConnFour.BLACK){
		    	dc.beginPath();
				var pieceX = (canvas.width / ConnFour.cols)*(j + 0.5);
			    var pieceY = (canvas.height/ConnFour.rows)*(i + 0.5);
			    var radius = canvas.height/ConnFour.rows * 0.45;
			    dc.arc(pieceX, pieceY, radius, 0, 2 * Math.PI, false);
			    dc.fillStyle = 'black';
			    dc.fill();
			   
		    } else noSpaces = false;
		}
    }

    if(noSpaces) //there's a draw
    	ConnFour.status = ConnFour.DRAW;
	// TODO: Update the text of #turn_text and the SVG in #turn_circle
	//   on the HTML page
	// The text should indicate whose turn it is, or who has won the
	// game (or if it is a draw).
	if(ConnFour.theBoard.nextTurn === ConnFour.BLACK){
		document.getElementById("turn_text").innerHTML = ConnFour.blackPlayer.getID() + "'s turn.";
		document.getElementById("turn_circle").setAttribute("fill", "black");
	} else {
		document.getElementById("turn_text").innerHTML = ConnFour.redPlayer.getID() + "'s turn.";
		document.getElementById("turn_circle").setAttribute("fill", "red");
	}

	if(ConnFour.status === ConnFour.BLACK_WIN){
		document.getElementById("turn_text").innerHTML = ConnFour.blackPlayer.getID() + " wins!";
		document.getElementById("turn_circle").setAttribute("fill", "black");
	} else if (ConnFour.status === ConnFour.RED_WIN) {
		document.getElementById("turn_text").innerHTML = ConnFour.redPlayer.getID() + " wins!";
		document.getElementById("turn_circle").setAttribute("fill", "red");
	} else if (ConnFour.status === ConnFour.DRAW) {
		document.getElementById("turn_text").innerHTML = "It's a draw!";
		document.getElementById("turn_circle").setAttribute("fill", "white");
	}

};



// The newrow and newcol indicate where the new piece was placed
// Returns true if the new piece created a win, false otherwise
ConnFour.Board.prototype.checkForWin = function(newrow, newcol){
    "use strict";

    var tgtColor, leftCount, rightCount, downCount, r, c;

    // Check for a win
    tgtColor = this.boardState[newrow][newcol];

    // Check vertically
    downCount = 0;
    c=newcol;
    for(r=newrow+1; r<ConnFour.rows; r++){
	if(this.boardState[r][c] === tgtColor){
	    downCount++;
	}
	else{
	    break;
	}
    }
    if(downCount + 1 >= 4){
	// a vertical win
	return true;
    }

    // Check horizontally
    leftCount = 0;
    r=newrow;
    for(c=newcol-1; c>=0; c--){
	if(this.boardState[r][c] === tgtColor){
	    leftCount++;
	}
	else{
	    break;
	}
    }
    rightCount = 0;
    for(c=newcol+1; c<ConnFour.cols; c++){
	if(this.boardState[r][c] === tgtColor){
	    rightCount++;
	}
	else{
	    break;
	}
    }
    if(leftCount + 1 + rightCount >= 4){
	return true;
    }
    
	
    // Check diagonally, NW to SE
    leftCount = 0;
    for(c=newcol-1, r=newrow-1; c>=0 && r>=0; c--, r--){
	if(this.boardState[r][c] === tgtColor){
	    leftCount++;
	}
	else{
	    break;
	}
    }
    rightCount = 0;
    for(c=newcol+1, r=newrow+1; c<ConnFour.cols && r<ConnFour.rows; c++, r++){
	if(this.boardState[r][c] === tgtColor){
	    rightCount++;
	}
	else{
	    break;
	}
    }
    if(leftCount + 1 + rightCount >= 4){
	return true;
    }

    // Check diagonally, SW to NE
    leftCount = 0;
    for(c=newcol-1, r=newrow+1; c>=0 && r<ConnFour.rows; c--, r++){
	if(this.boardState[r][c] === tgtColor){
	    leftCount++;
	}
	else{
	    break;
	}
    }
    rightCount = 0;
    for(c=newcol+1, r=newrow-1; c<ConnFour.cols && r>=0; c++, r--){
	if(this.boardState[r][c] === tgtColor){
	    rightCount++;
	}
	else{
	    break;
	}
    }
    if(leftCount + 1 + rightCount >= 4){
	return true;
    }

    // No win yet
    return false;
    
};    

// TODO: complete the function so it returns a deep
//   copy of this (i.e., changes to this will not
//   affect the returned board, and vice versa)
ConnFour.Board.prototype.clone = function(){
    "use strict";

};


// other Board methods can go here
// Board methods are a good place to put functionality
//   that is not specific to a particular player
//   (e.g., trying to place a piece in a specified column)

ConnFour.Board.prototype.changeActivePlayer = function(){
	"use strict";
	var canvas = document.getElementById('board_canvas');
	if(ConnFour.status === ConnFour.RED_WIN || ConnFour.status === ConnFour.BLACK_WIN ||ConnFour.status === ConnFour.DRAW){
		this.drawBoard(canvas);
		return -1;
	} 
		

    //I'm using nextTurn to track the current player, since the board is being initialized with red playing first and nextTurn set to red.
    if(this.nextTurn == ConnFour.RED){
    	this.nextTurn = ConnFour.BLACK;
    	ConnFour.blackPlayer.makeMove();
    }
    else if(this.nextTurn == ConnFour.BLACK){
    	this.nextTurn = ConnFour.RED;
    	ConnFour.redPlayer.makeMove();
    }
    
    this.drawBoard(canvas);
}


ConnFour.Board.prototype.getTopRow = function(column){
	var i;
	for(i=ConnFour.rows-1; i>=0; i--){
		if(this.boardState[i][column] == ConnFour.EMPTY) return i;
	}

	return -1;
}



ConnFour.Player.prototype.makeMove = function(){
    "use strict";

    alert("Generic Player object has no valid makeMove function.");
};

ConnFour.Player.prototype.getID = function(){
   "use strict";
    return this.name + " (" + (this.color === ConnFour.RED ? "red)" : "black)");
};

ConnFour.HumanPlayer.prototype.makeMove = function(){
    "use strict";
    //signal the clickHandler
    ConnFour.ACCEPTING_CLICKS = true;

};

ConnFour.RandomPlayer.prototype.makeMove = function(){
    "use strict";
    console.log("RandomPlayer's turn")
	// DONE: complete this function
	//wait a little bit
	setTimeout(function(){
	    //pick a random column
		var moveCol = Math.floor((Math.random() * ConnFour.cols));
		var newRow = ConnFour.theBoard.getTopRow(moveCol);
		while(newRow < 0){ // making sure that he doesn't try to place a piece in a full column
			console.log("Whoops! That column's full!")
			moveCol = Math.floor((Math.random() * ConnFour.cols));
			newRow = ConnFour.theBoard.getTopRow(moveCol);
		}
		console.log("Placing a piece on column " + moveCol);
		ConnFour.theBoard.boardState[newRow][moveCol] = ConnFour.theBoard.nextTurn;
		//see if they won
		if(ConnFour.theBoard.checkForWin(newRow, moveCol)){
			if(ConnFour.theBoard.nextTurn == ConnFour.RED)
				ConnFour.status = ConnFour.RED_WIN;
			else ConnFour.status = ConnFour.BLACK_WIN;
		}
		//switch to the other player
		ConnFour.theBoard.changeActivePlayer();
	}, 1000);
	
	
};

ConnFour.SmartPlayer.prototype.makeMove = function(){
    "use strict";
	// TODO: complete this function
	console.log("SmartPlayer's turn")
	//wait a little bit
	setTimeout(function(){
	    //pick a random column
		var moveCol = Math.floor((Math.random() * ConnFour.cols));
		var newRow = ConnFour.theBoard.getTopRow(moveCol);
		while(newRow < 0){ // making sure that he doesn't try to place a piece in a full column
			moveCol = Math.floor((Math.random() * ConnFour.cols));
			newRow = ConnFour.theBoard.getTopRow(moveCol);
		}
		console.log("Placing a piece on column " + moveCol);
		ConnFour.theBoard.boardState[newRow][moveCol] = ConnFour.theBoard.nextTurn;
		//see if they won
		if(ConnFour.theBoard.checkForWin(newRow, moveCol)){
			if(ConnFour.theBoard.nextTurn == ConnFour.RED)
				ConnFour.status = ConnFour.RED_WIN;
			else ConnFour.status = ConnFour.BLACK_WIN;
		}
		//switch to the other player
		ConnFour.theBoard.changeActivePlayer();
	}, 1100);
	
};



ConnFour.resizeHandler();

ConnFour.addEvent(document.getElementById('board_canvas'),
		  'click', ConnFour.clickHandler);

ConnFour.addEvent(document.getElementById('start_game'),
		  'click', ConnFour.startGameHandler);

ConnFour.addEvent(window, 'resize', ConnFour.resizeHandler);
