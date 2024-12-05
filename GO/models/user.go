package models

type User struct {
	Id          uint64
	Name        string
	PhoneNumber string `json:"phone_number"`
	// Email    string
	Password []byte `json:"-"`
}

type Booking struct {
	ID        uint64 `json:"id" gorm:"primaryKey"`
	UserID    uint64 `json:"user_id"`
	Date      string `json:"date"`       // Формат: YYYY-MM-DD
	Time      string `json:"time"`       // Формат: HH:mm
	TypeCourt string `json:"type_court"` // indoor/outdoor
	NumCourt  int64  `json:"num_court"`
	Price     int64  `json:"price"`
	TypePay   string `json:"type_pay"` // card/cash
}

func (Booking) TableName() string {
	return "booking"
}
