import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const dims = 15;
  const start = Math.floor(dims / 2); // middle coord
  let matrix = [];
  for(let i = 0; i < dims; i++){
    let row = [];
    for(let j = 0; j < dims; j++){
      //row.push(Math.floor(Math.random()*2)); // Put all 0s when ready. Do Monte Carlo on these vals
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
    <div id="GraphContainer">
      <RenderGrid matrix={matrix}/>
    </div>
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

// TODO: Make Monte Carlo func and call RenderGrid in loop to force refresh after update. Remove from App

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
