package models

import "time"

type User struct {
	userID 			string 
	FirstName 		string
	LastName 		string
	Phone 			string
	email 			string
	HashedPassword 	string
	CreatedAt		time.Time
	IsActive		bool
}

type Agent struct{
	User
	Type 		  string
	LicenseNumber string
}

type Lead struct {
	User
	SourceLead string
	InterestLevel float32
	
}
