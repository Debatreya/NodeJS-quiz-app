// Package Imports
import express from 'express';
// Controller Imports
import { getQuiz, checkSolution } from '../controllers/quiz.controllers.js';

// Router
const router = express.Router();

// Routes
router.route('/quiz')
    .get(getQuiz)
    .post(checkSolution);

export default router;