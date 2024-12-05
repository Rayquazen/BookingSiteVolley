import React from "react";
import styles from "./CourtSchemes.module.css";

function CourtCard({ title, imageSrc }) {
	return (
		<article className={styles.courtWrapper}>
			<h2 className={styles.courtTitle}>{title}</h2>
			<img
				loading="lazy"
				src={imageSrc}
				alt={`Схема ${title}`}
				className={styles.courtImage}
			/>
		</article>
	);
}

export default CourtCard;
