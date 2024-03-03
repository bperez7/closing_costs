package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Define a struct to parse the input JSON
type TitleCostInput struct {
	OwnerPolicyPremium  float64 `json:"ownerPolicyPremium"`
	EndorsementPackage  float64 `json:"endorsementPackage"`
	TitleSearch         float64 `json:"titleSearch"`
	LoanPolicy          float64 `json:"loanPolicy"`
	DocumentPreparation float64 `json:"documentPreparation"`
	RecordingFees       float64 `json:"recordingFees"`
	ClosingFee          float64 `json:"closingFee"`
	TaxSearch           float64 `json:"taxSearch"`
	Contingency         float64 `json:"contingency"`
}

// Define a struct for your output JSON
type TitleCostOutput struct {
	TotalTitleCosts float64 `json:"totalTitleCosts"`
}

func calculateTotalCosts(input *TitleCostInput) float64 {
	// Sum up all the costs
	total := input.OwnerPolicyPremium +
		input.EndorsementPackage +
		input.TitleSearch +
		input.LoanPolicy +
		input.DocumentPreparation +
		input.RecordingFees +
		input.ClosingFee +
		input.TaxSearch +
		input.Contingency

	return total
}

func titleCostCalculatorHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var input TitleCostInput
	// Decode the JSON body into the struct
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Print(input)
	// Calculate the total title costs
	totalCosts := calculateTotalCosts(&input)

	// Prepare the output
	output := TitleCostOutput{
		TotalTitleCosts: totalCosts,
	}

	// Respond with the total cost
	w.Header().Set("Content-Type", "application/json")
	//Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")

	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	// return "OKOK"
	json.NewEncoder(w).Encode(output)
}

// Define a struct for the new input JSON
type LegalCostInput struct {
	LegalFees            float64 `json:"legalFees"`
	TransferTax          float64 `json:"transferTax"`
	MortgageRecordingTax float64 `json:"mortgageRecordingTax"`
	EsaAndPca            float64 `json:"esaAndPca"`
	ZoningReport         float64 `json:"zoningReport"`
	Appraisal            float64 `json:"appraisal"`
	DueDiligenceExpenses float64 `json:"dueDiligenceExpenses"`
	LeaseReview          float64 `json:"leaseReview"`
	Survey               float64 `json:"survey"`
	Travel               float64 `json:"travel"`
	Misc                 float64 `json:"misc"`
}

// Define a struct for the new output JSON
type LegalCostOutput struct {
	TotalLegalCosts float64 `json:"totalLegalCosts"`
}

func calculateTotalLegalCosts(input *LegalCostInput) float64 {
	// Sum up all the expenses
	total := input.LegalFees +
		input.TransferTax +
		input.MortgageRecordingTax +
		input.EsaAndPca +
		input.ZoningReport +
		input.Appraisal +
		input.DueDiligenceExpenses +
		input.LeaseReview +
		input.Survey +
		input.Travel +
		input.Misc

	return total
}

func legalCostCalculatorHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var input LegalCostInput
	// Decode the JSON body into the struct
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Calculate the total expenses
	totalExpenses := calculateTotalLegalCosts(&input)

	// Prepare the output
	output := LegalCostOutput{
		TotalLegalCosts: totalExpenses,
	}

	// Respond with the total expenses
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(output)
}

// CORS Middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Check if the request is for CORS options
		if r.Method == "OPTIONS" {
			// Just return with the headers, don't pass down the middleware chain
			return
		}

		// Next
		next.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()
	// Apply the CORS middleware to all routes
	r.Use(enableCORS)

	r.HandleFunc("/calculate-title-costs", titleCostCalculatorHandler)
	r.HandleFunc("/calculate-legal-costs", legalCostCalculatorHandler)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
