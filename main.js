 function mineOrNotFactory(minesAroundCount, isShown, isMine, isMarked){
    return {
        minesAroundCount: minesAroundCount
         , isShown: isShown
         , isMine: isMine
         , isMarked: isMarked
    }

 }

var gBoard = [
 [mineOrNotFactory(0,false,false,false),mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false)],
 [mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false)],
 [mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false),mineOrNotFactory(0,false,false,false)],
 [mineOrNotFactory(0,false,false,false), mineOrNotFactory(0,false,false,false),mineOrNotFactory(0,false,false,false),mineOrNotFactory(0,false,false,false)], 
 ]

function randomizeIndex (){
    var randomI = Math.floor((Math.random()*4));
    var randomJ = Math.floor((Math.random()*4));
    return [randomI, randomJ];
}

function randomizeMine(board){
    var notEqual = true;
    while(notEqual){
        firstMine = randomizeIndex();
        secondMine = randomizeIndex();
        for (let i = 0; i < 2; i ++){
            if(firstMine[i] != secondMine[i]){
                notEqual = false
            }
        }

    }
    board[firstMine[0]][firstMine[1]].isMine = true;
    board[secondMine[0]][secondMine[1]].isMine = true;
    
}



function renderBoard(board){
    for( let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j].isShown == true){
                if(board[i][j].isMine == true){
                    document.querySelector("#ij-"+i+j).style.backgroundColor = "red";
                } else {
                    document.querySelector("#ij-"+i+j).style.backgroundColor = "blue";
                    document.querySelector("#ij-"+i+j).textContent = board[i][j].minesAroundCount;
                }
            } else{
                if (board[i][j].isMarked){
                    document.querySelector("#ij-"+i+j).style.backgroundColor = "orange";
                } else {
                    document.querySelector("#ij-"+i+j).style.backgroundColor = "green";
                }
            }
            }
        }
    }


function setMinesNegsCount(board){
    let counter = 0;
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j <board[i].length; j++){
            if (i != 0 && i !=3 && j != 0 && j != 3){
                if (board[i][j+1].isMine){
                    counter++;
                }
                if (board[i][j-1].isMine){
                    counter++;
                }
                if (board[i-1][j].isMine){
                    counter++;
                }
                if (board[i+1][j].isMine){
                    counter++;
                }
                if (board[i+1][j+1].isMine){
                    counter++;
                }
                if(board[i-1][j-1].isMine){
                    counter++;
                }
                if (board[i+1][j-1].isMine){
                    counter++;
                }
                if(board[i-1][j+1].isMine){
                    counter++;
                }

            } else if (i == 0 && j == 0) {
                if (board[i][j+1].isMine){
                    counter++;
                }
                if (board[i+1][j+1].isMine){
                    counter++;
                }
                if (board[i+1][j].isMine){
                    counter++;         
                }
            } else if ( i == 3 && j == 3){
                if(board[i-1][j-1].isMine){
                    counter++;
                }
                if (board[i-1][j].isMine){
                    counter++;
                }
                if (board[i][j-1].isMine){
                    counter++;
                }
            } else if (i == 0 && j == 3){
                if (board[i+1][j-1].isMine){
                    counter++;
                }
                if (board[i+1][j].isMine){
                    counter++;
                }
                if (board[i][j-1].isMine){
                    counter++;
                }

            } else if (i == 3 && j == 0){
                if(board[i-1][j+1].isMine){
                    counter++;
                }
                if (board[i][j+1].isMine){
                    counter++;
                }
                if (board[i-1][j].isMine){
                    counter++;
                }
            } else if ( i == 0 && j != 0 && j != 3) {
                if (board[i][j+1].isMine){
                    counter++;
                }
                if (board[i][j-1].isMine){
                    counter++;
                }
                if (board[i+1][j].isMine){
                    counter++;
                }
                if (board[i+1][j+1].isMine){
                    counter++;
                }
                if (board[i+1][j-1].isMine){
                    counter++;
                }
                
            } else if (i == 3 && j != 0 && j != 3) {
                if (board[i][j+1].isMine){
                    counter++;
                }
                if (board[i][j-1].isMine){
                    counter++;
                }
                if (board[i-1][j].isMine){
                    counter++;
                }
                if(board[i-1][j-1].isMine){
                    counter++;
                }
                if(board[i-1][j+1].isMine){
                    counter++;
                }
            } else if (j == 0 && i != 0 && i != 3) {
                if (board[i][j+1].isMine){
                    counter++;
                }
                if (board[i-1][j].isMine){
                    counter++;
                }
                if (board[i+1][j].isMine){
                    counter++;
                }
                if (board[i+1][j+1].isMine){
                    counter++;
                }
                if(board[i-1][j+1].isMine){
                    counter++;
                }
            } else if (j == 3 && i !=0 && i != 3) {
                if (board[i][j-1].isMine){
                    counter++;
                }
                if (board[i-1][j].isMine){
                    counter++;
                }
                if (board[i+1][j].isMine){
                    counter++;
                }
                if(board[i-1][j-1].isMine){
                    counter++;
                }
                if (board[i+1][j-1].isMine){
                    counter++;
                }
            }
            board[i][j].minesAroundCount = counter;
            counter = 0;
        }
    }
}

randomizeMine(gBoard);
setMinesNegsCount(gBoard);
renderBoard(gBoard)
console.log(gBoard)

