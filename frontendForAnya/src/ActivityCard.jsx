import React from "react";
import styles from "./BeachActivities.module.css";

const ActivityCard = ({ title, imageSrc }) => {
	return (
		<div className={styles.activityCard}>
			<h3 className={styles.activityTitle}>{title}</h3>
			<img
				loading="lazy"
				src={imageSrc}
				alt={title}
				className={styles.activityImage}
			/>
		</div>
	);
};

export default ActivityCard;
