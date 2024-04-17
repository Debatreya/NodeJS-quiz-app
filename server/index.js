// Imports
// Package imports
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// Router imports
import quizRouter from "./routes/quiz.routes.js";

// App
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
// Backend routes
app.get("/hello", (req, res) => {
	res.send("Hello from the API");
});
app.use("/api", quizRouter);

// Serve static html
app.use(express.static(path.join(__dirname, "../client")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start server
const port = process.env.PORT || 3000;
const server = () => {
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
};

server();
