import React, {useState, useRef, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import './App.css';

let currStep;//let currStep = [start,start];
let steps;//let steps = 0;
let interval = 100;
const dims = 25;
const GRIDDIMENSION = '15px';
const start = Math.floor(dims / 2); // middle coord
const BLUETHEME = '#4FD3CB';
let maxSteps = 0;
let runs = 0;
let runCompleted;
// ------

const initGrid = () => {
  currStep = [start,start];
  steps = 0;
   const rows = [];
   runCompleted = false;
   for(let i = 0; i < dims; i++){
    rows.push(Array.from(Array(dims), () => 0))
  }
  return rows;
};

const App = () => {

  const [matrix, setMatrix] = useState(initGrid);

  const [isRunning, setRunning] = useState(false);

  const [pageController, setpageController] = useState(0);

  const [graphData, setgraphData] = useState({});

  const [prevRuns, setprevRuns] = useState([{'runs':runs,'steps':steps}]);

  matrix[start][start] = 1; // Start at the middle

  const runningRef = useRef();
  runningRef.current = isRunning;

  const Walk = () => {
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
      //console.log('MonteCarlo stopped');
      if(steps > maxSteps) maxSteps = steps;
      //prevRuns.push({'steps':steps,'runs':runs}); // update state
      //runs += 1;

      if(!runCompleted){
        setprevRuns([...prevRuns,{'steps':steps,'runs':runs+=1}]);
        //console.log('new val:',prevRuns);
      }
      runCompleted = true;
      setRunning(false);
    }
    else{
      //console.log('step:',stepTaken[0],stepTaken[1]);

      matrix[stepTaken[0]][stepTaken[1]] = 1; // walk

      // copies array and updates state
      let newMatrix = [];
      matrix.forEach(rows => {
        let row =[];
        rows.forEach(cols => {
          row.push(cols);
        })
        newMatrix.push(row);
      });
      setMatrix(newMatrix);

      currStep = stepTaken; // update step
      steps += 1;
    }
  }


  const runSim = () => {
    if(!runningRef.current){
      return;
    }
    Walk();

    setTimeout(runSim, interval);
  };

  const graph = () => {
    setgraphData({
      labels: prevRuns.map((x) => x.runs), //['January', 'February', 'March', 'April', 'May'], // prevRuns.runs
      datasets: [
        {
          label: 'Steps Taken',
          fill: false,
          lineTension: 0.5,
          backgroundColor: BLUETHEME,
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: prevRuns.map((x) => x.steps) //[65, 59, 80, 81, 56] // prevRuns.steps
        }
      ]
    })
  };

useEffect(() => {
  graph();
},[prevRuns]); // renders when prevRuns is updated

  return (
    <div className="App">
    <p style={{fontSize: 'calc(20px + 2vmin)', marginTop: '0px', paddingTop: '3rem'}}>
      Monte Carlo Simulator
    </p>

    <button
    style={{
      padding:'0.5rem',
      margin: '0 0 1rem 0',
      fontWeight:'bold',
      color:'white',
      borderRadius: '25px',
      backgroundColor:'green'
    }}
    onClick={() =>{
      pageController === 0 ? setpageController(1) : setpageController(0);
      //console.log('pageController: ',pageController);
    }}
    > {pageController === 0 ? 'See all runs =>' : '<= Simulator'} </button>

      <div id="GraphContainer" style={{display: pageController === 0 ? undefined : 'none'}} className="animated fadeIn">
        <RenderGrid matrix={matrix}/>
        <div style={{ padding:'0 0 2rem 0'}}>
          <div style={{padding: '1rem 0', display: steps || maxSteps ? undefined : 'none'}}>
          {steps > 0 ? 'Steps travelled: '+steps : ''} <br/>
          {maxSteps ? 'Best run: '+maxSteps : '' } <br/>
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
            >{isRunning ? 'Pause Simulation' : 'Start Simulation'}
          </button>
          <br/>
          <button
            style={{
              padding:'1rem',
              fontWeight:'bold',
              color:'white',
              borderRadius: '25px',
              backgroundColor:'red',
              display: !isRunning ? 'inline-block' : 'none'
            }}
            onClick={() => {
              setMatrix(initGrid);
              //console.log('reset everything here');
            }}
            >Reset Simulation
          </button>
        </div>
      </div>

      <div id="ChartContainer" style={{display: pageController !== 0 ? undefined : 'none'}} className="animated fadeIn">
        <Line
            data={graphData}
            options={{
              title:{
                display:true,
                text:'Runs Over Time',
                fontSize:20,
                borderColor: 'rgba(0,0,0,1)'
              },
              scales:{
                yAxes:[
                  {
                  gridLines:{
                    display: false
                  }
                }
                ],
                xAxes:[
                  {
                  gridLines:{
                    display: false
                  }
                }
                ]
              },
              legend:{
                display:true,
                position:'bottom'
              }
            }}
          />
      </div>
    </div>
  );
}

/*function Walk(matrix, setMatrix, setRunning){
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
    //console.log('MonteCarlo stopped');
    if(steps > maxSteps) maxSteps = steps;
    prevRuns.push({'steps':steps,'runs':runs});
    runs += 1;
    setRunning(false);
  }
  else{
    //console.log('step:',stepTaken[0],stepTaken[1]);

    matrix[stepTaken[0]][stepTaken[1]] = 1; // walk

    // copies array and updates state
    let newMatrix = [];
    matrix.forEach(rows => {
      let row =[];
      rows.forEach(cols => {
        row.push(cols);
      })
      newMatrix.push(row);
    });
    setMatrix(newMatrix);

    currStep = stepTaken; // update step
    steps += 1;
  }
}*/

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
