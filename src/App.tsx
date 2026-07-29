import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { AppHeader } from './components/AppHeader';
import { DecideButton } from './components/DecideButton';
import { DecisionOptions } from './components/DecisionOptions';
import { QuestionInput } from './components/QuestionInput';
import { ResultActions } from './components/ResultActions';
import { ResultCard } from './components/ResultCard';
import { RevealStage } from './components/RevealStage';
import { SuggestionChips } from './components/SuggestionChips';
import { DEFAULT_OPTIONS } from './features/decision/options';
import type { DecisionResult } from './features/decision/result';
import { pickSuggestions } from './features/decision/suggestions';
import { usePhase } from './features/decision/usePhase';
import { loadDecisionOptions, saveDecisionOptions } from './features/storage/options';
import { loadRecentQuestion, saveRecentQuestion } from './features/storage/recentQuestion';
import { theme } from './styles/theme';

function App() {
  const [suggestions, setSuggestions] = useState(() => pickSuggestions());
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const { phase, answer, draws, rounds, start, reset } = usePhase();

  // 재진입 시 마지막 질문과 옵션 복원. 불러오는 사이 사용자가 고친 값이 있으면 그쪽을 우선한다
  useEffect(() => {
    void loadRecentQuestion().then((saved) => {
      if (saved) setQuestion((current) => current || saved);
    });
    void loadDecisionOptions().then((saved) => {
      setOptions((current) => (current === DEFAULT_OPTIONS ? saved : current));
    });
  }, []);

  // 입력이 비어 있으면 추천 질문 중 하나를 대신 채움
  const handleDecide = () => {
    const asked = question.trim() || suggestions[Math.floor(Math.random() * suggestions.length)];
    setQuestion(asked);
    void saveRecentQuestion(asked);
    void saveDecisionOptions(options);
    start(options);
  };

  const isPlaying = phase !== 'idle' && phase !== 'revealed';
  const result: DecisionResult | null =
    phase === 'revealed' && answer !== null
      ? { question, answer, draws, tilt: options.tilt }
      : null;

  return (
    <div css={page}>
      <main css={shell}>
        <AppHeader tilt={options.tilt} />
        {phase === 'idle' && (
          <div css={form}>
            <QuestionInput value={question} onChange={setQuestion} onSubmit={handleDecide} />
            <SuggestionChips
              items={suggestions}
              onSelect={setQuestion}
              onReroll={() => setSuggestions(pickSuggestions())}
            />
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
        {result !== null && <ResultCard result={result} />}

        {result !== null ? (
          <ResultActions result={result} onRetry={reset} />
        ) : (
          <DecideButton
            label={isPlaying ? '결정하는 중' : '결정하기'}
            disabled={isPlaying}
            onClick={handleDecide}
          />
        )}
      </main>
    </div>
  );
}

/** 넓은 화면에서도 본문은 가운데 한 벌만 둔다 */
const page = css({
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100dvh',
  backgroundColor: theme.color.background,
});

const shell = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: theme.maxWidth,
  minHeight: '100dvh',
  boxSizing: 'border-box',
  paddingTop: 'env(safe-area-inset-top)',
});

/**
 * 입력 화면. 좌우 여백은 각 섹션이 직접 쥔다 —
 * 삼세번 줄처럼 구분선을 화면 끝까지 그어야 하는 섹션이 있기 때문이다.
 */
const form = css({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.space.xl,
  paddingTop: theme.space.sm,
});

export default App;
