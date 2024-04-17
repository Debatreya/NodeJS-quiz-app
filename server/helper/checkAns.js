const checkAns = (ans, correctAns) => {
	console.log(ans, correctAns);
	if (ans === correctAns) {
		return true;
	}
	return false;
};

export default checkAns;
