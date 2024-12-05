import React from "react";
import styles from "./UserProfile.module.css";

export default function UserInfo() {
	const userDetails = {
		name: "Иванов Иван Иванович",
		instagram: "ivanov6745",
		phone: "8-800-555-35-35",
		paymentMethod: "0012",
	};

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
