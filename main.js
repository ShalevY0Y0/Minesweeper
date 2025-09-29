var gBoard;

var gLevel = {
    size: 8,
    mines: 12
}
   
    

var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    lifes: 3,
    secPassed: 0
}



var firstClick;

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
    let table = `<table id = "board"> <div id = "btn-container"><button onclick = "startGame(4,2)">Easy</button><button onclick = "startGame(8,12)">Intermediate</button><button onclick = "startGame(12,30)">Expert</button></div><div id = "restart-container"> <div id = "remainningMarks">${gLevel.size-gGame.markedCount}</div> <button id = "emoji" onclick = "startGame(gLevel.size,gLevel.mines)">😃</button> <div id = "time">${gGame.secPassed}</div></div>`;
    for(let i = 0; i < board.length; i ++){
        table += `<tr>`;
        for(let j = 0; j < board.length; j++){
            table += `<td id = "ij-${i}-${j}" onclick="cellClicked(gBoard,${i},${j})" oncontextmenu = "cellMarked(gBoard,${i},${j}); return false;"></td>`
        }
        table += `</tr>`;
    }
    if(gGame.lifes == 3){
        table  += `</table><div id = "life-container"> ♥️ ♥️ ♥️ </div>`;
    } else if(gGame.lifes == 2){
        table  += `</table> <div id = "life-container"> ♥️ ♥️</div>`;
    } else if(gGame.lifes == 1){
        table  += `</table> <div id = "life-container"> ♥️ </div>`;
    } else{
        `</table> <div id = "life-container"></div>`;
    }
    document.getElementById('table-container').innerHTML = table

    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if (board[i][j].isMine == true){
               if (board[i][j].isShown == true){
                   //document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'red';
                   document.getElementById("ij-"+i +"-"+ j).innerHTML= '💣';

                } else {
                    if (board[i][j].isMarked == true){
                        document.getElementById("ij-"+i +"-"+ j).innerHTML= '🚩';

                    } else{
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = '#c3c3c3;';
                    }
                }
            }else{
                if (board[i][j].isShown == true){
                    document.getElementById("ij-"+i +"-"+j).style.backgroundColor = 'rgb(255,255,255)';
                    document.getElementById("ij-"+i +"-"+j).innerHTML = board[i][j].MinesAroundCount;
                    if (board[i][j].MinesAroundCount == 0){
                        document.getElementById("ij-"+i +"-"+j).innerHTML = '';

                    } else if (board[i][j].MinesAroundCount == 1){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'blue';

                    } else if(board[i][j].MinesAroundCount == 2){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'green';

                    } else if (board[i][j].MinesAroundCount == 3){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'red';

                    } else if(board[i][j].MinesAroundCount == 4){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'navy';

                    } else if(board[i][j].MinesAroundCount == 5){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'maroon';

                    } else if(board[i][j].MinesAroundCount == 6){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'teal';

                    } else if(board[i][j].MinesAroundCount == 7){
                        document.getElementById("ij-"+i +"-"+j).style.color = 'black';

                    } else{
                        document.getElementById("ij-"+i +"-"+j).style.color = 'gray';

                    }
                } else{
                    if(board[i][j].isMarked == true){
                        document.getElementById("ij-"+i +"-"+ j).innerHTML = '🚩';
                    } else {
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = '#c3c3c3;';
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
    
    
    while(x != mines){
        var randomIndex = Math.floor(Math.random()*(((board.length) ** 2) - 1)); // if 8 X 8 then i = 0,...,63
            if (rowColArr[randomIndex][2] == 0){
                randomMines.push(rowColArr[randomIndex])
                rowColArr[randomIndex][2] += 1;
                x++;
            }
    }
    for(let i = 0; i < randomMines.length; i ++){ 
        board[randomMines[i][0]][randomMines[i][1]].isMine = true;
    }
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
    }
    checkGameOver();

}

function cellMarked(board,i,j){
    if (gGame.isOn == false){
        return;
    }
    if (board[i][j].isShown == false){
        if (board[i][j].isMarked == true) {
            board[i][j].isMarked = false
            gGame.markedCount--;

        } else {
            if (gGame.markedCount < gLevel.size){
                board[i][j].isMarked = true
                gGame.markedCount++;
            }
        }
        renderBoard(board);
    }
    checkGameOver();
}


function showAllMines(board){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if(board[i][j].isMine == true){
                board[i][j].isShown = true;
            }
        }
    }

}

function allMinesAreMarked(board){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if(board[i][j].isMine == true){
                if(board[i][j].isMarked != true){
                    return false;

                }
            }
        }
    }
    return true;

}


function checkGameOver(){
    for(let i = 0; i < gBoard.length; i++){
        for(let j = 0; j < gBoard.length; j++){
            if(gBoard[i][j].isMine == true && gBoard[i][j].isShown == true){
                if(gGame.lifes == 1){
                console.log("Game Over, You Lost !");
                showAllMines(gBoard);
                renderBoard(gBoard);
                document.getElementById("emoji").textContent = '😞';
                document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'red';
                gGame.isOn = false;
                document.getElementById("life-container").innerHTML = '';
                gGame.lifes--;
                console.log(gBoard)
                console.log(gBoard.showCount, gBoard.markedCount)
                return;
                } else if (gGame.lifes == 2){
                    gGame.lifes--;
                    document.getElementById("ij-"+i +"-"+ j).innerHTML = '💣';
                    setTimeout(() => {
                        document.getElementById("ij-"+i +"-"+ j).innerHTML = '';
                    }, 1000);
                    document.getElementById("life-container").innerHTML = '♥️';
                    gBoard[i][j].isShown = false;
                    console.log(gBoard)
                    console.log(gGame.showCount, gGame.markedCount)
                    return;
                

                } else {
                    gGame.lifes--;
                    document.getElementById("ij-"+i +"-"+ j).innerHTML = '💣';
                    setTimeout(() => {
                        document.getElementById("ij-"+i +"-"+ j).innerHTML = '';
                    }, 1000);
                    document.getElementById("life-container").innerHTML = '♥️♥️';
                    gBoard[i][j].isShown = false;
                    console.log(gBoard)
                    console.log(gGame.showCount, gGame.markedCount)
                    return;

                }
            } 
        }
    }
    if(gGame.showCount == ((gLevel.size**2) - gLevel.mines) && allMinesAreMarked(gBoard)){
        console.log("Game Over, You Won ! ! !");
        document.getElementById("emoji").textContent = '😎';
        gGame.isOn = false;
    }
}

function startGame(size,mines){
    firstClick = true;
    gLevel.size = size;
    gLevel.mines = mines;
    gGame.isOn = true;
    gGame.showCount = 0;
    gGame.markedCount = 0;
    gGame.lifes = 3;
    gBoard = createBoard(gLevel.size,gLevel.mines);
    renderBoard(gBoard);
}

startGame(4,2);
console.log(gLevel.size, gLevel.mines)








