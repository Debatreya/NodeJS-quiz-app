const resultGenerator = (correct, wrong, unAttempted, totalQuestions) => {
	const quizResult = [totalQuestions];
	correct.map((index) => {
		quizResult[index] = "correct";
	});
	wrong.map((index) => {
		quizResult[index] = "wrong";
	});
	unAttempted.map((index) => {
		quizResult[index] = "unattempted";
	});

	return quizResult;
};

export default resultGenerator;
