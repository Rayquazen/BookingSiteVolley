import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Render the MyBeachPage component in the root element of the DOM

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<App></App>
);
