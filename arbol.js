var readline = require('readline-sync');
var d = 0;
var arbol = [];
var best;
var depth = 0;

//var user = readline.question('name');
//var port = readline.question('port');
//var tournament = readline.question('tournament');

var port = '4000'
var tournament = '142857'
var user = 'santiago'
var socket = require('socket.io-client')("http://192.168.1.142:" + port + "");  // for example: http://127.0.0.1:3000

socket.on('connect', function(){
	console.log("Conectado.")
  socket.emit('signin', {
    user_name: user,
    tournament_id: parseInt(tournament),
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Registrado exitosamente.");
  
});


socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  //console.log(data)
});



socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  
 
  console.log("Arbol");
  var moves = legalMoves(board,playerTurnID);
  depth=0;

  //AI minMax alpha beta
  //Tree
  var tree = new Tree(board);
  d = 0;
  tree._root.moves =  legalMoves(board,playerTurnID);  
  //Creo el game tree
  makeTree(tree._root,playerTurnID,d);
  
  //Obtengo el index de la mejor euristica 
  var mov = moves[moves.indexOf(alphaBetaPrune(tree._root,5,-1.7976931348623157E+10308,1.7976931348623157E+10308,playerTurnID))];

  socket.emit('play', {
    tournament_id: parseInt(tournament),
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: parseInt(mov)
  });
});


socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
  
  socket.emit('player_ready', {
    tournament_id: parseInt(tournament),
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});


var arbol = [];
var nivel = [];

function nuevoArbol(nivel){
	var i;
	var j;
	for(j=0;j<5;j++)
	{
		for(i=0;i<nivel.length;i++)
		{
			var possibleMoves = legalMoves(nivel[1],turn);
			rama = [];
			nivel = [];
			var j;
			for(j=0;j<possibleMoves;j++){
				rama.push(possibleMoves[i]);
				rama.push(makeMove(nivel[1],possibleMoves[i],turn));
				nivel.push(rama);
				rama = [];
			}
			
		}

		if(turn==1){
			turn = 2;
		}
		else if(turn==2){
			turn = 1;
		}
	}
}
var v;

function alphaBetaPrune(node,depth,a,b,player){
	if(depth == 0){
		best = node;
		return node.heu
	}

	if(player==1){
        v = -1.7976931348623157E+10308;
        var i;
        for(i=0;i<node.children.length;i++){
        	v = Math.max(v,alphaBetaPrune(node.children[i],depth-1,a,b,2));
        	a = Math.max(a,v);
        	if(b<=a){
        		break;
        	}
        }
        return v;
	}
	else{
        v = 1.7976931348623157E+10308;
        var i;
        for(i=0;i<node.children.length;i++){
        	v = Math.min(v,alphaBetaPrune(node.children[i],depth-1,a,b,1));
        	a = Math.min(a,v);
        	if(b<=a){
        		break;
        	}
        }
        return v;
	}
}


function makeTree(node,turn,d){  
  d+=1;
  if(turn == 1){
	turn =2;
   }
   else{
	turn =1;
   }
  var i;
  if(d<=5)
  {
  	for(i=0;i<node.moves.length;i++)
  	{
			console.log("nivel ",d," turno ",turn," hijo ",i , " hijos ",node.moves.length);
			var newBoard = makeMove(node.data,node.moves[i],turn);
			var newPossibleMoves = legalMoves(newBoard,turn);
			if(newPossibleMoves.length>0)
			{
				var n = new Node(newBoard);
				n.moves = newPossibleMoves;
				node.children.push(n);
				makeTree(n,turn,d);
			}
  	}
  }
  node.heu = getHeuristica(node.data,turn);
  d-=1;	 
}

function printBoard(board){
	var i;
	var row='';
     for(i=0;i<board.length;i++){
        row += String(board[i])
        if(i==7||i==15||i==23||i==31||i==39||i==47||i==55||i==63){
        	console.log(row);
        	row = ''
        } 
     }
}


