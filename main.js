/*
# use js to render the board. It also means creating the proper html from the renderBoard function.
# creating the board in a general way - use createBoard() to create 4 by 4, 8 by 8, 12 by 12,.., n by n .....
# create a game loop

1. first- lets render a board 4 by 4 dynamicly. later i'll generalize it.
*/

// Factory

var firstClick = true;



function createCell(MinesAroundCount, isShown, isMine, isMarked){
    var cell = {
        MinesAroundCount: MinesAroundCount,
        isShown: isShown,
        isMine: isMine,
        isMarked: isMarked
    }
    return cell
}



// 4 X 4 -> 2 Mines, 8 X 8 -> 12 Mines, 12 X 12 -> 30 Mines
/*
function randomizeMines(size,Mines){
    var x = 0;
    var rowColArr = []; // all [i,j] of the matrix
    var randomMines = []; // here will be the random [i,j] places that will be used for Mines
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            rowColArr.push([i,j,0]);
        }
    }
    
    while(x != Mines){
        var randomIndex = Math.floor(Math.random()*((size) ** 2)); // if 8 X 8 then i = 0,...,63
            if (rowColArr[randomIndex][2] == 0){
                randomMines.push(rowColArr[randomIndex])
                rowColArr[randomIndex][2] += 1;
                x++;
            }
    }
    return randomMines;
}
    */


// Creating 2D arrays of Cells
// Default isShown: false
function createBoard(size,mines){
    var board = [];
    for(let i = 0; i < size; i++){
        const row = [];
        for(let j =0; j<size; j++){
            row.push(createCell(0,false,false,false))
        }
        board.push(row)
    }
    /*
    var randomMines = randomizeMines(size,mines);
    for(let i = 0; i < randomMines.length; i ++){ //[i,j,1]
        board[randomMines[i][0]][randomMines[i][1]].isMine = true;
    }
        */
    
    return board;
}

// Barak's Help
function setMinesNegsCountHelper(Ci,Cj,board){
    for (let i = Ci-1; i <= Ci + 1; i++){
        if(i < 0 || i >= board.length){
            continue;
        }
        for(let j = Cj - 1; j <= Cj + 1; j++){
            if(j < 0 || j >= board.length){
                continue;
            }
            if ((Ci == i && Cj == j)){
                continue;
            }
            if (board[i][j].isMine == true){
                board[Ci][Cj].MinesAroundCount++;
            }
        }
    }
}

// Counting mines around each cell
function setMinesNegsCount(board){
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board.length; c++){
            setMinesNegsCountHelper(r,c,board)
        }
    }    
}

function renderBoard(board){
    let table = `<table id = "board">`;
    for(let i = 0; i < board.length; i ++){
        table += `<tr>`;
        for(let j = 0; j < board.length; j++){
            table += `<td id = "ij-${i}-${j}"></td>`
        }
        table += `</tr>`;
    }
    table  += `</table>`;
    document.getElementById('table-container').innerHTML = table




    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if (board[i][j].isMine == true){
               if (board[i][j].isShown == true){
                   document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'red';
                } else {
                    if (board[i][j].isMarked == true){
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'orange';

                    } else{
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'green';
                    }
                }
            }else{
                if (board[i][j].isShown == true){
                    document.getElementById("ij-"+i +"-"+j).style.backgroundColor = 'blue';
                    document.getElementById("ij-"+i +"-"+j).innerHTML = board[i][j].MinesAroundCount;
                } else{
                    if(board[i][j].isMarked == true){
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'orange';
                    } else {
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'green';
                    }
                }

            }
        }
    }


}

function expandShown(board,Ci,Cj){
    if(board[Ci][Cj].MinesAroundCount == 0 && board[Ci][Cj].isMine == false){
        for (let i = Ci-1; i <= Ci + 1; i++){
            if(i < 0 || i >= board.length){
               continue;
            }
            for(let j = Cj - 1; j <= Cj + 1; j++){
                if(j < 0 || j >= board.length){
                    continue;
                }
                if ((Ci == i && Cj == j)){
                    continue;
                }
                board[i][j].isShown = true;
            }
        }
    }

}

function replantMinesExclude(board, mines, r, c){
    var x = 0;
    var rowColArr = []; // all [i,j] of the matrix
    var randomMines = []; // here will be the random [i,j] places that will be used for Mines
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if(i == r && c == j){
                continue
            } else {
                rowColArr.push([i,j,0]);
            }
        }
    }
    console.log(rowColArr);
    
    while(x != mines){
        var randomIndex = Math.floor(Math.random()*(((board.length) ** 2) - 1)); // if 8 X 8 then i = 0,...,63
            if (rowColArr[randomIndex][2] == 0){
                randomMines.push(rowColArr[randomIndex])
                rowColArr[randomIndex][2] += 1;
                x++;
            }
    }
    console.log(randomMines);
   

    for(let i = 0; i < randomMines.length; i ++){ //[i,j,1]
        board[randomMines[i][0]][randomMines[i][1]].isMine = true;
    }

    console.log(board);

    setMinesNegsCount(board)
    

}

function cellClicked(board,i,j){
    if (board[i][j].isShown == false && board[i][j].isMarked == false){
        if(firstClick){
            if (board.length == 4){
                replantMinesExclude(board, 2, i, j);
            }

            if (board.length == 8) {
                replantMinesExclude(board, 12, i, j);
            }

            if(board.length == 12){
                replantMinesExclude(board, 30, i, j);
            }
            firstClick = false;
        }


       board[i][j].isShown = true;
       expandShown(board,i,j);
       renderBoard(board)
    }
}

function cellMarked(board,i,j){
    if (board[i][j].isShown == false){
        if (board[i][j].isMarked == true) {
            board[i][j].isMarked = false
        } else {
            board[i][j].isMarked = true
        }
        renderBoard(board);
    }
}

var test = createBoard(8,12);
//var test = createBoard(12,30);
//var test = createBoard(4,2);
//setMinesNegsCount(test);
renderBoard(test);

document.addEventListener("click", function(event){
    if (event.target.tagName == "TD") {
        var identity = event.target.id.slice(3);
        console.log(event.target.id.slice(3));
        for(let i = 0; i < identity.length; i++){
            if (identity[i] == '-'){
                var r = Number(identity.slice(0,i));
                var c = Number(identity.slice(i+1));
            }
        }
        cellClicked(test,r,c);
    }

})

document.addEventListener("contextmenu", function(event){
    if (event.target.tagName == "TD") {
        var identity = event.target.id.slice(3);
        for(let i = 0; i < identity.length; i++){
            if (identity[i] == '-'){
                var r = Number(identity.slice(0,i));
                var c = Number(identity.slice(i+1));
            }
        }
        cellMarked(test,r,c);
        event.preventDefault();
    }
})







/*
function renderBoard(){
    document.getElementById('board').innerHTML = 'hhh'
}

renderBoard();
*/
