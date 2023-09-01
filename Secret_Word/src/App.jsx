// CSS
import './App.css'

// HOOKS
import { useCallback, useEffect, useState } from 'react'

// DATA
import { wordsList } from './data/words'

// COMPONENTS
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [ 
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessedQty = 3;



function App() {
  const [gameStage, SetGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setletters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessedQty);
  const [score, setScore] = useState(0);
  

  const pickWordAndCategory = useCallback(() => {
    // pegar um categoria aleatoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //console.log(category);

    //pegar uma palavra aleatoria
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    //console.log(word);

    return {word, category}
  },[words]);

  // começa a o jogo
  const startGame = useCallback(() => {
    //Limpar todas as letras
    clearLetterStates();

    // pegar a palavra e a categoria
    const {word, category} = pickWordAndCategory();
    
    // crie um array para as palavras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    //console.log(word, category);
    //console.log(wordLetters);

    // filtrar os estados
    setPickedWord(word)
    setpickedCategory(category)
    setletters(wordLetters)


    SetGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // processa o input das letras
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // cheque se a letra ja foi utilizada
    if(
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
      ) { 
        return;
      };

      //envia o letra advinhada  ou remova a letra avivinhada 
      if(letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter,
        ])
      } else {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ]);

        setGuesses((actualGuesses) => actualGuesses - 1);
      }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
    
  }


// cheque se os palpites encerraram 
  useEffect(() => {
    if(guesses <= 0) {
      //reset todos os states
      clearLetterStates();

      SetGameStage(stages[2].name);
    }
  }, [guesses]);

  //cheque se o jogador venceu
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)]

    //condicição de vitoria
    if(guessedLetters.length === uniqueLetters.length){
      
      setScore((actualScore) => actualScore += 100)

      //Reiniciar o jogo com uma nova palavra
      startGame();

    }
  }, [guessedLetters, letters, startGame])

  // reinicia o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessedQty);

    SetGameStage(stages[0].name)
  }


  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && (<Game 
            verifyLetter={verifyLetter} 
            pickedWord={pickedWord} 
            pickedCategory={pickedCategory} 
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />
        )}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App
