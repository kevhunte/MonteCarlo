import React from 'react';
import logo from './logo.svg';
import './App.css';

let matrix = [];
const dims = 15;
const start = Math.floor(dims / 2); // middle coord
let currStep = [start,start];

function App() {
  //let matrix = [];
  for(let i = 0; i < dims; i++){
    let row = [];
    for(let j = 0; j < dims; j++){
      row.push(0);
    }
    matrix.push(row);
  }
  matrix[start][start] = 1; // Start at the middle

  return (
    <div className="App">
    <p style={{fontSize: 'calc(20px + 2vmin)', marginTop: '0px', paddingTop: '3rem'}}>
      Monte Carlo Simulator
    </p>
    <MonteCarlo />
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

// set interval with Monte Carlo here

function MonteCarlo(){
  // check steps allowed: up left down right if inside of dims matrix
  // pick from steps at random, and set equal to 1. Set 'start' to this coordinate
  // if steps options are empty, then there are no steps. Stop by clearing timer, and set flag to false. triggers distance from middle

 // set timer to call and end itself?
 let possibleSteps = [];
 if(currStep[0] + 1 < dims){ // can go down
   possibleSteps.push([currStep[0]+1,currStep[1]]);
 }
 if(currStep[0] - 1 >= 0){ // can go up
   possibleSteps.push([currStep[0]-1,currStep[1]]);
 }
 if(currStep[1] + 1 < dims){ // can go right
   possibleSteps.push([currStep[0],currStep[1]+1]);
 }
 if(currStep[1] - 1 >= 0){ // can go left
   possibleSteps.push([currStep[0],currStep[1]-1]);
 }

 if(!possibleSteps){ // nowhere to walk, quit;
   // clear interval
 }
 let pick = Math.floor(Math.random() * possibleSteps.length);
 //console.log(possibleSteps, pick);
 let stepTaken = possibleSteps.splice(pick, 1)[0]; // randomly pick
 //console.log('step:',stepTaken[0]);
 matrix[stepTaken[0]][stepTaken[1]] = 1; // walk
 currStep = stepTaken; // update step

  /*Forces re-render below*/
  return(
    <div id="GraphContainer">
      <RenderGrid matrix={matrix}/>
    </div>
  );
}

function RenderGrid(props){
  const matrix = props.matrix;
  return (
    matrix.map((row,indexi) => (
        <div key={indexi} className="rowContainer">
          {row.map((col,indexj) => (
            <div key={indexj} className={col === 1 ? "cell walked" : "cell notWalked"}>{col}</div>
          ))}
        </div>
    ))
  );
}

export default App;
