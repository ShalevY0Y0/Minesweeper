var gBoard;

var gLevel = {
    size: 8,
    mines: 12
}

var gGame = {

    bestScoreLvl1: 0,
    bestScoreLvl2: 0,
    bestScoreLvl3: 0,

    isOn: false,
    showCount: 0,
    markedCount: 0,
    lifes: 3,
    secPassed: 0,

    clickLocked: true,
    hintMode: false,
    hintInUse: false,
    hintsArr: [false,false,false],
    hintCurrNum: 0,
    safeArr: [false, false, false]




}



var firstClick;


function loadBestScores(){
    var s1 = localStorage.getItem("Best-Score-1");
    var s2 = localStorage.getItem("Best-Score-2");
    var s3 = localStorage.getItem("Best-Score-3");
    
    gGame.bestScoreLvl1 = s1;
    gGame.bestScoreLvl2 = s2;
    gGame.bestScoreLvl3 = s3;
}

function updateBestScores(size, score){
    if (size == 4){
        if (score < Number(gGame.bestScoreLvl1) || gGame.bestScoreLvl1 == null){
            gGame.bestScoreLvl1 = score;
            localStorage.setItem("Best-Score-1", JSON.stringify(gGame.bestScoreLvl1));
        }

    } else if(size == 8){
        if ((score < Number(gGame.bestScoreLvl2) || gGame.bestScoreLvl2 == null)){
        gGame.bestScoreLvl2 = score;
        localStorage.setItem("Best-Score-2", JSON.stringify(gGame.bestScoreLvl2));
        }
    } else {
        if ((score < Number(gGame.bestScoreLvl3) || gGame.bestScoreLvl3 == null)){
            gGame.bestScoreLvl3 = score;
            localStorage.setItem("Best-Score-3", JSON.stringify(gGame.bestScoreLvl3));
        }
    }
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
    let table = `<table id = "board"><div id = "bestTime"></div> <div id = "btn-container"><button onclick = "startGame(4,2)">Easy</button><button onclick = "startGame(8,12)">Intermediate</button><button onclick = "startGame(12,30)">Expert</button></div> <div id = "help-container"><div id = "safe-containor">  <div id = "lock-1" class = "lock" onclick = "clickedSafe(1)">🔒</div> <div id = "lock-2" class = "lock" onclick = "clickedSafe(2)">🔒</div> <div id = "lock-3" class = "lock" onclick = "clickedSafe(3)">🔒</div>   </div><div id = "hint-container"><div id = "hint-1" class = "hint" onclick ="clickedHint(1)">💡</div><div id = "hint-2" class = "hint" onclick ="clickedHint(2)">💡</div><div id = "hint-3" class = "hint" onclick ="clickedHint(3)">💡</div></div></div> <div id = "restart-container"><div id = "emoji-flag">🚩</div> <div id = "remainningMarks">${gLevel.mines-gGame.markedCount}</div> <button id = "emoji" onclick = "startGame(gLevel.size,gLevel.mines)">😃</button> <div id = "time">${gGame.secPassed}</div><div id = "emoji-timer">⏳</div></div>`;
    for(let i = 0; i < board.length; i ++){
        table += `<tr>`;
        for(let j = 0; j < board.length; j++){
            table += `<td id = "ij-${i}-${j}" onclick="cellClicked(gBoard,${i},${j})" oncontextmenu = "cellMarked(gBoard,${i},${j}); return false;"></td>`
        }
        table += `</tr>`;
    }
    

    if(gGame.lifes == 3){
        table  += `</table><div id = "life-container"> ❤️ ❤️ ❤️ </div>`;
    } else if(gGame.lifes == 2){
        table  += `</table> <div id = "life-container"> ❤️ ❤️ 💔</div>`;
    } else if(gGame.lifes == 1){
        table  += `</table> <div id = "life-container"> ❤️ 💔 💔 </div>`;
    } else{
        `</table> <div id = "life-container"></div>`;
    }

    document.getElementById('table-container').innerHTML = table;

      
    for(let i = 0; i < gGame.hintsArr.length; i++){
        if (gGame.hintsArr[i] == true){
            document.getElementById("hint-" + (i + 1)).textContent= '';
        }
    }

    for(let i = 0; i < gGame.safeArr.length; i++){
        if (gGame.safeArr[i] == true){
            document.getElementById("lock-" + (i + 1)).textContent= '';
        }
    }

    if (gLevel.size == 4 && gGame.bestScoreLvl1 != null){
        document.getElementById("bestTime").textContent = `Best Time: ${gGame.bestScoreLvl1}`

    } else if (gLevel.size == 8 && gGame.bestScoreLvl2 != null){
        document.getElementById("bestTime").textContent = `Best Time: ${gGame.bestScoreLvl2}`

    } else{
        if(gGame.bestScoreLvl3 != null) {
            document.getElementById("bestTime").textContent = `Best Time: ${gGame.bestScoreLvl3}`
        }
    }


    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if (board[i][j].isMine == true){
               if (board[i][j].isShown == true){
                   //document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = 'red';
                   document.getElementById("ij-"+i +"-"+ j).textContent= '💣';

                } else {
                    if (board[i][j].isMarked == true){
                        document.getElementById("ij-"+i +"-"+ j).textContent= '🚩';

                    } else{
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = '#c3c3c3';
                    }
                }
            }else{
                if (board[i][j].isShown == true){
                    document.getElementById("ij-"+i +"-"+j).style.backgroundColor = 'rgb(255,255,255)';
                    document.getElementById("ij-"+i +"-"+j).textContent = board[i][j].MinesAroundCount;
                    if (board[i][j].MinesAroundCount == 0){
                        document.getElementById("ij-"+i +"-"+j).textContent = '';

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
                        document.getElementById("ij-"+i +"-"+ j).textContent = '🚩';
                    } else {
                        document.getElementById("ij-"+i +"-"+ j).style.backgroundColor = '#c3c3c3';
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
                    if (board[i][j].isMarked != true){
                        board[i][j].isShown = true;
                        gGame.showCount++;
                    }
                    if(board[i][j].MinesAroundCount == 0){
                        expandShown(board,i,j);
                    }
                    
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
    var storedIndexes = [];
    if (gGame.hintMode){
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


        for(let r = i - 1; r <= i + 1; r++){
            if( r < 0 || r >= board.length){
                continue;
            }
            for(let c = j - 1; c <= j + 1; c++){
                if(c < 0 || c >= board.length){
                    continue;
                }

                storedIndexes.push([r,c]);
                if(board[r][c].isMine == true){
                    document.getElementById("ij-"+r +"-"+ c).textContent = '💣';
                } else{
                    if(board[r][c].isShown == false){
                        document.getElementById("ij-"+r +"-"+ c).textContent= `${board[r][c].MinesAroundCount}`;
                    }

                    }
                    
            }
    
        }
        //console.log(storedIndexes);
        setTimeout(() => {
            for(let k = 0; k < storedIndexes.length; k++){
                if (board[storedIndexes[k][0]][storedIndexes[k][1]].isShown == false){
                    if(board[storedIndexes[k][0]][storedIndexes[k][1]].isMarked == true){
                        document.getElementById("ij-"+storedIndexes[k][0] +"-"+storedIndexes[k][1]).textContent = '🚩';

                    }else{
                        document.getElementById("ij-"+storedIndexes[k][0] +"-"+storedIndexes[k][1]).textContent = '';
                    }
                    
                }
            }
           
            
        }, 2000);


        
        gGame.hintMode = false;
        gGame.clickLocked = false;
        document.getElementById("hint-" + gGame.hintCurrNum).textContent= '';
        gGame.hintCurrNum = 0;
        gGame.hintInUse = false;
        console.log(gBoard)
        return;
    }



    if (gGame.isOn == false || gGame.clickLocked == true){
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
    if (gGame.isOn == false || gGame.clickLocked == true){
        return;
    }
    if (board[i][j].isShown == false){
        if (board[i][j].isMarked == true) {
            board[i][j].isMarked = false
            gGame.markedCount--;

        } else {
            if (gGame.markedCount < gLevel.mines){
                board[i][j].isMarked = true
                gGame.markedCount++;
            }
        }
        console.log(board);
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
                document.getElementById("life-container").textContent = '💔 💔 💔';
                gGame.lifes--;
                localStorage.setItem("Best-Time",JSON.stringify(gGame.secPassed));
            
                return;
                } else if (gGame.lifes == 2){
                    gGame.lifes--;
                    gGame.clickLocked = true;
                    document.getElementById("ij-"+i +"-"+ j).textContent = '💣';
                    setTimeout(() => {
                        document.getElementById("ij-"+i +"-"+ j).textContent = '';
                        gGame.clickLocked = false;
                    }, 1000);
                    document.getElementById("life-container").textContent = '❤️ 💔 💔';
                    gBoard[i][j].isShown = false;
                    return;
                

                } else {
                    gGame.lifes--;
                    gGame.clickLocked = true;
                    document.getElementById("ij-"+i +"-"+ j).textContent = '💣';
                    setTimeout(() => {
                        document.getElementById("ij-"+i +"-"+ j).textContent = '';
                        gGame.clickLocked = false;
                    }, 1000);
                    document.getElementById("life-container").textContent = '❤️ ❤️ 💔';
                    gBoard[i][j].isShown = false;
                    return;

                }
            } 
        }
    }
    if(gGame.showCount == ((gLevel.size**2) - gLevel.mines) && allMinesAreMarked(gBoard)){
        console.log("Game Over, You Won ! ! !");
        document.getElementById("emoji").textContent = '😎';
        gGame.isOn = false;
        updateBestScores(gLevel.size, gGame.secPassed);

        if (gLevel.size == 4 && gGame.bestScoreLvl1 != null){
            document.getElementById("bestTime").textContent = `Best Time: ${gGame.bestScoreLvl1}`
    
        } else if (gLevel.size == 8 && gGame.bestScoreLvl2 != null){
            document.getElementById("bestTime").textContent = `Best Time: ${gGame.bestScoreLvl2}`
    
        } else{
            if(gGame.bestScoreLvl3 != null) {
                document.getElementById("bestTime").textContent = `Best Time: ${gGame.bestScoreLvl3}`
            }
        }
        
    }
}

const id = setInterval(() => {
    if (gGame.isOn == true){
    gGame.secPassed++;
    document.getElementById("time").textContent = `${gGame.secPassed}`;
    }
}, 1000);

function clickedHint(numOfHint){
    if (gGame.hintInUse == false){
    if (gGame.hintMode == false){
    document.getElementById("hint-" + numOfHint).style.fontSize = "35px";
    gGame.clickLocked = true;
    gGame.hintMode = true;
    gGame.hintCurrNum = numOfHint;
    gGame.hintsArr[numOfHint-1] = true;
    gGame.hintInUse = true;
    } else {
        document.getElementById("hint-" + numOfHint).style.fontSize = "25px";
        gGame.hintMode = false;
        gGame.clickLocked = false;
        gGame.hintsArr[numOfHint-1] = false;
        gGame.hintCurrNum = 0;
    }
} else{
    if(gGame.hintsArr[numOfHint - 1] == true){
        document.getElementById("hint-" + numOfHint).style.fontSize = "25px";
        gGame.hintMode = false;
        gGame.clickLocked = false;
        gGame.hintsArr[numOfHint-1] = false;
        gGame.hintCurrNum = 0;
        gGame.hintInUse = false;
    }

}
}

function clickedSafe(numOfSafe){
    gGame.hintMode = false;
    gGame.clickLocked = true;

    gGame.safeArr[numOfSafe - 1] = true;

    var availableSquares = [];
    document.getElementById("lock-" + numOfSafe).textContent = '';

    for(let i = 0; i < gBoard.length; i++){
        for(let j = 0; j < gBoard.length; j++){
            if ( gBoard[i][j].isMine == false && gBoard[i][j].isShown == false){
                availableSquares.push([i,j]);
            }
        }
    }
    


    console.log(availableSquares);
    var randomIndex = Math.floor(Math.random() * availableSquares.length);
    console.log(randomIndex);
    var r = availableSquares[randomIndex][0];
    var c = availableSquares[randomIndex][1];
    console.log(r,c)

    document.getElementById("ij-"+r +"-"+ c).style.backgroundColor = 'yellow';

    setTimeout(() => {
        document.getElementById("ij-"+r +"-"+ c).style.backgroundColor = '#c3c3c3';
        gGame.clickLocked = false;
    }, 2000);

}



function startGame(size,mines){
    firstClick = true;
    gLevel.size = size;
    gLevel.mines = mines;
    gGame.hintsArr = [false,false,false];   
    gGame.isOn = true;
    gGame.showCount = 0;
    gGame.markedCount = 0;
    gGame.lifes = 3;
    gGame.secPassed = 0;

    loadBestScores();

    gGame.clickLocked = false;
    gGame.hintMode = false;
    gGame.hintInUse = false;

    gGame.safeArr = [false, false, false];

    gBoard = createBoard(gLevel.size,gLevel.mines);

    renderBoard(gBoard);
}

startGame(4,2);










