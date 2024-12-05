import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";

export default function UserInfo() {
	const [userDetails, setUserDetails] = useState({
		name: "",
		instagram: "",
		phone: "",
		paymentMethod: "",
	});

	useEffect(() => {
		// Запрос данных с бэкенда
		fetch("/api/user", {
			method: "GET",
			credentials: "include", // Чтобы отправить cookie
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Ошибка получения данных пользователя");
				}
				return response.json();
			})
			.then((data) => {
				// Преобразуем данные в нужный формат
				setUserDetails({
					name: data.name,
					// instagram: data.instagram || "Не указано",
					phone: data.phone_number || "Не указано",
					paymentMethod: data.payment_method || "Не указано",
				});
			})
			.catch((error) => {
				console.error("Ошибка:", error);
			});
	}, []);

	return (
		<div className={styles.userInfoColumn}>
			<div className={styles.userInfo}>
				<div className={styles.userDetails}>
					ФИО: {userDetails.name}
					<br />
					inst: {userDetails.instagram}
					<br />
					тел: {userDetails.phone}
					<br />
					Способ оплаты: {userDetails.paymentMethod}
				</div>
				<button className={styles.editButton}>Изменить</button>
			</div>
		</div>
	);
}
