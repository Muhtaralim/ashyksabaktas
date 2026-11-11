import React, { useState } from 'react';
import { LessonProvider, useLesson } from './context/LessonContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { TeacherDashboard } from './components/TeacherDashboard';
import { OriginalComicSite } from './components/OriginalComicSite';
import { TeamGenerator } from './components/TeamGenerator';
import { MatchingGraphicTask } from './components/MatchingGraphicTask';
import { Quiz20Graphics } from './components/Quiz20Graphics';
import { TrueFalseBlitz } from './components/TrueFalseBlitz';
import { GradeBook } from './components/GradeBook';
import type { ClassroomSession } from './types/classroom';

const MainContent: React.FC<{ onLogout: () => void; teacherMode?: boolean; onOpenDashboard?: () => void }> = ({ onLogout, teacherMode = false, onOpenDashboard }) => {
  const { activeTab, setActiveTab, maxTotalScore, scores, setTaskScore } = useLesson();

  const renderSingleView = () => {
    switch (activeTab) {
      case 'comic':
        return <OriginalComicSite onScrollToTasks={() => setActiveTab('teams')} initialComicScores={scores} onComicScore={setTaskScore} />;
      case 'teams':
        return <TeamGenerator />;
      case 'task1':
        return <MatchingGraphicTask />;
      case 'task2':
        return <Quiz20Graphics />;
      case 'task3':
        return <TrueFalseBlitz />;
      case 'gradebook':
        return <GradeBook />;
      default:
        return <OriginalComicSite onScrollToTasks={() => setActiveTab('teams')} initialComicScores={scores} onComicScore={setTaskScore} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header onLogout={onLogout} teacherMode={teacherMode} onOpenDashboard={onOpenDashboard} />
      <main className="flex-1 pb-16">
        {renderSingleView()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-800">Компьютерлік графика және мультимедиа негіздері</span>
            <span className="mx-2">·</span>
            <span>Интерактивті оқу-әдістемелік кешен</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <button onClick={() => setActiveTab('comic')} className="text-blue-600 font-bold hover:underline">
              Оқу комиксі
            </button>
            <button onClick={() => setActiveTab('teams')} className="hover:text-blue-600">
              Топқа бөлу
            </button>
            <button onClick={() => setActiveTab('task1')} className="hover:text-blue-600">
              1-тапсырма (Wordwall)
            </button>
            <button onClick={() => setActiveTab('task2')} className="hover:text-blue-600">
              2-тапсырма (Wayground)
            </button>
            <button onClick={() => setActiveTab('task3')} className="hover:text-blue-600">
              3-тапсырма (Wordwall)
            </button>
            <button onClick={() => setActiveTab('gradebook')} className="text-blue-600 hover:underline">
              Бағалау парағы ({maxTotalScore} б.)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const TeacherWorkspace: React.FC<{ token: string; onLogout: () => void }> = ({ token, onLogout }) => {
  const [showProject, setShowProject] = useState(false);

  if (!showProject) {
    return <TeacherDashboard token={token} onLogout={onLogout} onOpenProject={() => setShowProject(true)} />;
  }

  return <MainContent onLogout={onLogout} teacherMode onOpenDashboard={() => setShowProject(false)} />;
};

export default function App() {
  const [session, setSession] = useState<ClassroomSession | null>(null);

  if (!session) return <LoginScreen onLogin={setSession} />;

  if (session.role === 'teacher') {
    return (
      <LessonProvider initialStudentName="Оқытушы" initialScores={{ task1: 0, task2: 0, task3: 0 }} persistProgress={false} classroomToken={session.token} canManageGroups>
        <TeacherWorkspace token={session.token} onLogout={() => setSession(null)} />
      </LessonProvider>
    );
  }

  return (
    <LessonProvider
      key={session.student.id}
      studentId={session.student.id}
      studentToken={session.token}
      classroomToken={session.token}
      initialStudentName={session.student.name}
      initialScores={session.student.scores}
    >
      <MainContent onLogout={() => setSession(null)} />
    </LessonProvider>
  );
}
