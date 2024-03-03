import React from 'react';
import logo from './logo.svg';
import './App.css';
import TitleCostsCalculator from './TitleClosingCosts';
import LegalCostsCalculator from './LegalClosingCosts';
import { CostsProvider } from './CostsContext';
import CombinedCostChart from "./CombinedCostsChart";
// import CombinedCostsChart from './CombinedCostsChart';
// const App: React.FC = () => {
  
// };
function App() {
  return (
    <CostsProvider>
    <div style={{ display: 'flex', margin: '20px', fontSize: '14px' }}>
      <div style={{ marginRight: '20px' }}>
         <TitleCostsCalculator />
      </div>
      <div style={{ marginRight: '20px' }}>
          <LegalCostsCalculator />
      </div>
        <CombinedCostChart />
    </div>

    </CostsProvider>
  );
  // <div style={{ display: 'flex' }}>
  //     <TitleCostsCalculator />
  //     <LegalCostsCalculator />
  //   </div>
  // return <TitleCostsCalculator></TitleCostsCalculator>

  // return  (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
