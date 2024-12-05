package routes

import (
	"GO/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	// Существующие маршруты
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/logout", controllers.Logout)
	app.Post("/api/add_booking", controllers.AddBooking)

	// Новый маршрут для получения бронирований по дате
	app.Get("/api/bookings", controllers.GetBookingsByDate)
	app.Get("/api/active_bookings", controllers.GetActiveBookings)
	app.Delete("/api/delete_bookings/:id", controllers.DeleteBookings)
	app.Get("/api/done_bookings", controllers.DoneBookings)
	app.Get("/api/userData", controllers.GetUserData)

}
