let gBoard;

var gLevel = {
    size: 4,
    mines: 2
}
    

var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0
}



var firstClick = true;

function myFunc(){
    alert("Worked!");
}
// Factory
function createCell(MinesAroundCount, isShown, isMine, isMarked){
    var cell = {
        MinesAroundCount: MinesAroundCount,
        isShown: isShown,
        isMine: isMine,
        isMarked: isMarked
    }
    return cell
}


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
            table += `<td id = "ij-${i}-${j}" onclick="cellClicked(gBoard,${i},${j})" oncontextmenu = "cellMarked(gBoard,${i},${j}); return false;"></td>`
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
                if(board[i][j].isShown == false){
                    board[i][j].isShown = true;
                    gGame.showCount++;
                }
                
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
    //console.log(rowColArr);
    
    while(x != mines){
        var randomIndex = Math.floor(Math.random()*(((board.length) ** 2) - 1)); // if 8 X 8 then i = 0,...,63
            if (rowColArr[randomIndex][2] == 0){
                randomMines.push(rowColArr[randomIndex])
                rowColArr[randomIndex][2] += 1;
                x++;
            }
    }
    //console.log(randomMines);
   

    for(let i = 0; i < randomMines.length; i ++){ //[i,j,1]
        board[randomMines[i][0]][randomMines[i][1]].isMine = true;
    }

    //console.log(board);

    setMinesNegsCount(board)
    

}

function cellClicked(board,i,j){
    if (gGame.isOn == false){
        return;
    }
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
       if(board[i][j].isShown == true && board[i][j].isMine == false){
        gGame.showCount++;
       }
       expandShown(board,i,j);
       renderBoard(board);
       console.log(gGame.showCount);
       console.log(gGame.markedCount);
    }
    checkGameOver();
}

function cellMarked(board,i,j){
    //preventDefault();
    if (gGame.isOn == false){
        return;
    }
    if (board[i][j].isShown == false){
        if (board[i][j].isMarked == true) {
            board[i][j].isMarked = false
            gGame.markedCount--;

        } else {
            board[i][j].isMarked = true
            gGame.markedCount++;
        }
        renderBoard(board);
    }
}



function checkGameOver(){
    for(let i = 0; i < gBoard.length; i++){
        for(let j = 0; j < gBoard.length; j++){
            if(gBoard[i][j].isMine == true && gBoard[i][j].isShown == true){
                console.log("Game Over, You Lost !")
                console.log(gGame.showCount);
                gGame.isOn = false;
                break;
            } 
        }
    }
    if(gGame.showCount == ((gLevel.size**2) - gLevel.mines)){
        console.log("Game Over, You Won ! ! !");
        gGame.isOn = false;
    }
}

function startGame(){
    gGame.isOn = true;
    gBoard = createBoard(gLevel.size,gLevel.mines);
    renderBoard(gBoard);
}

startGame();








