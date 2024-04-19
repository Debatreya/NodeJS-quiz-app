import quizObj from "../quiz.json" assert { type: "json" };
import checkAns from "../helper/checkAns.js";
import resultGenerator from "../helper/resultGenerator.js";

const getQuiz = async (req, res) => {
	try {
		res.status(200).json(quizObj?.quiz);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const checkSolution = async (req, res) => {
	const { name, email, phone, answers } = req.body;
	console.log(name, email, phone, answers);
	const quiz = quizObj.quiz;
	try {
		const correctAnswers = [],
			wrongAnswers = [],
			unAttempted = [];
		quiz.map((q, index) => {
			if (!answers[index]) {
				unAttempted.push(index);
			} else {
				if (checkAns(answers[index], q.answer)) {
					correctAnswers.push(index);
				} else {
					wrongAnswers.push(index);
				}
			}
		});

		// Conpute Result
		const totalQuestions = quiz.length;
		const correct = correctAnswers.length;
		const wrong = wrongAnswers.length;
		const unAttemptedCount = unAttempted.length;
		const score = correct * 10;

		const result = {
			user: { name, email, phone },
			totalQuestions,
			correct,
			wrong,
			unAttemptedCount,
			score,
			quizResult : {
				correctAnswers,
				wrongAnswers,
				unAttempted,
			},
		};

		res.status(200).json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export { getQuiz, checkSolution };
