import React from "react";
import styles from "./MyBeachComponents.module.css";
import { Link } from "react-router-dom";

const Hero = () => {
	return (
		<section className={styles.hero}>
			<h1 className={styles.heroTitle}>my beach</h1>
			<h2 className={styles.heroSubtitle}>
				комплекс <br /> пляжных <br /> видов спорта
			</h2>
			<Link to="/booking">
				<button className={styles.ctaButton}>Забронировать</button>
			</Link>
		</section>
	);
};

export default Hero;
