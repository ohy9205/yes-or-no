import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { DecideButton } from './components/DecideButton';
import { DecisionOptions } from './components/DecisionOptions';
import { QuestionInput } from './components/QuestionInput';
import { ResultActions } from './components/ResultActions';
import { ResultCard } from './components/ResultCard';
import { RevealStage } from './components/RevealStage';
import { SuggestionChips } from './components/SuggestionChips';
import { DEFAULT_OPTIONS } from './features/decision/options';
import { pickSuggestions } from './features/decision/suggestions';
import { usePhase } from './features/decision/usePhase';
import { loadRecentQuestion, saveRecentQuestion } from './features/storage/recentQuestion';
import { theme } from './styles/theme';

function App() {
  const [suggestions] = useState(() => pickSuggestions());
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const { phase, answer, draws, rounds, start, reset } = usePhase();

  // 재진입 시 마지막 질문 복원. 불러오는 사이 사용자가 입력했다면 그쪽을 우선한다
  useEffect(() => {
    void loadRecentQuestion().then((saved) => {
      if (saved) setQuestion((current) => current || saved);
    });
  }, []);

  // 입력이 비어 있으면 추천 질문 중 하나를 대신 채움
  const handleDecide = () => {
    const asked = question.trim() || suggestions[Math.floor(Math.random() * suggestions.length)];
    setQuestion(asked);
    void saveRecentQuestion(asked);
    start(options);
  };

  const isPlaying = phase !== 'idle' && phase !== 'revealed';

  return (
    <main css={screen}>
      {phase === 'idle' && (
        <div css={form}>
          <h1 css={title}>YES / NO</h1>
          <QuestionInput value={question} onChange={setQuestion} />
          <SuggestionChips items={suggestions} onSelect={setQuestion} />
          <DecisionOptions value={options} onChange={setOptions} />
        </div>
      )}
      {isPlaying && (
        <RevealStage
          question={question}
          phase={phase}
          rounds={rounds}
          draws={draws}
          tilt={options.tilt}
        />
      )}
      {phase === 'revealed' && answer !== null && (
        <ResultCard question={question} answer={answer} draws={draws} tilt={options.tilt} />
      )}

      {phase === 'revealed' && answer !== null ? (
        <ResultActions question={question} answer={answer} onRetry={reset} />
      ) : (
        <DecideButton
          label={isPlaying ? '결정하는 중' : '결정하기'}
          disabled={isPlaying}
          onClick={handleDecide}
        />
      )}
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
