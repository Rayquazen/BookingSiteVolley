import React from "react";
import styles from "./CourtSchemes.module.css";
import CourtCard from "./CourtCard";

const courtData = [
	{
		id: 1,
		title: "Корт 1",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/823dd435f848273fadfcfada853e6502c5ec6be7e08fd665048e4fc2d941d86a?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
	{
		id: 2,
		title: "Корт 2",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/823dd435f848273fadfcfada853e6502c5ec6be7e08fd665048e4fc2d941d86a?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
	{
		id: 3,
		title: "Корт 3",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/823dd435f848273fadfcfada853e6502c5ec6be7e08fd665048e4fc2d941d86a?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
];

function CourtSchemes() {
	return (
		<section className={styles.container}>
			<h1 className={styles.title}>Схемы игровых площадок</h1>
			<div className={styles.courtContainer}>
				<div className={styles.courtGrid}>
					{courtData.map((court) => (
						<div key={court.id} className={styles.courtColumn}>
							<CourtCard title={court.title} imageSrc={court.imageSrc} />
						</div>
					))}
				</div>
			</div>
			<p className={styles.description}>
				Высота сетки регулируется от 1 м до 2,5 м. <br />
				Высота потолка 10 м<br />
				Габариты площадки: 18х12 м<br />
				Размер игрового поля: 16х8 м<br />
				Подходит для: пляжного волейбола, тенниса, футволея, групповых
				тренировок до 12 человек
			</p>
		</section>
	);
}

export default CourtSchemes;
