import quiz from '../quiz.json' assert { type: 'json' };

const getQuiz = async (req, res) => {
    console.log('getQuiz', quiz);
};

const checkSolution = async (req, res) => {
    console.log('checkSolution', quiz);
};

export { getQuiz, checkSolution };