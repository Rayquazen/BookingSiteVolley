import React from "react";
import styles from "./InternalRules.module.css";

const InternalRules = () => {
	const rules = [
		"При записи, оплате и посещении клиент соглашается со всеми условиями, заявляет и гарантирует, что не имеет медицинских противопоказаний сам или его ребенок для посещения тренировок, занятий спортом.",
		"Ответственность за сохранность своих ценных вещей, денег, сотовых телефонов, драгоценностей и документов, оставленных в раздевалке или без присмотра, несет лично посетитель.",
		"Доступ на песочные корты возможен только босиком, без обуви.",
		"Запрещается использовать стеклянную посуду для напитков во всех тренировочных зонах (для питья можно использовать только пластиковые стаканы и бутылки).",
		"Запрещается тренироваться с голым торсом в крытом помещении.",
		"Запрещается самостоятельно использовать музыкальную и другую аппаратуру без спроса администрации спортивного комплекса (СК);",
		"Запрещается входить на территорию крытого СК с животными.",
		"Дети дошкольного и младшего школьного возраста на занятия приходят только в сопровождении взрослого. Запрещается оставлять детей в зоне рецепции без присмотра взрослого.",
		"Запрещается громко и агрессивно разговаривать, использовать ненормативную лексику и совершать действия, которые могут помешать окружающим.",
		"Клиенты обязаны уважительно относятся друг к другу и к персоналу.",
		"На занятие допускается клиент, предварительно оплативший тренировку. Оплата и запись ведутся и отмечаются в чате телеграмм.",
		"Пропущенная тренировка не компенсируется, оплата за неё не возвращается.",
	];

	return (
		<section className={styles.container}>
			<h1 className={styles.title}>Внутренние правила посещения тренировок</h1>
			<ul className={styles.rules}>
				{rules.map((rule, index) => (
					<li key={index}>{rule}</li>
				))}
			</ul>
		</section>
	);
};

export default InternalRules;
