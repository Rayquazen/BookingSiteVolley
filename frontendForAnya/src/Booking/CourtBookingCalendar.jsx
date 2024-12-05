import React, { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import ru from "date-fns/locale/ru";
import styles from "./CourtBookingCalendar.module.css";

const CourtBookingCalendar = () => {
	const courts = ["Корт 1", "Корт 2", "Корт 3"];
	const timeSlots = [
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
		"22:00",
		"23:00",
	];

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [courtType, setCourtType] = useState("indoor");
	const [bookedSlots, setBookedSlots] = useState([]);

	const fetchBookedSlots = async (date = selectedDate) => {
		const host = import.meta.env.VITE_APP_HOST
			? import.meta.env.VITE_APP_HOST
			: "";
		const response = await fetch(
			`${host}/api/bookings?date=${formatDate(date)}`
		);
		const data = await response.json();
		setBookedSlots(data.bookings);
	};

	// Загружаем занятые слоты при изменении даты
	useEffect(() => {
		const fetchInitialSlots = async () => {
			const host = import.meta.env.VITE_APP_HOST
				? import.meta.env.VITE_APP_HOST
				: "";
			const response = await fetch(
				`${host}/api/bookings?date=${formatDate(selectedDate)}`
			);
			const data = await response.json();
			console.log(data);
			setBookedSlots(data.bookings);
		};

		fetchInitialSlots();
	}, []); // Для первого запроса при загрузке

	useEffect(() => {
		const fetchSlotsOnDateChange = async () => {
			const host = import.meta.env.VITE_APP_HOST
				? import.meta.env.VITE_APP_HOST
				: "";
			const response = await fetch(
				`${host}/api/bookings?date=${formatDate(selectedDate)}`
			);
			const data = await response.json();
			console.log(data);
			setBookedSlots(data.bookings);
		};

		fetchSlotsOnDateChange();
	}, [selectedDate]); // Для обновления при изменении даты

	const goToNextDay = () => {
		setSelectedDate((prevDate) => {
			const newDate = addDays(prevDate, 1);
			// fetchBookedSlots(newDate);
			return newDate;
		});
	};

	const goToPreviousDay = () => {
		setSelectedDate((prevDate) => {
			const newDate = subDays(prevDate, 1);
			// fetchBookedSlots(newDate);
			return newDate;
		});
	};

	const handleDateChange = (e) => {
		const newDate = new Date(e.target.value);
		setSelectedDate(newDate);
		// fetchBookedSlots(newDate);
	};

	const formatDate = (date) => {
		return format(date, "yyyy-MM-dd", { locale: ru });
	};

	const isSlotAvailable = (courtIndex, timeIndex) => {
		// Текущее время
		const currentTime = new Date();

		// Вычисляем время выбранного слота
		const selectedSlotTime = new Date(selectedDate);
		const [hours, minutes] = timeSlots[timeIndex].split(":");
		selectedSlotTime.setHours(hours, minutes, 0, 0);

		// Проверяем, прошло ли время слота
		if (selectedSlotTime < currentTime) {
			return false; // Время слота прошло
		}

		return true; // Слот доступен по времени
	};

	// Проверка, забронирован ли слот
	const isSlotBooked = (courtIndex, timeIndex) => {
		return bookedSlots.some(
			(booking) =>
				booking.date === formatDate(selectedDate) && // Проверяем дату
				booking.time === `${timeSlots[timeIndex]}:00` && // Проверяем время
				booking.num_court === courtIndex + 1 && // Проверяем номер корта
				booking.type_court === courtType // Проверяем тип корта
		);
	};

	const submit = async (courtIndex, timeIndex) => {
		if (isSlotBooked(courtIndex, timeIndex)) {
			alert("Этот слот уже забронирован!");
			return;
		}
		// Проверяем, доступен ли слот по времени
		if (!isSlotAvailable(courtIndex, timeIndex)) {
			alert("Нельзя забронировать слот в прошедшее время!");
			return;
		}

		const bookingData = {
			date: formatDate(selectedDate),
			time: timeSlots[timeIndex],
			type_court: courtType === "indoor" ? "indoor" : "outdoor",
			num_court: courtIndex + 1,
			price: calculatePrice(timeIndex),
			type_pay: "personal",
		};

		try {
			const host = import.meta.env.VITE_APP_HOST
				? import.meta.env.VITE_APP_HOST
				: "";
			const response = await fetch(`${host}/api/add_booking`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(bookingData),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Ошибка при создании бронирования");
			}

			alert("Бронирование успешно создано!");

			// Заново загружаем занятые слоты для актуальности
			fetchBookedSlots();
		} catch (error) {
			console.error("Ошибка:", error);
			alert("Не удалось создать бронирование.");
		}
	};

	const calculatePrice = (timeIndex) => {
		if (timeIndex < 5) return 900;
		if (timeIndex < 10) return 1200;
		return 1500;
	};

	const getSlotClass = (timeIndex) => {
		if (timeIndex < 5) return styles.morning; // Желтый цвет
		if (timeIndex < 10) return styles.afternoon; // Белый цвет
		return styles.evening; // Голубой цвет
	};

	return (
		<section className={styles.calendar}>
			<p className={styles.courtTypes}>
				<button
					className={`${styles.courtButton} ${
						courtType === "indoor" ? styles.selected : ""
					}`}
					onClick={() => setCourtType("indoor")}
				>
					крытые корты
				</button>{" "}
				/{" "}
				{/* <button
					className={`${styles.courtButton} ${
						courtType === "outdoor" ? styles.selected : ""
					}`}
					// onClick={() => setCourtType("outdoor")}
				>
					открытые корты
				</button> */}
				<a>открытые корты</a>
			</p>

			<div className={styles.dateSelector}>
				<button className={styles.dateButton} onClick={goToPreviousDay}>
					&lt;
				</button>

				<div className={styles.dateDisplay}>
					<input
						type="date"
						value={formatDate(selectedDate)}
						onChange={handleDateChange}
						className={styles.dateInput}
					/>
					<button
						className={styles.dateDisplayButton}
						onClick={() =>
							document.querySelector(`.${styles.dateInput}`).showPicker()
						}
					>
						{format(selectedDate, "EEEE dd MMMM yyyy", { locale: ru })}
						<span className={styles.calendarIcon}>&#x1F4C5;</span>
					</button>
				</div>

				<button className={styles.dateButton} onClick={goToNextDay}>
					&gt;
				</button>
			</div>

			<div className={styles.bookingTable}>
				{courts.map((court, courtIndex) => (
					<div key={courtIndex} className={styles.courtRow}>
						<div className={styles.courtLabel}>{court}</div>
						<div className={styles.timeRow}>
							{timeSlots.map((time, timeIndex) => (
								<button
									key={timeIndex}
									className={`${styles.timeSlot} ${
										isSlotBooked(courtIndex, timeIndex) ||
										!isSlotAvailable(courtIndex, timeIndex)
											? styles.booked
											: getSlotClass(timeIndex)
									}`}
									onClick={() => submit(courtIndex, timeIndex)}
									disabled={
										isSlotBooked(courtIndex, timeIndex) ||
										!isSlotAvailable(courtIndex, timeIndex)
									}
								>
									{time}
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			<div className={styles.legend}>
				<div className={styles.legendItem}>
					<div
						className={styles.legendIcon}
						style={{ backgroundColor: "#ffb100" }}
					></div>
					900 р/час
				</div>
				<div className={styles.legendItem}>
					<div
						className={styles.legendIcon}
						style={{ backgroundColor: "#ffffff" }}
					></div>
					1200 р/час
				</div>
				<div className={styles.legendItem}>
					<div
						className={styles.legendIcon}
						style={{ backgroundColor: "#2d8aff" }}
					></div>
					1500 р/час
				</div>
			</div>
		</section>
	);
};

export default CourtBookingCalendar;
