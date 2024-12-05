import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";

export default function UserInfo() {
	const [userDetails, setUserDetails] = useState({
		name: "",
		// instagram: "Не указано",
		phone: "Не указано",
		paymentMethod: "Не указано",
	});

	useEffect(() => {
		(async () => {
			try {
				const host = import.meta.env.VITE_APP_HOST
					? import.meta.env.VITE_APP_HOST
					: "";
				const response = await fetch(`${host}/api/userData`, {
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Ошибка получения данных пользователя");
				}

				const data = await response.json();

				setUserDetails({
					name: data.name,
					// instagram: data.instagram || "Не указано", // Добавьте поле, если нужно
					phone: data.phone_number || "Не указано",
					paymentMethod: data.payment_method || "Не указано",
				});
			} catch (error) {
				console.error("Ошибка:", error);
			}
		})();
	}, []);

	return (
		<div className={styles.userInfoColumn}>
			<div className={styles.userInfo}>
				<div className={styles.userDetails}>
					ФИО: {userDetails.name}
					<br />
					{/* inst: {userDetails.instagram}
					<br /> */}
					тел: {userDetails.phone}
					<br />
					Способ оплаты: {userDetails.paymentMethod}
				</div>
				<button className={styles.editButton}>Изменить</button>
			</div>
		</div>
	);
}
