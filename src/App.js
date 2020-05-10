import React, {useState, useCallback, useRef} from 'react';
import logo from './logo.svg';
import './App.css';

//let matrix = [];
const dims = 21;
const start = Math.floor(dims / 2); // middle coord
let currStep = [start,start];
let interval = 100;
const BLUETHEME = '#4FD3CB';

const App = () => {
  //let timer = null;
   const [matrix, setMatrix] = useState(() => {
     const rows = [];
     for(let i = 0; i < dims; i++){
      rows.push(Array.from(Array(dims), () => 0))
    }
    return rows;
  });

  const [isRunning, setRunning] = useState(false);
  matrix[start][start] = 1; // Start at the middle

  const runningRef = useRef();
  runningRef.current = isRunning;

  const runSim = useCallback(() => {
    if(!runningRef.current){
      return;
    }
    Walk(matrix, setMatrix);

    setTimeout(runSim, interval);
  },[]);

  return (
    <div className="App">
    <p style={{fontSize: 'calc(20px + 2vmin)', marginTop: '0px', paddingTop: '3rem'}}>
      Monte Carlo Simulator
    </p>

    <div id="GraphContainer">
      <RenderGrid matrix={matrix}/>
    </div>
    <button
    style={{
      padding:'1rem',
      fontWeight:'bold',
      color:'white',
      borderRadius: '25px',
      backgroundColor:BLUETHEME
    }}
    onClick={() => {
      setRunning(!isRunning);
      runningRef.current = true;
      runSim();
    }}
    >{isRunning ? 'Stop Simulation' : 'Start Simulation'}</button>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function Walk(matrix, setMatrix){
  //console.log('walking');
  let possibleSteps = [];
  if(currStep[0] + 1 < dims && !matrix[currStep[0]+1][currStep[1]]){ // can go down
    possibleSteps.push([currStep[0]+1,currStep[1]]);
  }
  if(currStep[0] - 1 >= 0 && !matrix[currStep[0]-1][currStep[1]]){ // can go up
    possibleSteps.push([currStep[0]-1,currStep[1]]);
  }
  if(currStep[1] + 1 < dims && !matrix[currStep[0]][currStep[1]+1]){ // can go right
    possibleSteps.push([currStep[0],currStep[1]+1]);
  }
  if(currStep[1] - 1 >= 0 && !matrix[currStep[0]][currStep[1]-1]){ // can go left
    possibleSteps.push([currStep[0],currStep[1]-1]);
  }

  if(!possibleSteps.length){ // nowhere to walk, should stop sim
    console.log('cleared');
  }
  let pick = Math.floor(Math.random() * possibleSteps.length);
  //console.log(possibleSteps, pick);
  let stepTaken = possibleSteps.splice(pick, 1)[0]; // randomly pick
  console.log('step:',stepTaken[0],stepTaken[1]);

  matrix[stepTaken[0]][stepTaken[1]] = 1; // walk

  // copies array and updates state
  let newMatrix = [];
  matrix.map(rows => {
    let row =[];
    rows.map(cols => {
      row.push(cols);
    })
    newMatrix.push(row);
  });
  setMatrix(newMatrix);

  currStep = stepTaken; // update step
}

function RenderGrid(props){
  const matrix = props.matrix;
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: 'repeat('+dims+', '+25+'px'+')',
      justifyContent: 'center'
    }}>
      {matrix.map((rows,i) =>
        rows.map((col,j) =>
          <div
          key={i+'-'+j}
          style={{
            width:'25px',
            height:'25px',
            backgroundColor: matrix[i][j] ? BLUETHEME : undefined,
            border:'solid 1px '+BLUETHEME
          }}
          />
        ))}
    </div>
  );
}

export default App;
