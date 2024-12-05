import React from "react";
import styles from "./MyBeachComponents.module.css";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<address className={styles.address}>
				г.Новосибирск ул.Большая 254/1
			</address>
		</footer>
	);
};

export default Footer;
