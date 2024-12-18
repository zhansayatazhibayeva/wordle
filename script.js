const scoreboardLetters=document.querySelectorAll('.scoreboard-letter');

const wordURL = "https://words.dev-apis.com/word-of-the-day";
let wordX = "";
async function wordOfTheDay(){
    const promise = await fetch(wordURL);
    const processedResponce = await promise.json();
    const wordXX = processedResponce.word;
    wordX = wordXX;
    console.log(wordX);
}

wordOfTheDay();

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

let curWord = [];
let curRow = 0;

const validateURL = "https://words.dev-apis.com/validate-word";

async function validateWord(word) {
    try {
        const response = await fetch(validateURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word })
        });
        const result = await response.json();
        return result.validWord; 
    } catch (error) {
        console.error("Error validating word:", error);
        return false;
    }
}


let gameOver=false;
const maxRows=6;
document.addEventListener('keydown',async (event) => {
    if(gameOver){
        return;
    }
    if(isLetter(event.key) && curWord.length<5 ){
        curWord.push(event.key.toUpperCase());
        const currentIndex = curRow*5 + curWord.length - 1;
        scoreboardLetters[currentIndex].textContent = event.key.toUpperCase();
        
    }
    else if(isLetter(event.key) && curWord.length === 5){
        curWord.pop();
        curWord.push(event.key.toUpperCase());
        const currentIndex = curRow*5 + curWord.length - 1;
        scoreboardLetters[currentIndex].textContent = event.key.toUpperCase();
    }
    else if (event.key === 'Backspace' && curWord.length > 0) {
        const letterIndex = curRow * 5 + curWord.length - 1;
        scoreboardLetters[letterIndex].textContent = '';
        curWord.pop();
    }
    else if(event.key === 'Enter' && curWord.length===5){
        
        const guessedWord = curWord.join('');
        const isValid = await validateWord(guessedWord.toLowerCase());
        if (!isValid) {
            for(let i=0;i<5;i++){
                const letterIndex = curRow*5 + i;
                scoreboardLetters[letterIndex].classList.add('invalid');
            }
            return;
        }
        curRow++;       
        let str = curWord.join('');
        if (str === wordX.toUpperCase()) {
            gameOver = true;
            for(let i=0;i<5;i++){
                const letterIndex = (curRow-1)*5 + i;
                scoreboardLetters[letterIndex].style.backgroundColor = '#2E8B57';
                scoreboardLetters[letterIndex].style.border = '5px solid #D3D3D3';
            }
            alert('You win! 🎉');
            return;
        } 
        if (curRow >= maxRows) {
            
            gameOver = true;
            alert(`Game over! The correct word was: ${wordX.toUpperCase()}`);
            return;
        }

        curWord = [];

        const wordArray = wordX.toUpperCase().split('');
        const guessArray = str.split('');

        for(let i=0;i<=4;i++){
            const letterIndex = (curRow-1)*5 + (i);
            if(wordArray[i] === guessArray[i]){
                scoreboardLetters[letterIndex].style.backgroundColor = '#2E8B57';
                scoreboardLetters[letterIndex].style.border = '5px solid #D3D3D3';

                wordArray[i] = null; 
                guessArray[i] = null;
            }
            scoreboardLetters[letterIndex].style.color = 'white';
        }
        for(let i=0;i<5;i++){
            const letterIndex = (curRow-1)*5 + (i);
            if(guessArray[i] && wordArray.includes(guessArray[i])){
                scoreboardLetters[letterIndex].style.backgroundColor = '#FFE4B5';
                scoreboardLetters[letterIndex].style.border = '5px solid #D3D3D3';
                wordArray[wordArray.indexOf(guessArray[i])] = null;
            }
            else if(guessArray[i]){
                scoreboardLetters[letterIndex].style.backgroundColor = '#A9A9A9';
                scoreboardLetters[letterIndex].style.border = '5px solid #D3D3D3';
            }
        }
    }
}); 