import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useCostsContext } from './CostsContext';

// Define the structure of your form data
export interface LegalFormData {
  legalFees: number;
  transferTax: number;
  mortgageRecordingTax: number;
  esaAndPca: number;
  zoningReport: number;
  appraisal: number;
  dueDiligenceExpenses: number;
  leaseReview: number;
  survey: number;
  travel: number;
  misc: number;
}

// Define the expected structure of the API response
interface ApiResponse {
  totalLegalCosts: number;
}

function debounce(fn: Function, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return function(...args: any) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
}

const LegalCostsCalculator: React.FC = () => {
  const [formData, setFormData] = useState<LegalFormData>({
    legalFees: 0,
    transferTax: 0,
    mortgageRecordingTax: 0,
    esaAndPca: 0,
    zoningReport: 0,
    appraisal: 0,
    dueDiligenceExpenses: 0,
    leaseReview: 0,
    survey: 0,
    travel: 0,
    misc: 0,
  });
  const [totalLegalCosts, setTotalLegalCosts] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any>({
    labels: Object.keys(formData),
    datasets: [
      {
        data: Object.values(formData).map((value) => parseFloat(value)),
        backgroundColor: [
            'rgba(0, 128, 128, 0.6)',
            'rgba(255, 0, 0, 0.6)',
            'rgba(0, 255, 0, 0.6)',
            'rgba(0, 0, 255, 0.6)',
            'rgba(128, 0, 128, 0.6)',
            'rgba(255, 255, 0, 0.6)',
            'rgba(0, 255, 255, 0.6)',
            'rgba(255, 0, 255, 0.6)',
            'rgba(128, 128, 0, 0.6)',
            'rgba(0, 128, 0, 0.6)',
            'rgba(128, 0, 0, 0.6)',
        ],
      },
    ],
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your actual API URL
    const apiUrl = 'https://example.com/api/calculateLegalCosts';

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
        setTotalLegalCosts(result.totalLegalCosts);
      } else {
        console.error('API request failed');
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };
  const { setLegalCostData } = useCostsContext();


  const sendAPIRequest = async (data: FormData) => {
    // Simulate an API request
    console.log('Sending request with data:', data);
    // Replace with your actual API request code
    const response = await fetch('http://localhost:8080/calculate-legal-costs', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    const result = await response.json();
    setTotalLegalCosts(result?.totalLegalCosts);
  };
  const debouncedSendRequest = useCallback(debounce(sendAPIRequest, 500), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLegalCostData(formData);
    }, 500);

    // Cleanup the timer on component unmount or when value changes
    return () => clearTimeout(timer);
  }, [formData]); // Only re-run the effect if value changes
  useEffect(() => {
    // Call the debounced version of your API request function here
    debouncedSendRequest(formData);

    // setLegalCostData(formData);
    setChartData({
      labels: Object.keys(formData),
      datasets: [
        {
          data: Object.values(formData).map((value) => parseFloat(value)),
          backgroundColor: [
            'rgba(0, 128, 128, 0.6)',
            'rgba(255, 0, 0, 0.6)',
            'rgba(0, 255, 0, 0.6)',
            'rgba(0, 0, 255, 0.6)',
            'rgba(128, 0, 128, 0.6)',
            'rgba(255, 255, 0, 0.6)',
            'rgba(0, 255, 255, 0.6)',
            'rgba(255, 0, 255, 0.6)',
            'rgba(128, 128, 0, 0.6)',
            'rgba(0, 128, 0, 0.6)',
            'rgba(128, 0, 0, 0.6)',
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
    background: 'lightblue',
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '0',
  };

  const cellStyle: CSSProperties = {
    padding: '8px',
    border: '1px solid #ddd',
  };

  

  return (
    <div>
      <h2>Legal Costs Calculator</h2>
      <form onSubmit={handleSubmit}>
       <div style={containerStyle}>
        <table style={tableStyle}>
          <tbody>
            {Object.entries(formData).map(([key, value]) => (
              <tr key={key}>
                <td style={cellStyle}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).replace('Esa And Pca', 'ESA and PCA')}:</td>
                <td style={cellStyle}>
                  <input
                    type="number"
                    value={parseFloat(value).toString()}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: +e.target.value })
                    }
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          {totalLegalCosts !== null && (
          <div style={{ border: '1px solid #ccc', 
        //   borderRadius: '5px',
          padding: '10px', backgroundColor: '#ffa07a', color: '#ffffff' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Total Legal Costs:</label>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{Math.round(totalLegalCosts*100)/100}</span>
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
    </div>
  );
};

export default LegalCostsCalculator;
