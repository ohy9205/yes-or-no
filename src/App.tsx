import { useState } from 'react';
import { css } from '@emotion/react';
import { DecideButton } from './components/DecideButton';
import { QuestionInput } from './components/QuestionInput';
import { ResultCard } from './components/ResultCard';
import { SuggestionChips } from './components/SuggestionChips';
import { decide, type Answer } from './features/decision/decide';
import { pickSuggestions } from './features/decision/suggestions';
import { theme } from './styles/theme';

function App() {
  const [suggestions] = useState(() => pickSuggestions());
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);

  // 입력이 비어 있으면 추천 질문 중 하나를 대신 채움
  const handleDecide = () => {
    const asked = question.trim() || suggestions[Math.floor(Math.random() * suggestions.length)];
    setQuestion(asked);
    setAnswer(decide());
  };

  const handleRetry = () => setAnswer(null);

  return (
    <main css={screen}>
      {answer === null ? (
        <div css={form}>
          <h1 css={title}>YES / NO</h1>
          <QuestionInput value={question} onChange={setQuestion} />
          <SuggestionChips items={suggestions} onSelect={setQuestion} />
        </div>
      ) : (
        <ResultCard question={question} answer={answer} />
      )}
      <DecideButton
        label={answer === null ? '결정하기' : '다시 하기'}
        onClick={answer === null ? handleDecide : handleRetry}
      />
    </main>
  );
}

const screen = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  padding: `calc(${theme.space.lg} + env(safe-area-inset-top)) ${theme.space.md} 0`,
  backgroundColor: theme.color.background,
});

const form = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.lg,
});

const title = css({
  margin: 0,
  fontSize: '28px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: theme.color.text,
});

export default App;
