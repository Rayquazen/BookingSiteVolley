import React, { useState } from "react";
import styles from "./UserProfile.module.css";
import UserInfo from "./UserInfo";
import BookingsList from "./BookingList";

export default function ProfilePage() {
	const [selectedComponent, setSelectedComponent] = useState(<UserInfo />); // Состояние для компонента

	return (
		<main className={styles.container}>
			<section className={styles.content}>
				<BookingsList onComponentSelect={setSelectedComponent} />

				<div className={styles.selectedComponentWrapper}>
					{selectedComponent}
				</div>
			</section>
		</main>
	);
}