function cellClicked(event){
    var identity = event.target.id.slice(3);
    var i = Number(identity[0]);
    var j = Number(identity[1]);
    gBoard[i][j].isShown = true;
    expandShown(gBoard,i,j);
    renderBoard(gBoard);
}



document.querySelector("table").addEventListener("click",function(event){
    cellClicked(event);

})

document.querySelector("table").addEventListener("contextmenu", function(event){
    var identity = event.target.id.slice(3);
    var i = Number(identity[0]);
    var j = Number(identity[1]);
    cellMarked(i,j,gBoard);
    event.preventDefault();
    
})


function cellMarked(i,j,board){
    if (board[i][j].isMarked == true){
        board[i][j].isMarked = false

    } else {
        board[i][j].isMarked = true
    }
    renderBoard(board)
}
    
    
//document.getElementById("#ij-01").classList.add(".flag");


function expandShown(board, i, j){
    if ( board[i][j].minesAroundCount == 0 && board[i][j].isMine == false){
        if (i != 0 && i !=3 && j != 0 && j != 3){
            if (board[i][j+1].isShown == false){
                board[i][j+1].isShown = true;
            }
            if (board[i][j-1].isShown == false){
                board[i][j-1].isShown = true;
            }
            if (board[i-1][j].isShown == false){
                board[i-1][j].isShown = true;
            }
            if (board[i+1][j].isShown == false){
                board[i+1][j].isShown = true;
            }
            if (board[i+1][j+1].isShown == false){
                board[i+1][j+1].isShown =true;
            }
            if(board[i-1][j-1].isShown == false){
                board[i-1][j-1].isShown = true;
            }
            if (board[i+1][j-1].isShown == false){
                board[i+1][j-1].isShown = true;
            }
            if(board[i-1][j+1].isShown == false){
                board[i-1][j+1].isShown = true;
            }

        } else if (i == 0 && j == 0) {
            if (board[i][j+1].isShown == false){
                board[i][j+1].isShown = true;
            }
            if (board[i+1][j+1].isShown == false){
                board[i+1][j+1].isShown = true;
            }
            if (board[i+1][j].isShown == false){
                board[i+1][j].isShown = true;         
            }
        } else if ( i == 3 && j == 3){
            if(board[i-1][j-1].isShown == false){
                board[i-1][j-1].isShown = true;
            }
            if (board[i-1][j].isShown == false){
                board[i-1][j].isShown = true;
            }
            if (board[i][j-1].isShown == false){
                board[i][j-1].isShown = true;
            }
        } else if (i == 0 && j == 3){
            if (board[i+1][j-1].isShown == false){
                board[i+1][j-1].isShown = true;
            }
            if (board[i+1][j].isShown == false){
                board[i+1][j].isShown = true;
            }
            if (board[i][j-1].isShown == false){
                board[i][j-1].isShown = true;
            }

        } else if (i == 3 && j == 0){
            if(board[i-1][j+1].isShown == false){
                board[i-1][j+1].isShown = true;
            }
            if (board[i][j+1].isShown == false){
                board[i][j+1].isShown = true;
            }
            if (board[i-1][j].isShown == false){
                board[i-1][j].isShown = true;
            }
        } else if ( i == 0 && j != 0 && j != 3) {
            if (board[i][j+1].isShown == false){
                board[i][j+1].isShown = true;
            }
            if (board[i][j-1].isShown == false){
                board[i][j-1].isShown = true;
            }
            if (board[i+1][j].isShown == false){
                board[i+1][j].isShown = true;
            }
            if (board[i+1][j+1].isShown == false){
                board[i+1][j+1].isShown = true;
            }
            if (board[i+1][j-1].isShown == false){
                board[i+1][j-1].isShown = true;
            }
            
        } else if (i == 3 && j != 0 && j != 3) {
            if (board[i][j+1].isShown == false){
                board[i][j+1].isShown = true;
            }
            if (board[i][j-1].isShown == false){
                board[i][j-1].isShown = true;
            }
            if (board[i-1][j].isShown == false){
                board[i-1][j].isShown = true;
            }
            if(board[i-1][j-1].isShown == false){
                board[i-1][j-1].isShown = true;
            }
            if(board[i-1][j+1].isShown == false){
                board[i-1][j+1].isShown = true;
            }
        } else if (j == 0 && i != 0 && i != 3) {
            if (board[i][j+1].isShown == false){
                board[i][j+1].isShown = true;
            }
            if (board[i-1][j].isShown == false){
                board[i-1][j].isShown = true;
            }
            if (board[i+1][j].isShown == false){
                board[i+1][j].isShown = true;
            }
            if (board[i+1][j+1].isShown == false){
                board[i+1][j+1].isShown = true;
            }
            if(board[i-1][j+1].isShown == false){
                board[i-1][j+1].isShown = true;
            }
        } else if (j == 3 && i !=0 && i != 3) {
            if (board[i][j-1].isShown == false){
                board[i][j-1].isShown = true;
            }
            if (board[i-1][j].isShown == false){
                board[i-1][j].isShown = true;
            }
            if (board[i+1][j].isShown == false){
                board[i+1][j].isShown = true;
            }
            if(board[i-1][j-1].isShown == false){
                board[i-1][j-1].isShown = true;
            }
            if (board[i+1][j-1].isShown == false){
                board[i+1][j-1].isShown = true;
            }
        }


    }


}













 






