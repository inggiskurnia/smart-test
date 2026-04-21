import React from "react";
import { createRoot } from "react-dom/client";

import { Spin } from "antd";
import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<React.Suspense fallback={<Spin />}>
			<App />
		</React.Suspense>
	</React.StrictMode>
);
