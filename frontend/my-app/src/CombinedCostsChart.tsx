import React, { useContext, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';
import { useCostsContext } from './CostsContext';
import { TitleFormData } from './TitleClosingCosts';
import { LegalFormData } from './LegalClosingCosts';

type CombinedFormData = TitleFormData & LegalFormData;

// export interface CombinedFormData {
//     ownerPolicyPremium: number;
//     endorsementPackage: number;
//     titleSearch: number;
//     loanPolicy: number;
//     documentPreparation: number;
//     recordingFees: number;
//     closingFee: number;
//     taxSearch: number;
//     contingency: number;
//     legalFees: number;
//     transferTax: number;
//     mortgageRecordingTax: number;
//     esaAndPca: number;
//     zoningReport: number;
//     appraisal: number;
//     dueDiligenceExpenses: number;
//     leaseReview: number;
//     survey: number;
//     travel: number;
//     misc: number;
//   }

const CombinedCostsChart: React.FC = () => {
  const { titleCostData, legalCostData } = useCostsContext();
//   const [combinedData, setCombinedData] = useState<CombinedFormData>({
//     ownerPolicyPremium: 0,
//     endorsementPackage: 0,
//     titleSearch: 0,
//     loanPolicy: 0,
//     documentPreparation: 0,
//     recordingFees: 0,
//     closingFee: 0,
//     taxSearch: 0,
//     contingency: 0,
//     legalFees: 0,
//     transferTax: 0,
//     mortgageRecordingTax: 0,
//     esaAndPca: 0,
//     zoningReport: 0,
//     appraisal: 0,
//     dueDiligenceExpenses: 0,
//     leaseReview: 0,
//     survey: 0,
//     travel: 0,
//     misc: 0
//   });
//   const combinedFormData = titleCostData 
  const backgroundColors = [
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
  ];
  
  const combinedFormData = {...titleCostData, ...legalCostData};
//   console.log("combined form - ", combinedFormData);

  const totalCosts = Object.values(combinedFormData).reduce((partialSum, a) => partialSum + a, 0)

  const chartLabels = Object.keys(titleCostData).concat(Object.keys(legalCostData))

  const [chartData, setChartData] = useState<any>({
    labels: chartLabels,
    datasets: [
      {
        data: Object.values(combinedFormData),
        backgroundColor: backgroundColors
      },
    ],
  });

  useEffect(() => {
    // Combine data from context and set it to combinedData state

    const timer = setTimeout(() => {
        setChartData({
            labels: chartLabels,
            datasets: [
              {
                data: Object.values(combinedFormData),
                backgroundColor: backgroundColors
              },
            ],
          });
      }, 500);
  
      // Cleanup the timer on component unmount or when value changes
      return () => clearTimeout(timer);

    
  }, [combinedFormData]); // Update whenever labels or values change


  return (
    <div>
      <h2>Total Closing Costs</h2>
        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#ffa07a', color: '#ffffff' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Total Closing Costs:</label>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{Math.round(totalCosts*100)/100}</span>
        </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ width: '300px', height: '300px' }}>
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

export default CombinedCostsChart;