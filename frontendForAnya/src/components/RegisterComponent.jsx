import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import "../components/Form.css";
import { Link, Navigate } from "react-router-dom";

const RegisterComp = () => {
	useEffect(() => {
		document.body.style.overflowX = "hidden"; // Убираем скролл
		return () => {
			document.body.style.overflowY = ""; // Восстанавливаем скролл
		};
	}, []);

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [navigate, setNavigate] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		const host = import.meta.env.VITE_APP_HOST || "";
		const response = await fetch(`${host}/api/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				phone_number: phone,
				password,
			}),
		});
		console.log(response);
		setNavigate(true);
	};

	if (navigate) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="form-container">
			<p className="title">Регистрация</p>
			<form className="form" onSubmit={submit}>
				{/* Поле ФИО */}
				<div className="input-group">
					<label htmlFor="username">ФИО</label>
					<input
						type="text"
						name="username"
						id="username"
						placeholder="Иванов Иван Иванович"
						onChange={(event) => setName(event.target.value)}
						pattern="[А-Яа-яЁё\s]+" // Только кириллица и пробелы
						title="Введите ФИО на кириллице"
						required
					/>
				</div>

				{/* Поле номера телефона */}
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

				{/* Поле пароля */}
				<div className="input-group">
					<label htmlFor="password">Пароль</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Придумайте пароль"
						onChange={(event) => setPassword(event.target.value)}
						pattern=".{6,}" // Минимум 6 символов
						title="Пароль должен быть не менее 6 символов"
						required
					/>
				</div>

				<button className="sign">Зарегистрироваться</button>
			</form>
			<div className="social-message">
				<div className="line" />
				<p className="message">Уже есть аккаунт?</p>
				<div className="line" />
			</div>
			<p className="signup">
				<Link to="/login">Войти</Link>
			</p>
		</div>
	);
};

export default RegisterComp;
