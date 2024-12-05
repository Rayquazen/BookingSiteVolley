import React from "react";
import SignInComp from "../components/LoginComponent.jsx";

const Login = ({ setName }) => {
	const MyStyle = {
		margin: 0,
		padding: 0,
		boxSizing: "border-box",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",
		backgroundColor: "#1f1f1f", // Фон страницы
	};

	return (
		<>
			<div style={MyStyle}>
				<SignInComp setName={setName} />
			</div>
		</>
	);
};

export default Login;
