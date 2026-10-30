import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { AcademyLesson, QuizQuestion } from '../../types/trading';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Lock,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Shield,
  Brain,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

export const SoniAcademy: React.FC = () => {
  const { academyLessons, completedLessonIds, completeLesson, resetAcademyProgress } = useTrading();
  const [selectedLessonId, setSelectedLessonId] = useState<string>(academyLessons[0].id);

  // Quiz state for the current lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const activeLesson = academyLessons.find((l) => l.id === selectedLessonId) || academyLessons[0];
  const isLessonCompleted = completedLessonIds.includes(activeLesson.id);

  const totalLessons = academyLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setSelectedLessonId(lesson.id);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    activeLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    setQuizScore(correct);
    setSubmittedQuiz(true);

    if (correct === activeLesson.quiz.length) {
      completeLesson(activeLesson.id, correct);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Academy Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1627] via-[#111c33] to-[#0c1f2d] border border-[#1e293b] rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Official Soni Trading Curriculum</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              SONI ACADEMY <span className="text-emerald-400 font-light">— Level 1 to Level 10</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              From foundational market mechanics to institutional orderflow, candlestick geometry,
              mathematical risk management, and master trader psychology.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-[#0a0f1d]/80 border border-[#1e293b] rounded-xl p-4 flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Curriculum Mastery</span>
              <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{completedCount} of {totalLessons} Levels Cleared</span>
              <button
                onClick={resetAcademyProgress}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
                title="Reset quiz progress"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Academy Grid: Left Levels List + Right Lesson Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 Levels Curriculum List */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
            Trading Mastery Roadmap
          </div>

          <div className="flex flex-col gap-2">
            {academyLessons.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              const isCompleted = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#142035] border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                      : 'bg-[#0f172a] border-[#1e293b] hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isSelected
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : `L${lesson.level}`}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{lesson.levelName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {lesson.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Lesson Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Lesson Header & Video Player */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            {/* YouTube Embed Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtubeId}?rel=0&modestbranding=1`}
                title={activeLesson.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Subtitle & Fallback bar */}
            <div className="px-6 py-2.5 bg-[#0a0f1d] border-b border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Official Soni Masterclass Lesson Stream
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${activeLesson.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Watch on YouTube</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>

            {/* Lesson Title & Summary */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#1e293b]">
                <div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                    {activeLesson.levelName}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                    {activeLesson.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {isLessonCompleted ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" /> Level Mastered
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      Complete quiz below to pass
                    </span>
                  )}
                </div>
              </div>

              {/* Written Lesson Guide */}
              <div className="mt-6 prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                <div className="whitespace-pre-line space-y-3 font-sans">
                  {activeLesson.content}
                </div>
              </div>

              {/* Key Takeaways Box */}
              <div className="mt-6 p-4 bg-[#0a0f1d] border border-[#1e293b] rounded-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Soni Core Principles &amp; Takeaways</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeLesson.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Quiz & Challenge Section */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <span>Level {activeLesson.level} Knowledge Check &amp; Challenge</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Answer the verification questions to certify your mastery of this trading level.
                </p>
              </div>

              {submittedQuiz && (
                <div className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  Score: {quizScore} / {activeLesson.quiz.length}
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {activeLesson.quiz.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div key={q.id} className="bg-[#0a0e17] border border-[#1e293b] rounded-xl p-4 flex flex-col gap-3">
                    <div className="text-sm font-semibold text-white flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">Q{qIndex + 1}.</span>
                      <span>{q.question}</span>
                    </div>

                    <div className="space-y-2 mt-1">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'bg-[#131d2e] border-[#1e293b] text-slate-300 hover:bg-slate-800';

                        if (submittedQuiz) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (userChoice === optIndex) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        } else if (userChoice === optIndex) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-white font-bold';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            disabled={submittedQuiz}
                          >
                            <span>{opt}</span>
                            {submittedQuiz && optIndex === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {submittedQuiz && (
                      <div
                        className={`p-3 rounded-lg text-xs mt-1 ${
                          isCorrect
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        <span className="font-bold">
                          {isCorrect ? 'Correct! ' : 'Incorrect: '}
                        </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {submittedQuiz ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedQuiz(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Retake Quiz
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                  className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-emerald-950/40 transition-all"
                >
                  Submit Answers &amp; Certify Level
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
