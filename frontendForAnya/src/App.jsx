import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Добавляем Router
import MyBeachPage from "./MyBeachPage.jsx";
import CourtBookingCalendar from "./Booking/CourtBookingCalendar.jsx";
import Register from "./pages/Regiter.jsx";
import Header from "./Header.jsx";
import Login from "./pages/Login.jsx";
import { useState, useEffect } from "react";
import UserProfile from "./Profile/UserProfile.jsx";

function App() {
	const [name, setName] = useState("");
	useEffect(() => {
		(async () => {
			const host = import.meta.env.VITE_APP_HOST
				? import.meta.env.VITE_APP_HOST
				: "";
			const response = await fetch(`${host}/api/user`, {
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			const content = await response.json();

			setName(content.Name);
			// console.log("hi");
		})();
	}, []);
	return (
		<>
			<Router>
				<Header name={name} setName={setName} />
				<Routes>
					<Route path="/" element={<MyBeachPage />} />
					<Route path="/booking" element={<CourtBookingCalendar />} />
					<Route path="/login" element={<Login setName={setName} />} />
					<Route path="/register" element={<Register />} />
					<Route path="/userinfo" element={<UserProfile />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
