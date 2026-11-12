import { getQuestionsByLevel } from './questions.js';

export default function getProblems() {
    return [getQuestionsByLevel(2)];
}
