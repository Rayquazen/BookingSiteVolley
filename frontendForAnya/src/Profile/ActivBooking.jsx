import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import { BookingRow } from "../components/Row";

export const ActivBooking = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const host = import.meta.env.VITE_APP_HOST
					? import.meta.env.VITE_APP_HOST
					: "";
				const response = await fetch(`${host}/api/active_bookings`, {
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				if (response.ok) {
					const data = await response.json();
					setBookings(data.bookings);
					// console.log(data.bookings);
				} else {
					setError("Не удалось загрузить активные бронирования.");
				}
			} catch (err) {
				console.error("Ошибка запроса:", err);
				setError("Произошла ошибка. Попробуйте снова.");
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	if (loading) {
		return <div className={styles.loading}>Загрузка...</div>;
	}

	if (error) {
		return <div className={styles.error}>{error}</div>;
	}

	const handleCancel = async (id) => {
		try {
			const host = import.meta.env.VITE_APP_HOST
				? import.meta.env.VITE_APP_HOST
				: "";
			const response = await fetch(`${host}/api/delete_bookings/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (response.ok) {
				alert("Бронирование успешно отменено!");
				// Удаляем отмененное бронирование из состояния
				setBookings((prev) => prev.filter((booking) => booking.id !== id));
			} else {
				alert("Ошибка при отмене бронирования.");
			}
		} catch (error) {
			console.error("Ошибка запроса:", error);
			alert("Произошла ошибка. Попробуйте снова.");
		}
	};

	return (
		<div className={styles.bookingdescrip}>
			<div className={styles.bookingsGridDescriptions}>
				<div className={styles.bookingRow}>Дата</div>
				<div className={styles.bookingRow}>Время</div>
				<div className={styles.bookingRow}>Цена</div>
				<div className={styles.bookingRow}>Оплата</div>
				<div className={styles.bookingRow}>Отмена</div>
			</div>
			<div className={styles.bookingsGridActiv}>
				{bookings.map((booking) => (
					<React.Fragment key={booking.id}>
						<BookingRow label="Дата" value={booking.date} />
						<BookingRow label="Время" value={booking.time} />
						<BookingRow label="Стоимость" value={booking.price} />
						<BookingRow label="Оплата" value={booking.type_pay} />
						<BookingRow
							label="Отмена"
							value={
								<button
									className={styles.cancelButton}
									onClick={() => handleCancel(booking.id)}
								>
									Отменить
								</button>
							}
						/>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
