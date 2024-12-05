import React from "react";
import styles from "./BeachActivities.module.css";
import ActivityCard from "./ActivityCard";

const activities = [
	{
		title: "Пляжный волейбол",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/2768795fa84c776cf81723bc5639cbde40539f5972287b3166b64e8547ca762f?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
	{
		title: "Настольный теннис",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/a41758ef23f52f58e0b3a0fca8d57c9195996d7f8dd2c4cd43624cbe54b1546b?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
	{
		title: "Пляжный футбол",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/c0880ac57f81abc7fcdd6108001a78641ec6f73a378d55db9c5c7f401ac3d942?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
	{
		title: "Пляжный регби",
		imageSrc:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/d8f57a4c086f8fd24de0a8bf3b2169f40cf0eb58e4c529ae4c7a12bd9940c2c9?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9",
	},
];

function BeachActivities() {
	return (
		<section className={styles.container}>
			<h1 className={styles.title}>Чем вы можете заниматься в my beach</h1>
			<div className={styles.activitiesContainer}>
				<div className={styles.activitiesGrid}>
					{activities.map((activity, index) => (
						<ActivityCard
							key={index}
							title={activity.title}
							imageSrc={activity.imageSrc}
						/>
					))}
				</div>
			</div>
			<p className={styles.description}>
				3 корта с мягким чистым сеяным песком, потолком 10 метров и ярким
				освещением, предназначенные для игры в пляжный волейбол, регби и футбол,
				проведения детских и корпоративных мероприятий, ОФП для детей и
				взрослых, занятия по кроссфиту, единоборства и многого другого.
				<br />
				Площадки легко трансформируются в единое поле, где можно играть или
				проводить занятия по пляжному футболу, гандболу или регби.
			</p>
		</section>
	);
}

export default BeachActivities;
