import { useState } from 'react';
import { css } from '@emotion/react';
import { DecideButton } from './components/DecideButton';
import { QuestionInput } from './components/QuestionInput';
import { ResultCard } from './components/ResultCard';
import { RevealStage } from './components/RevealStage';
import { SuggestionChips } from './components/SuggestionChips';
import { pickSuggestions } from './features/decision/suggestions';
import { usePhase } from './features/decision/usePhase';
import { theme } from './styles/theme';

function App() {
  const [suggestions] = useState(() => pickSuggestions());
  const [question, setQuestion] = useState('');
  const { phase, answer, start, reset } = usePhase();

  // 입력이 비어 있으면 추천 질문 중 하나를 대신 채움
  const handleDecide = () => {
    setQuestion(question.trim() || suggestions[Math.floor(Math.random() * suggestions.length)]);
    start();
  };

  const isPlaying = phase === 'rolling' || phase === 'teasing';

  return (
    <main css={screen}>
      {phase === 'idle' && (
        <div css={form}>
          <h1 css={title}>YES / NO</h1>
          <QuestionInput value={question} onChange={setQuestion} />
          <SuggestionChips items={suggestions} onSelect={setQuestion} />
        </div>
      )}
      {isPlaying && <RevealStage question={question} phase={phase} />}
      {phase === 'revealed' && answer !== null && <ResultCard question={question} answer={answer} />}

      <DecideButton
        label={phase === 'revealed' ? '다시 하기' : isPlaying ? '결정하는 중' : '결정하기'}
        disabled={isPlaying}
        onClick={phase === 'revealed' ? reset : handleDecide}
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
