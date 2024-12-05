import React from "react";
import { useEffect, useState } from "react";
import "./Form.css";
import InputMask from "react-input-mask";
import { Link, Navigate } from "react-router-dom";
const SignInComp = ({ setName }) => {
	useEffect(() => {
		// Добавляем стили при монтировании компонента
		document.body.style.overflowX = "hidden"; // Убираем скролл

		// Убираем стили, когда компонент размонтируется
		return () => {
			document.body.style.overflowY = ""; // Сбрасываем скролл
		};
	}, []); // Пустой массив, чтобы эффект сработал только один раз
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");

	const submit = async (event) => {
		event.preventDefault();

		const host = import.meta.env.VITE_APP_HOST
			? import.meta.env.VITE_APP_HOST
			: "";
		const response = await fetch(`${host}/api/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				// name,
				phone_number: phone,
				password,
			}),
		})
			.then((response) => {
				if (response.ok) {
					// setName("ALEG");
					window.location.href = "/";
				}
			})
			.catch((error) => {
				console.error("Ошибка при запросе:", error); // Выводим ошибку в консоль
			});

		//

		// const content = await response.json();
	};
	// if (navigate) {
	// 	return <Navigate to="/" />;
	// }
	return (
		<div className="form-container">
			<p className="title">Вход</p>

			<form className="form" onSubmit={submit}>
				<div className="input-group">
					<label htmlFor="phone">Номер телефона</label>
					<InputMask
						mask="+7 (999) 999-99-99"
						value={phone}
						onChange={(event) => setPhone(event.target.value)}
					>
						{(inputProps) => (
							<input
								{...inputProps}
								type="tel"
								name="phone"
								id="phone"
								placeholder="+7 (___) ___-__-__"
								required
							/>
						)}
					</InputMask>
				</div>
				<div className="input-group">
					<label htmlFor="password">Пароль</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="forgot">
						{/* <a rel="noopener noreferrer" href="#">
							Забыли пароль?
						</a> */}
					</div>
				</div>
				<button className="sign">Войти</button>
			</form>
			<div className="social-message">
				<div className="line" />
				<p className="message">Нет аккаунта?</p>
				<div className="line" />
			</div>
			<p className="signup">
				<a rel="noopener noreferrer" href="#" className>
					<Link to="/register">Зарегистрироваться</Link>
				</a>
			</p>
		</div>
	);
};

export default SignInComp;
