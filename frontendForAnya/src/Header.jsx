import React, { useEffect, useState } from "react";
import styles from "./MyBeachComponents.module.css";
import { Link } from "react-router-dom";

const Header = ({ name, setName }) => {
	const [activeSection, setActiveSection] = useState(null); // "Данные" по умолчанию

	const handleSelect = (section) => {
		setActiveSection(section); // Устанавливаем активный элемент
	};
	// Логика для выхода
	const logout = async () => {
		const host = import.meta.env.VITE_APP_HOST
			? import.meta.env.VITE_APP_HOST
			: "";
		await fetch(`${host}/api/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		setName(undefined);

		// console.log(name);
		// Очистить имя пользователя после выхода
		// Можно сделать редирект на страницу входа, если нужно:
		// window.location.href = "/login";
	};

	// Навигационные элементы для неавторизованных пользователей
	const navItems1 = [
		{ id: 1, text: "Бронирование", href: "/booking" },
		// { id: 2, text: "Турниры" },
		// { id: 3, text: "Новости" },
		{ id: 3, text: "Вход", href: "/login" },
		{ id: 4, text: "Регистрация", href: "/register" },
	];

	// Навигационные элементы для авторизованных пользователей
	const navItems2 = [
		{ id: 1, text: "Бронирование", href: "/booking" },
		// { id: 2, text: "Турниры" },
		// { id: 3, text: "Новости" },
		// { id: 4, text: name },
		{ id: 3, text: "Личный кабинет", href: "/userinfo" },
		{ id: 4, text: "Выход" },
	];

	// Логика выбора меню в зависимости от авторизации
	const [menu, setMenu] = useState(navItems1);
	useEffect(() => {
		setMenu(name == undefined ? navItems1 : navItems2);
		document.body.style.overflowX = "hidden"; // Убираем скролл
		// console.log(name);

		// Убираем стили, когда компонент размонтируется
		return () => {
			document.body.style.overflow = ""; // Сбрасываем скролл
		};
	}, [name]); // Перерендерить меню при изменении имени пользователя
	return (
		<div>
			<header className={styles.header}>
				<Link to="/">
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/TEMP/d22eff6f2b65167c70498104bfd87a12281f989afbce655fd2dec77196dd4a01?placeholderIfAbsent=true&apiKey=5d694fdf6b9b46ce8185a79644b61bb9"
						alt="My Beach Logo"
						className={styles.logo}
					/>
				</Link>
				<nav className={styles.navigation}>
					{menu.map((item) => (
						<Link
							key={item.id}
							to={item.href || "#"}
							className={styles.navItem}
							onClick={item.text === "Выход" ? logout : undefined}
						>
							{item.text}
						</Link>
					))}
				</nav>
			</header>
		</div>
	);
};

export default Header;
