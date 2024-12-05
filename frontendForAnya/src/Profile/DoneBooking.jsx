import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import { BookingRow } from "../components/Row";

export const DoneBooking = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchDoneBookings = async () => {
			try {
				const host = import.meta.env.VITE_APP_HOST
					? import.meta.env.VITE_APP_HOST
					: "";
				const response = await fetch(`${host}/api/done_bookings`, {
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				if (response.ok) {
					const data = await response.json();
					setBookings(data.bookings);
				} else {
					setError("Не удалось загрузить завершённые бронирования.");
				}
			} catch (err) {
				console.error("Ошибка запроса:", err);
				setError("Произошла ошибка. Попробуйте снова.");
			} finally {
				setLoading(false);
			}
		};

		fetchDoneBookings();
	}, []);

	if (loading) {
		return <div className={styles.loading}>Загрузка...</div>;
	}

	if (error) {
		return <div className={styles.error}>{error}</div>;
	}

	return (
		<div className={styles.bookingdescrip}>
			<div className={styles.bookingsGridDescriptionsDone}>
				<div className={styles.bookingRow}>Дата</div>
				<div className={styles.bookingRow}>Время</div>
				<div className={styles.bookingRow}>Цена</div>
				<div className={styles.bookingRow}>Оплата</div>
			</div>
			<div className={styles.bookingsGridDone}>
				{bookings.map((booking) => (
					<React.Fragment key={booking.id}>
						<BookingRow label="Дата" value={booking.date} />
						<BookingRow label="Время" value={booking.time} />
						<BookingRow label="Стоимость" value={booking.price} />
						<BookingRow label="Оплата" value={booking.type_pay} />
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
