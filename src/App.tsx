import { useEffect, useState } from 'react';
import './game.css';

function random_hex_color_code() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);

  return '#' + n.slice(0, 6);
}

function selectRandomOption({ options }: { options: string[] }) {
  const option = Math.floor(Math.random() * options.length);

  return options[option];
}

function App() {
  const [ammountsOfTimeWon, setAmmountsOfTimeWon] = useState(
    localStorage.getItem('wonCount')
  );
  const [options, setOptions] = useState<string[] | undefined>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctOption, setCorrectOption] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [selectedIncorrectOption, setSelectedIncorrectOption] = useState(false);

  function handleGameStart() {
    setGameStarted(true);
    setOptions([
      random_hex_color_code(),
      random_hex_color_code(),
      random_hex_color_code(),
    ]);
    setGameWon(false);
  }

  function handleEndGame() {
    setGameStarted(false);
    setOptions(undefined);
    setCorrectOption('');
    setSelectedIncorrectOption(false);
  }

  useEffect(() => {
    if (options) {
      setCorrectOption(selectRandomOption({ options }));
    }
  }, [options]);

  useEffect(() => {
    if (gameWon) {
      handleGameStart();
      setSelectedIncorrectOption(false);
      setAmmountsOfTimeWon((prevAmmountsOfTimeWon) => {
        if (prevAmmountsOfTimeWon) {
          return (parseInt(prevAmmountsOfTimeWon) + 1).toString();
        }
        return '1';
      });
      localStorage.setItem(
        'wonCount',
        localStorage.getItem('wonCount')
          ? (parseInt(localStorage.getItem('wonCount')!) + 1).toString()
          : '1'
      );
    }
  }, [gameWon]);

  return (
    <div className='app'>
      {ammountsOfTimeWon && <div>{`You won ${ammountsOfTimeWon} times`}</div>}
      <button
        className='button'
        onClick={gameStarted ? handleEndGame : handleGameStart}
      >
        {gameStarted ? 'End Game' : 'Start Playing'}
      </button>
      <div
        className='color-box'
        style={{ backgroundColor: correctOption }}
      ></div>
      {gameStarted && options && (
        <div className='button-container'>
          {options.map((option) => (
            <button
              className='button'
              key={option}
              onClick={() => {
                if (option === correctOption) {
                  return setGameWon(true);
                }
                return setSelectedIncorrectOption(true);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {selectedIncorrectOption && (
        <div className='incorrect'>Wrong Option!</div>
      )}
    </div>
  );
}

export default App;
