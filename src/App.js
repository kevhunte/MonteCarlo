import React, {useState, useCallback, useRef} from 'react';
//import logo from './logo.svg';
import './App.css';

const dims = 41;
const GRIDDIMENSION = '15px';
const start = Math.floor(dims / 2); // middle coord
let currStep = [start,start];
let steps = 0;
let interval = 100;
const BLUETHEME = '#4FD3CB';

const initGrid = () => {
   const rows = [];
   for(let i = 0; i < dims; i++){
    rows.push(Array.from(Array(dims), () => 0))
  }
  return rows;
};

const App = () => {
  //let timer = null;
  const [matrix, setMatrix] = useState(initGrid);

  const [isRunning, setRunning] = useState(false);
  matrix[start][start] = 1; // Start at the middle

  const runningRef = useRef();
  runningRef.current = isRunning;

  const runSim = useCallback(() => {
    if(!runningRef.current){
      return;
    }
    Walk(matrix, setMatrix, setRunning);

    setTimeout(runSim, interval);
  });

  return (
    <div className="App">
    <p style={{fontSize: 'calc(20px + 2vmin)', marginTop: '0px', paddingTop: '3rem'}}>
      Monte Carlo Simulator
    </p>

    <div id="GraphContainer">
      <RenderGrid matrix={matrix}/>
    </div>
    <div style={{
      padding:'0 0 2rem 0'
    }}>
    {steps > 0 ? 'Steps travelled: '+steps : ''} <br/>
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
        >{isRunning ? 'Pause Simulation' : 'Start Simulation'}
      </button>
    </div>
    </div>
  );
}

function Walk(matrix, setMatrix, setRunning){
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

  let pick = Math.floor(Math.random() * possibleSteps.length);
  //console.log(possibleSteps, pick);
  let stepTaken = possibleSteps.splice(pick, 1)[0]; // randomly pick

  if(!stepTaken){ // nowhere to walk, should stop sim
    console.log('MonteCarlo stopped');
    setRunning(false);
  }
  else{
    //console.log('step:',stepTaken[0],stepTaken[1]);

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
    steps += 1;
  }
}

function RenderGrid(props){
  const matrix = props.matrix;
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: 'repeat('+dims+', '+GRIDDIMENSION+')',
      justifyContent: 'center'
    }}>
      {matrix.map((rows,i) =>
        rows.map((col,j) =>
          <div
          key={i+'-'+j}
          style={{
            width:GRIDDIMENSION,
            height:GRIDDIMENSION,
            backgroundColor: matrix[i][j] ? BLUETHEME : undefined,
            border:'solid 1px '+BLUETHEME
          }}
          />
        ))}
    </div>
  );
}

export default App;
