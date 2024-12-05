import React from "react";
import RegisterComp from "../components/RegisterComponent.jsx";

const Register = () => {
	const MyStyle = {
		margin: 0,
		padding: 0,
		boxSizing: "border-box",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",
		backgroundColor: "#1f1f1f", // Фон страницы
		overflow: "hidden",
	};

	return (
		<>
			<div style={MyStyle}>
				<RegisterComp />
			</div>
		</>
	);
};

export default Register;
