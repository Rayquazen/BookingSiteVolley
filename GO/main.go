package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"GO/database"
	"GO/routes"
	"fmt"

	"github.com/joho/godotenv"
)

func main() {
	// Загрузка переменных окружения
	if err := godotenv.Load(); err != nil {
		fmt.Println("Ошибка при загрузке .env файла")
	}

	// Получение переменных окружения
	DB_HOST := os.Getenv("DB_HOST")
	DB_PORT := os.Getenv("DB_PORT")
	DB_USER := os.Getenv("DB_USER")
	DB_PASSWORD := os.Getenv("DB_PASSWORD")
	DB_NAME := os.Getenv("DB_NAME")

	fmt.Println("Параметры базы данных:", DB_HOST, DB_PORT, DB_USER, DB_NAME)

	// Формирование DSN и подключение к базе данных
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
	database.Connect(dsn)

	// Инициализация Fiber
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowCredentials: true,
	}))

	// Настройка маршрутов
	routes.Setup(app)

	// Обслуживание статических файлов из папки dist
	app.Static("/", "./dist")

	// Обработка всех остальных маршрутов для SPA
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./dist/index.html")
	})

	// Запуск приложения
	log.Fatal(app.Listen(":8000"))
}
