import React, { useState } from "react";
import styles from "./UserProfile.module.css";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";
import { DoneBooking } from "./DoneBooking";
import { ActivBooking } from "./ActivBooking";

export default function BookingsList({ onComponentSelect }) {
	const [activeSection, setActiveSection] = useState("Данные"); // "Данные" по умолчанию

	const handleSelect = (component, section) => {
		setActiveSection(section); // Устанавливаем активный элемент
		onComponentSelect(component);
	};

	return (
		<div className={styles.bookingsColumn}>
			<nav className={styles.bookingsList}>
				<Link
					onClick={() => handleSelect(<UserInfo />, "Данные")}
					className={activeSection === "Данные" ? styles.activeLink : ""}
				>
					<div className={styles.activeBookings}>Данные</div>
				</Link>
				<Link
					onClick={() => handleSelect(<DoneBooking />, "Завершённые брони")}
					className={
						activeSection === "Завершённые брони" ? styles.activeLink : ""
					}
				>
					<div className={styles.activeBookings}>Завершённые брони</div>
				</Link>
				<Link
					onClick={() => handleSelect(<ActivBooking />, "Активные брони")}
					className={
						activeSection === "Активные брони" ? styles.activeLink : ""
					}
				>
					<div className={styles.activeBookings}>Активные брони</div>
				</Link>
			</nav>
		</div>
	);
}
