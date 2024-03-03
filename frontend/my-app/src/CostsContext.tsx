import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TitleFormData } from './TitleClosingCosts';
import { LegalFormData } from './LegalClosingCosts';
import { Title } from 'chart.js/dist';

interface CostsContextProps {
  titleCostData: TitleFormData
  legalCostData: LegalFormData
  setTitleCostData: (titleCostData: TitleFormData) => void;
  setLegalCostData: (legalCostData: LegalFormData) => void;
}

const CostsContext = createContext<CostsContextProps | undefined>(undefined);

interface CostsProviderProps {
  children: ReactNode;
}

export const CostsProvider: React.FC<CostsProviderProps> = ({ children }) => {
    
  const [titleCostData, setTitleCostData] = useState<TitleFormData>(
    {  
        ownerPolicyPremium: 0,
        endorsementPackage: 0,
        titleSearch: 0,
        loanPolicy: 0,
        documentPreparation: 0,
        recordingFees: 0,
        closingFee: 0,
        taxSearch: 0,
        contingency: 0
        
    }
  )
  const [legalCostData, setLegalCostData] = useState<LegalFormData>(
    {  
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
        misc: 0
        
    }
  )


  const contextValue: CostsContextProps = {
    titleCostData: titleCostData,
    legalCostData: legalCostData,
    setTitleCostData: (titleCostData: TitleFormData) => setTitleCostData(titleCostData),
    setLegalCostData: (legalCostData: LegalFormData) => setLegalCostData(legalCostData),

    // setCostsData: () => setCostsData({titleFormData: titleFormData, legalFormData}),
  };

  return <CostsContext.Provider value={contextValue}>{children}</CostsContext.Provider>;
};

export const useCostsContext = () => {
  const context = useContext(CostsContext);
  if (!context) {
    throw new Error('useCostsContext must be used within a CostsProvider');
  }
  return context;
};