function legalMoves(board,yo){
    var moves = [];
	var i;
	if(yo==1){
		player = 2;
	}
	if(yo==2){
		player = 1;
	}
	
    for (i = 0; i < board.length; i++) { 
        if (board[i]==player){
			//console.log(i);
			if(i-9>=0){
				if(board[i-9]==0)
				{
				pos = i + 9;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-9)<0){
							moves.push(i-9);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 9;
				}
			}
			}
			if(i-8>=0){
				if(board[i-8]==0)
				{
				pos = i + 8;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-8)<0){
							moves.push(i-8);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 8;
				}
			}	
			}
			if(i-7>=0){
				if(board[i-7]==0)
				{
				pos = i + 7;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-7)<0){
							moves.push(i-7);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 7;
				}
			}	
			}
			if(i-1>=0){
				if(board[i-1]==0)
				{
				pos = i + 1;
				while(pos<=63){
					if(board[pos]==yo){
						if(moves.indexOf(i-1)<0){
							moves.push(i-1);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos + 1;
				}
			}	
			}
			if(i+8<=63){
				if(board[i+8]==0)
				{
				pos = i - 8;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+8)<0){
							moves.push(i+8);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 8;
				}
			}
			}
			if(i+1<=63){
				if(board[i+1]==0)
				{
				pos = i - 1;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+1)<0){
							moves.push(i+1);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 1;
				}
				}
			}
			if(i+7<=63){
				if(board[i+7]==0)
				{
	            pos = i - 7;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+7)<0){
						moves.push(i+7);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 7;
				}
			}
			}
			if(i+9<=63){
				if(board[i+9]==0)
				{
				pos = i - 9;
				while(pos>=0){
					if(board[pos]==yo){
						if(moves.indexOf(i+9)<0){
						moves.push(i+9);
						}
					}
					if(board[pos]==0){
					    break;
					}
					pos = pos - 9;
				}
				}
			}
		}
    }
	//console.log(moves);
	return moves;
}

function Node(data) {
    this.data = data;
	this.heu = null;
    this.parent = null;
	this.moves = [];
    this.children = [];
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
}

function getHeuristica(board,yo){
	if(yo==1){
		el = 2;
	}
	else{
		el = 1;
	}
	var heuristica = 0;
    for(var i = 0; i < board.length; ++i){
		if(board[i] == el){
			heuristica++;
		}
		else{	
		   heuristica--;
		}
    }
    for(var i = 0; i < board.length; ++i){
    	if(i>=0||i<=7){
    		heuristica++;
    	}
    }


	return heuristica
}


function makeMove(board,move,yo){
	var pos;
	//console.log(move);
    board[move] = yo;
	
	if(yo==1){
		player = 2;
	}
	if(yo==2){
		player = 1;
	}
	if(move-9>=0){
		if(board[move-9]==player){
			pos = move-9;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos -9;
				}
				else if(board[pos] == yo){
					pos = pos + 9;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 9;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move-8>=0){
		if(board[move-8]==player){
			pos = move-8;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos -8;
				}
				else if(board[pos] == yo){
					pos = pos + 8;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 8;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move-7>=0){
		if(board[move-7]==player){
			pos = move-7;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos -7;
				}
				else if(board[pos] == yo){
					pos = pos + 7;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 7;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move-1>=0){
		if(board[move-1]==player){
			pos = move-1;
		    while(pos>=0){
				if(board[pos] == player){
					pos = pos-1;
				}
				else if(board[pos] == yo){
					pos = pos + 1;
					while(pos!=move){
						board[pos] = yo;
						pos = pos + 1;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+1<=63){
		if(board[move+1]==player){
			pos = move+1;
		    while(pos<=63){
				if(board[pos] == player){
					pos = pos+1;
				}
				else if(board[pos] == yo){
					pos = pos - 1;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 1;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+7<=63){
		if(board[move+7]==player){
			pos = move+7;
		    while(pos<=63){
				if(board[pos] == player){
					pos = pos+7;
				}
				else if(board[pos] == yo){
					pos = pos - 7;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 7;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+8<=63){
		if(board[move+8]==player){
			pos = move+8;
		    while(pos<=63){
				
				if(board[pos] == player){
					pos = pos+8;
				}
				else if(board[pos] == yo){
					pos = pos - 8;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 8;
						
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	if(move+9<=63){
		if(board[move+9]==player){
			pos = move+9;
		    while(pos<=63){
				if(board[pos] == player){
					pos = pos+9;
				}
				else if(board[pos] == yo){
					pos = pos - 9;
					while(pos!=move){
						board[pos] = yo;
						pos = pos - 9;
					}
					break;
				}
				else if(board[pos] == 0){
					break;
				}
			}
		}
	}
	
	return board;
	
}

