package models

type Property struct {
	ID             uint            `json:"id"`
	AgentID        uint            `json:"agent_id"`
	Name           string          `json:"name"`
	Description    string          `json:"description"`
	PropertyImages []PropertyImage `json:"property_images"`
	Address        string          `json:"address"`
	Zone           string          `json:"zone"`
	PriceCents     int64           `json:"price_cents"`
	Currency       string          `json:"currency"`
	IsAvailable    bool            `json:"is_available"`
	SizeM2         float64         `json:"size_m2"`
}

type House struct {
	Property
	PropertyID uint `json:"property_id"`
	Levels     int  `json:"levels"`
	Bedrooms   int  `json:"bedrooms"`
	Bathrooms  int  `json:"bathrooms"`
}

type Apartment struct {
	Property
	PropertyID uint `json:"property_id"`
	Floor      int  `json:"floor"`
	Rooms      int  `json:"rooms"`
}

type LandForSale struct {
	Property
	PropertyID        uint `json:"property_id"`
	QuantityOfParcels int  `json:"quantity_of_parcels"`
}

type PropertyImage struct {
	ImageID      string
	PropertyID   string
	Url          string
	IsCover      bool
	DisplayOrder int
}
