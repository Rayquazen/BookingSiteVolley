import React from "react";
import styles from "../Profile/UserProfile.module.css";

export const BookingRow = ({ label, value }) => (
	<div className={styles.bookingRow}>
		{/* <p>{label}</p> */}
		<div className={styles.bookingCell}>{value}</div>
	</div>
);
