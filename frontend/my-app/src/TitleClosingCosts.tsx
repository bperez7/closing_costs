import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import { ChartOptions } from 'chart.js/auto';
import { useCostsContext } from './CostsContext';


Chart.register(ArcElement);

export interface TitleFormData {
  ownerPolicyPremium: number;
  endorsementPackage: number;
  titleSearch: number;
  loanPolicy: number;
  documentPreparation: number;
  recordingFees: number;
  closingFee: number;
  taxSearch: number;
  contingency: number;
}

interface ApiResponse {
  totalTitleCosts: number;
}



function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function(...args: any) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const TitleCostsCalculator: React.FC = () => {
  const [formData, setFormData] = useState<TitleFormData>({
    ownerPolicyPremium: 0,
    endorsementPackage: 0,
    titleSearch: 0,
    loanPolicy: 0,
    documentPreparation: 0,
    recordingFees: 0,
    closingFee: 0,
    taxSearch: 0,
    contingency: 0,
  });
  const [totalTitleCosts, setTotalTitleCosts] = useState<number | null>(null);
  const { setTitleCostData } = useCostsContext();


  const [chartData, setChartData] = useState<any>({
    labels: Object.keys(formData),
    datasets: [
      {
        data: Object.values(formData).map((value) => parseFloat(value)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(51, 204, 51, 0.6)',
          'rgba(255, 102, 0, 0.6)',
          'rgba(102, 102, 102, 0.6)',
          'rgba(0, 128, 128, 0.6)',
        ],
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Assuming you have an API endpoint to make a POST request
    const apiUrl = 'http://localhost:8080/calculate-title-costs';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        setTotalTitleCosts(result.totalTitleCosts);
      } else {
        console.error('API request failed');
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  const sendAPIRequest = async (data: FormData) => {
    // Simulate an API request
    console.log('Sending request with data:', data);
    // Replace with your actual API request code
    const response = await fetch('http://localhost:8080/calculate-title-costs', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    const result = await response.json();
    setTotalTitleCosts(result?.totalTitleCosts);
  };
  const debouncedSendRequest = useCallback(debounce(sendAPIRequest, 500), []);
  // const debouncedSetTitleCostData = useCallback(setTitleCostData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleCostData(formData);
    }, 500);

    // Cleanup the timer on component unmount or when value changes
    return () => clearTimeout(timer);
  }, [formData]); // Only re-run the effect if value changes
  useEffect(() => {
    // Call the debounced version of your API request function here
    debouncedSendRequest(formData);
    // setTitleCostData(formData);
    // setCostsData(Object.keys(formData), Object.values(formData).map((value) => parseFloat(value)));

    setChartData({
      labels: Object.keys(formData),
      datasets: [
        {
          data: Object.values(formData).map((value) => parseFloat(value)),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(51, 204, 51, 0.6)',
            'rgba(255, 102, 0, 0.6)',
            'rgba(102, 102, 102, 0.6)',
            'rgba(0, 128, 128, 0.6)',
          ],
        },
      ],
    });
  }, [formData, debouncedSendRequest]);
  const containerStyle = {
    border: '1px solid #ccc',
    borderRadius: '12px', // Rounded border for the container
    overflow: 'hidden', // Hide overflowing content
  };

  const tableStyle: CSSProperties = {
    // border: '4px solid #ccc', // Border color
    background: 'lightblue',
    // borderRadius: '12px', // Rounded border
    borderCollapse: 'collapse',
    width: '100%',
    // marginBottom: '20px',
    marginBottom: '0', // Set margin to zero

  };

  const cellStyle: CSSProperties = {
    padding: '12px',
    border: '1px solid #ddd',
  };

  const doughnutOptions: any = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: 'black',
          fontSize: 12,
        },
      },
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const total = dataset.data.reduce((previousValue: any, currentValue: any) => previousValue + currentValue);
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = Math.round((currentValue / total) * 100);
          return `${data.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
        },
      },
    },
  };
  
  const options: ChartOptions = {
    // plugins: {
    //   // legend: {
    //   //   display: true,
    //   //   position: 'right',
    //     // labels: {
    //     //   fontColor: 'black',
    //     //   fontSize: 12,
    //     // },
    //   },
    // },
    responsive: true,
    maintainAspectRatio: false,
    // cutout: '70%', // Adjust the cutout as per your design
  };


  return (
    <div>
      <h2>Title Costs Calculator</h2>
      <form onSubmit={handleSubmit}>
      <div style={containerStyle}>

        <table style={tableStyle}>
          <tbody>
            {Object.entries(formData).map(([key, value]) => (
              <tr key={key}>
                <td style={cellStyle}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</td>
                <td style={cellStyle}>
                  <input
                    type="number"
                    value={parseFloat(value).toString()}
                    onChange={(e) =>{
                      console.log('form data - update', formData);
                      setFormData({ ...formData, [key]: +e.target.value })
                      }
                    }
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalTitleCosts !== null && (
        <div style={{ 
          border: '1px solid #ccc', 
        // borderRadius: '5px',
         padding: '10px', backgroundColor: '#ffa07a', color: '#ffffff' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Total Title Costs:</label>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{Math.round(totalTitleCosts * 100) / 100}</span>
        </div>
      
        
      )}
      </div>

        {/* <button type="submit" style={{margin: '10px 0', padding: '10px 20px'}}>Submit</button> */}
      </form>

      

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ width: '200px', height: '200px' }}>
          <Doughnut data={chartData} />
        </div>        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
          {chartData.labels.map((label: string, index: number) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                  marginRight: '5px',
                }}
              />
              <span style={{ fontSize: '12px' }}>{label}</span>
              <span style={{ marginLeft: '5px', fontSize: '10px' }}>
                ({((chartData.datasets[0].data[index] / chartData.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0)) * 100).toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* // options = {options} */}


      
    </div>
  );
};

export default TitleCostsCalculator;
