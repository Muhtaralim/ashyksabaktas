import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudentsList } from '../data/lessonData';
import { comicScoreMaxima, type ClassroomScores, type ComicScoreKey } from '../types/classroom';

export interface StudentScore extends ClassroomScores {
  lectureNotes: number; // Max 20 (Конспект жазу)
  task4: number; // Max 10 (Movie Maker викторина 10)
  task5: number; // Max 10 (Мультимедиа форматтары 10)
  task6: number; // Max 20 (Movie Maker жобалық жұмыс)
  task7: number; // Max 10 (Movie Maker 20 тест)
  task8AI: number; // Max 10 (ЖИ көмегімен жоба әзірлеу)
}

export interface GroupAssignment {
  group1: string[];
  group2: string[];
  group3: string[];
}

interface LessonContextType {
  studentName: string;
  setStudentName: (name: string) => void;
  selectedGroup: number;
  setSelectedGroup: (group: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scores: StudentScore;
  setTaskScore: (taskKey: keyof StudentScore, score: number) => void;
  groups: GroupAssignment;
  canManageGroups: boolean;
  setGroups: React.Dispatch<React.SetStateAction<GroupAssignment>>;
  divideIntoGroups: (studentNames: string[]) => Promise<boolean>;
  totalScore: number;
  maxTotalScore: number;
  percentageScore: number;
  gradeString: string;
  resetAllProgress: () => void;
}

interface LessonProviderProps {
  children: React.ReactNode;
  studentId?: string;
  studentToken?: string;
  initialStudentName?: string;
  initialScores?: Partial<StudentScore>;
  persistProgress?: boolean;
  classroomToken?: string;
  canManageGroups?: boolean;
}

const defaultScores: StudentScore = {
  task1: 0,
  task2: 0,
  task3: 0,
  comicAccess: 0,
  comicPixel: 0,
  comicVector: 0,
  comicFormats: 0,
  comicProject: 0,
  comicQuiz: 0,
  lectureNotes: 0,
  task4: 0,
  task5: 0,
  task6: 0,
  task7: 0,
  task8AI: 0,
};

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<LessonProviderProps> = ({
  children,
  studentId,
  studentToken,
  initialStudentName,
  initialScores,
  persistProgress = true,
  classroomToken,
  canManageGroups = false,
}) => {
  const [studentName, setStudentName] = useState<string>(() => {
    return initialStudentName || (persistProgress ? localStorage.getItem('lesson_student_name') : null) || 'Студент';
  });

  const [selectedGroup, setSelectedGroup] = useState<number>(() => {
    return (persistProgress && Number(localStorage.getItem('lesson_selected_group'))) || 1;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = persistProgress ? localStorage.getItem('lesson_active_tab') : null;
    if (!saved || saved === 'all') return 'comic';
    return saved;
  });

  const [scores, setScores] = useState<StudentScore>(() => {
    if (initialScores) return { ...defaultScores, ...initialScores };
    const saved = persistProgress ? localStorage.getItem('lesson_scores') : null;
    if (saved) {
      try {
        return { ...defaultScores, ...JSON.parse(saved) };
      } catch {
        return defaultScores;
      }
    }
    return defaultScores;
  });

  const [groups, setGroups] = useState<GroupAssignment>(() => {
    if (classroomToken) return { group1: [], group2: [], group3: [] };
    const saved = persistProgress ? localStorage.getItem('lesson_groups') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default initial distribution
    const shuffled = [...initialStudentsList];
    const g1: string[] = [];
    const g2: string[] = [];
    const g3: string[] = [];
    shuffled.forEach((name, i) => {
      if (i % 3 === 0) g1.push(name);
      else if (i % 3 === 1) g2.push(name);
      else g3.push(name);
    });
    return { group1: g1, group2: g2, group3: g3 };
  });

  useEffect(() => {
    if (!persistProgress) return;
    localStorage.setItem('lesson_student_name', studentName);
  }, [persistProgress, studentName]);

  useEffect(() => {
    if (!persistProgress) return;
    localStorage.setItem('lesson_selected_group', String(selectedGroup));
  }, [persistProgress, selectedGroup]);

  useEffect(() => {
    if (!persistProgress) return;
    localStorage.setItem('lesson_active_tab', activeTab);
  }, [activeTab, persistProgress]);

  useEffect(() => {
    if (!persistProgress) return;
    localStorage.setItem('lesson_scores', JSON.stringify(scores));
  }, [persistProgress, scores]);

  useEffect(() => {
    if (!studentId || !studentToken) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      fetch('/api/student/scores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          scores,
        }),
        signal: controller.signal,
      }).catch(error => {
        if (error.name !== 'AbortError') console.error('Ұпайларды синхрондау сәтсіз аяқталды.', error);
      });
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [scores, studentId, studentToken]);

  useEffect(() => {
    if (!persistProgress || classroomToken) return;
    localStorage.setItem('lesson_groups', JSON.stringify(groups));
  }, [classroomToken, groups, persistProgress]);

  useEffect(() => {
    if (!classroomToken) return;
    let isMounted = true;
    const loadGroups = async () => {
      try {
        const response = await fetch('/api/classroom/groups', {
          headers: { Authorization: `Bearer ${classroomToken}` },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Топтарды жүктеу мүмкін болмады.');
        const nextGroups = result.groups as GroupAssignment;
        if (!Array.isArray(nextGroups.group1) || !Array.isArray(nextGroups.group2) || !Array.isArray(nextGroups.group3)) return;
        if (isMounted) {
          setGroups(current => JSON.stringify(current) === JSON.stringify(nextGroups) ? current : nextGroups);
        }
      } catch (error) {
        if (isMounted) console.error('Ортақ топтарды жүктеу сәтсіз аяқталды.', error);
      }
    };

    void loadGroups();
    if (canManageGroups) return () => { isMounted = false; };

    const interval = window.setInterval(() => void loadGroups(), 5000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [canManageGroups, classroomToken]);

  const setTaskScore = (taskKey: keyof StudentScore, score: number) => {
    const maxScore = taskKey in comicScoreMaxima
      ? comicScoreMaxima[taskKey as ComicScoreKey]
      : taskKey.startsWith('task') ? 10 : 20;
    setScores(prev => ({
      ...prev,
      [taskKey]: Math.max(0, Math.min(maxScore, Math.round(score * 10) / 10))
    }));
  };

  const divideIntoGroups = async (studentNames: string[]) => {
    if (!canManageGroups) return false;
    const list = studentNames.filter(n => n.trim().length > 0);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const g1: string[] = [];
    const g2: string[] = [];
    const g3: string[] = [];
    shuffled.forEach((name, i) => {
      if (i % 3 === 0) g1.push(name);
      else if (i % 3 === 1) g2.push(name);
      else g3.push(name);
    });
    const nextGroups = { group1: g1, group2: g2, group3: g3 };
    setGroups(nextGroups);
    if (!classroomToken) return true;

    try {
      const response = await fetch('/api/teacher/groups', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${classroomToken}`,
        },
        body: JSON.stringify({ groups: nextGroups }),
      });
      return response.ok;
    } catch (error) {
      console.error('Топтарды сақтау сәтсіз аяқталды.', error);
      return false;
    }
  };

  const totalScore = Object.keys(comicScoreMaxima).reduce(
    (total, key) => total + scores[key as ComicScoreKey],
    0,
  );
  const maxTotalScore = Object.values(comicScoreMaxima).reduce((total, max) => total + max, 0);
  const percentageScore = Math.min(100, Math.round((totalScore / maxTotalScore) * 100));

  let gradeString = '3 (Қанағаттанарлық)';
  if (percentageScore >= 90) gradeString = '5 (Өте жақсы / Керемет)';
  else if (percentageScore >= 75) gradeString = '4 (Жақсы / Тамаша)';
  else if (percentageScore < 50) gradeString = 'Төмен (Қайта орындау қажет)';

  const resetAllProgress = () => {
    setScores(defaultScores);
    localStorage.removeItem('lesson_scores');
  };

  return (
    <LessonContext.Provider value={{
      studentName,
      setStudentName,
      selectedGroup,
      setSelectedGroup,
      activeTab,
      setActiveTab,
      scores,
      setTaskScore,
      groups,
      canManageGroups,
      setGroups,
      divideIntoGroups,
      totalScore,
      maxTotalScore,
      percentageScore,
      gradeString,
      resetAllProgress
    }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};
