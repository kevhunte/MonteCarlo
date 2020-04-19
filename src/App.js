import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const dims = 15;
  let matrix = [];
  for(let i = 0; i < dims; i++){
    let row = [];
    for(let j = 0; j < dims; j++){
      row.push('x'); // Do Monte Carlo on these vals. Class will update
    }
    matrix.push(row);
  }

  return (
    <div className="App">
    <p style={{fontSize: 'calc(20px + 2vmin)', marginTop: '0px', paddingTop: '3rem'}}>
      Monte Carlo Simulator
    </p>
    <div id="GraphContainer" className="">

    <Grid matrix={matrix}/>

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

function Grid(props){
  const matrix = props.matrix;
  // show nothing for 0, blue spot for 1.
  //Controlled by 'cell' className
  return (
    matrix.map((row,indexi) => (
        <div key={indexi} className="rowContainer">
          {row.map((col,indexj) => (
            <div key={indexj} className={col === 1 ? "walked" : ""}>{col}</div>
          ))}
        </div>
    ))
  );
}

export default App;
