import {
  EntryQuiz,
  ComposeQuiz,
  EditQuestion,
  PublishQuiz,
  TakeQuiz,
  TakeQuizReview,
  TakeQuizResult,
  PreviewDraftQuizNotification,
  YourQuiz,
  Scoreboard,
} from '~/screens/quiz';

const quizScreens = {
  'entry-quiz': EntryQuiz,
  'compose-quiz': ComposeQuiz,
  'edit-question': EditQuestion,
  'publish-quiz': PublishQuiz,
  'take-quiz': TakeQuiz,
  'take-quiz-review': TakeQuizReview,
  'take-quiz-result': TakeQuizResult,
  'preview-draft-quiz-notification': PreviewDraftQuizNotification,
  'your-quiz': YourQuiz,
  'score-board': Scoreboard,
};

export default quizScreens;
