package controllers

import (
	"GO/database"
	"GO/models"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "Motorin"

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	user := models.User{
		Name:        data["name"],
		PhoneNumber: data["phone_number"],
		Password:    password,
	}

	database.DB.Create(&user)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	// Ищем пользователя по номеру телефона
	database.DB.Where("phone_number = ?", data["phone_number"]).First(&user)

	if user.Id == 0 {
		c.SendStatus(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.SendStatus(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Invalid password",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		Subject:   user.PhoneNumber, // Сохраняем номер телефона в subject
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
	})

	tokenString, err := token.SignedString([]byte(SecretKey))

	if err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    tokenString,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	})

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	fmt.Println("Received token:", cookie)

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		c.SendStatus(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	claims, _ := token.Claims.(*jwt.RegisteredClaims)

	var user models.User

	database.DB.Where("id =?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

func AddBooking(c *fiber.Ctx) error {
	// Парсим тело запроса в структуру Booking
	var booking models.Booking

	if err := c.BodyParser(&booking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data",
			"error":   err.Error(),
		})
	}

	// Проверяем, авторизован ли пользователь
	cookie := c.Cookies("jwt")
	fmt.Println("Received cookie:", cookie)

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	claims, _ := token.Claims.(*jwt.RegisteredClaims)

	// Добавляем ID пользователя в бронирование
	userID, _ := strconv.Atoi(claims.Issuer)
	booking.UserID = uint64(userID)

	// Форматируем дату и время
	date, err := time.Parse("2006-01-02", booking.Date)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid date format",
			"error":   err.Error(),
		})
	}
	booking.Date = date.Format("2006-01-02") // Сохраняем как строку

	timeSlot, err := time.Parse("15:04", booking.Time)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid time format",
			"error":   err.Error(),
		})
	}
	booking.Time = timeSlot.Format("15:04")

	var existingBooking models.Booking
	err = database.DB.Where("date = ? AND time = ? AND num_court = ?", booking.Date, booking.Time, booking.NumCourt).First(&existingBooking).Error
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "Slot is already booked",
		})
	}

	// Сохраняем бронирование в базу данных
	if err := database.DB.Create(&booking).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create booking",
			"error":   err.Error(),
		})
	}

	loc, err := time.LoadLocation("Asia/Novosibirsk")
	if err != nil {
		log.Fatal("Ошибка при загрузке часовой зоны:", err)
	}

	// Текущая дата и время
	currentTime := time.Now().In(loc)

	// Преобразуем дату и время бронирования в объект time.Time
	bookingDateTime, err := time.ParseInLocation("2006-01-02 15:04", booking.Date+" "+booking.Time, loc)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid date or time format",
			"error":   err.Error(),
		})
	}

	// Если выбранная дата и время меньше текущих, возвращаем ошибку
	if bookingDateTime.Before(currentTime) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "The selected date and time have already passed",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Booking created successfully",
		"booking": booking,
	})
}

// Функция для получения бронирований по дате
func GetBookingsByDate(c *fiber.Ctx) error {
	// Получаем дату из параметров запроса
	date := c.Query("date") // например, "2024-12-03"

	// Проверяем, что дата предоставлена
	if date == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Date is required",
		})
	}

	// Парсим дату в формат времени
	_, err := time.Parse("2006-01-02", date)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid date format",
		})
	}

	// Получаем все бронирования для этой даты
	var bookings []models.Booking
	err = database.DB.Where("date = ?", date).Find(&bookings).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch bookings",
			"error":   err.Error(),
		})
	}

	// Возвращаем список бронирований
	return c.JSON(fiber.Map{
		"bookings": bookings,
	})
}

func GetActiveBookings(c *fiber.Ctx) error {
	// Проверяем токен пользователя
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	claims, _ := token.Claims.(*jwt.RegisteredClaims)
	userID := claims.Issuer

	loc, err := time.LoadLocation("Asia/Novosibirsk")
	if err != nil {
		log.Fatal("Ошибка при загрузке часовой зоны:", err)
	}

	// Текущая дата
	currentTime := time.Now().In(loc)

	// currentTime := time.Now().In(time.FixedZone("NOVOSIBIRSK", 7*60*60)) // Новосибирск +7

	// Здесь фильтруем по завершённым бронированиям, которые раньше текущего времени
	var activeBookings []models.Booking
	err = database.DB.Where("user_id = ? AND CONCAT(date, ' ', time) > ?", userID, currentTime.Format("2006-01-02 15:04:05")).Find(&activeBookings).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch active bookings",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"bookings":     activeBookings,
		"message":      "Active bookings fetched successfully",
		"current_time": currentTime,
	})
}

func DeleteBookings(c *fiber.Ctx) error {
	bookingID := c.Params("id")

	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	claims, _ := token.Claims.(*jwt.RegisteredClaims)
	userID := claims.Issuer

	var booking models.Booking
	err = database.DB.First(&booking, bookingID).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Booking not found",
		})
	}

	if strconv.Itoa(int(booking.UserID)) != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "You do not have permission to delete this booking",
		})
	}

	if err := database.DB.Delete(&booking).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to delete booking",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Booking deleted successfully",
	})
}

func DoneBookings(c *fiber.Ctx) error {
	// Получаем пользователя из JWT
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	claims, _ := token.Claims.(*jwt.RegisteredClaims)
	userID := claims.Issuer

	loc, err := time.LoadLocation("Asia/Novosibirsk")
	if err != nil {
		log.Fatal("Ошибка при загрузке часовой зоны:", err)
	}

	// Текущая дата
	currentTime := time.Now().In(loc)

	// Здесь фильтруем по завершённым бронированиям, которые раньше текущего времени
	var bookings []models.Booking
	err = database.DB.Where("user_id = ? AND CONCAT(date, ' ', time) < ?", userID, currentTime.Format("2006-01-02 15:04:05")).Find(&bookings).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error fetching bookings",
		})
	}

	return c.JSON(fiber.Map{
		"bookings": bookings,
	})
}

// Получение данных текущего пользователя
func GetUserData(c *fiber.Ctx) error {
	// Читаем токен из cookie
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Получаем данные из claims
	claims, _ := token.Claims.(*jwt.RegisteredClaims)
	var user models.User

	// Находим пользователя в базе данных
	database.DB.Where("id = ?", claims.Issuer).First(&user)

	if user.Id == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// Формируем ответ
	return c.JSON(fiber.Map{
		"name":         user.Name,
		"phone_number": user.PhoneNumber,
		// "payment_method": "0012", // Если поле payment_method не задано, добавьте его в модели/базу
	})
}
