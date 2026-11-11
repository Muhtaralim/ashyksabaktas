import 'dotenv/config';
import express from 'express';
import { createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

interface StudentRecord {
  id: string;
  name: string;
  scores: Record<string, number>;
  updatedAt: string;
}

interface ClassroomGroups {
  group1: string[];
  group2: string[];
  group3: string[];
}

const emptyClassroomGroups: ClassroomGroups = { group1: [], group2: [], group3: [] };

const scoreMaxima: Record<string, number> = {
  task1: 10,
  task2: 10,
  task3: 10,
  comicAccess: 10,
  comicPixel: 15,
  comicVector: 20,
  comicFormats: 15,
  comicProject: 20,
  comicQuiz: 20,
};
const defaultStudentScores = Object.fromEntries(Object.keys(scoreMaxima).map(key => [key, 0]));

const root = path.dirname(fileURLToPath(import.meta.url));
const runtimeDirectory = path.join(root, 'runtime-data');
const studentsFile = path.join(runtimeDirectory, 'classroom-progress.json');
const groupsFile = path.join(runtimeDirectory, 'classroom-groups.json');
const secretFile = path.join(runtimeDirectory, 'session-secret');
const teacherCodeFile = path.join(runtimeDirectory, 'teacher-access-code');
const teacherCode = process.env.TEACHER_ACCESS_CODE?.trim() || loadTeacherCode();
const sessionSecret = loadSessionSecret();
const app = express();
const isProduction = process.argv.includes('--production');

function ensureRuntimeDirectory() {
  mkdirSync(runtimeDirectory, { recursive: true });
}

function loadTeacherCode() {
  ensureRuntimeDirectory();
  if (existsSync(teacherCodeFile)) {
    return readFileSync(teacherCodeFile, 'utf8').trim();
  }

  const generatedCode = String(randomInt(10000000, 100000000));
  writeFileSync(teacherCodeFile, generatedCode, { mode: 0o600 });
  console.info(`Teacher access code: ${generatedCode}`);
  return generatedCode;
}

function loadSessionSecret() {
  ensureRuntimeDirectory();
  if (existsSync(secretFile)) return readFileSync(secretFile, 'utf8').trim();

  const secret = randomBytes(32).toString('hex');
  writeFileSync(secretFile, secret, { mode: 0o600 });
  return secret;
}

function readStudents(): StudentRecord[] {
  try {
    const records: unknown = JSON.parse(readFileSync(studentsFile, 'utf8'));
    return Array.isArray(records)
      ? records.map(record => ({ ...record, scores: { ...defaultStudentScores, ...record?.scores } })) as StudentRecord[]
      : [];
  } catch {
    return [];
  }
}

function writeStudents(records: StudentRecord[]) {
  ensureRuntimeDirectory();
  writeFileSync(studentsFile, JSON.stringify(records, null, 2), 'utf8');
}

function readClassroomGroups(): ClassroomGroups {
  try {
    const stored: unknown = JSON.parse(readFileSync(groupsFile, 'utf8'));
    if (!stored || typeof stored !== 'object') return { ...emptyClassroomGroups };
    const groups = stored as Record<keyof ClassroomGroups, unknown>;
    return {
      group1: Array.isArray(groups.group1) ? groups.group1.filter((name): name is string => typeof name === 'string') : [],
      group2: Array.isArray(groups.group2) ? groups.group2.filter((name): name is string => typeof name === 'string') : [],
      group3: Array.isArray(groups.group3) ? groups.group3.filter((name): name is string => typeof name === 'string') : [],
    };
  } catch {
    return { ...emptyClassroomGroups };
  }
}

function writeClassroomGroups(groups: ClassroomGroups) {
  ensureRuntimeDirectory();
  writeFileSync(groupsFile, JSON.stringify(groups, null, 2), 'utf8');
}

function makeToken(role: 'student' | 'teacher', id: string) {
  const payload = Buffer.from(`${role}:${id}`).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function readToken(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    const [role, id] = Buffer.from(payload, 'base64url').toString('utf8').split(':');
    if ((role !== 'student' && role !== 'teacher') || !id) return null;
    return { role, id };
  } catch {
    return null;
  }
}

function bearerToken(request: express.Request) {
  const authorization = request.header('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
}

function isValidCode(candidate: string) {
  const candidateBuffer = Buffer.from(candidate);
  const configuredBuffer = Buffer.from(teacherCode);
  return candidateBuffer.length === configuredBuffer.length && timingSafeEqual(candidateBuffer, configuredBuffer);
}

const failedTeacherAttempts = new Map<string, { count: number; resetAt: number }>();

app.use(express.json({ limit: '16kb' }));

app.post('/api/student/session', (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
  if (name.length < 2 || name.length > 80) {
    response.status(400).json({ error: 'Аты-жөніңізді 2–80 таңба аралығында енгізіңіз.' });
    return;
  }

  const id = typeof request.body?.id === 'string' && /^[\w-]{8,80}$/.test(request.body.id)
    ? request.body.id
    : randomUUID();
  const records = readStudents();
  let student = records.find(record => record.id === id);
  if (student) {
    student.name = name;
  } else {
    student = { id, name, scores: { ...defaultStudentScores }, updatedAt: new Date().toISOString() };
    records.push(student);
  }
  student.updatedAt = new Date().toISOString();
  writeStudents(records);
  response.json({ student, token: makeToken('student', id) });
});

app.put('/api/student/scores', (request, response) => {
  const token = readToken(bearerToken(request));
  if (!token || token.role !== 'student') {
    response.status(401).json({ error: 'Студент ретінде қайта кіріңіз.' });
    return;
  }

  const records = readStudents();
  const student = records.find(record => record.id === token.id);
  if (!student) {
    response.status(404).json({ error: 'Студент жазбасы табылмады.' });
    return;
  }

  const nextScores = request.body?.scores;
  if (!nextScores || !['task1', 'task2', 'task3'].every(key => Number.isFinite(nextScores[key]))
    || Object.keys(nextScores).some(key => key in scoreMaxima && !Number.isFinite(nextScores[key]))) {
    response.status(400).json({ error: 'Ұпайлар дұрыс форматта емес.' });
    return;
  }

  student.scores = Object.fromEntries(Object.entries(scoreMaxima).map(([key, max]) => {
    const score = Number.isFinite(nextScores[key]) ? nextScores[key] : student.scores[key] ?? 0;
    return [key, Math.max(0, Math.min(max, Math.round(score * 10) / 10))];
  }));
  student.updatedAt = new Date().toISOString();
  writeStudents(records);
  response.json({ student });
});

app.post('/api/teacher/login', (request, response) => {
  const clientIp = request.ip ?? request.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const attempts = failedTeacherAttempts.get(clientIp);
  if (attempts && attempts.resetAt > now && attempts.count >= 8) {
    response.status(429).json({ error: 'Көп рет қате код енгізілді. Бір минуттан кейін қайталаңыз.' });
    return;
  }

  const code = typeof request.body?.code === 'string' ? request.body.code : '';
  if (!isValidCode(code)) {
    const next = attempts && attempts.resetAt > now
      ? { count: attempts.count + 1, resetAt: attempts.resetAt }
      : { count: 1, resetAt: now + 60_000 };
    failedTeacherAttempts.set(clientIp, next);
    response.status(401).json({ error: 'Оқытушы коды қате.' });
    return;
  }

  failedTeacherAttempts.delete(clientIp);
  response.json({ token: makeToken('teacher', randomUUID()) });
});

app.get('/api/teacher/students', (request, response) => {
  const token = readToken(bearerToken(request));
  if (!token || token.role !== 'teacher') {
    response.status(401).json({ error: 'Оқытушы ретінде кіріңіз.' });
    return;
  }
  response.json({ students: readStudents() });
});

app.get('/api/classroom/groups', (request, response) => {
  const token = readToken(bearerToken(request));
  if (!token) {
    response.status(401).json({ error: 'Сынып топтарын көру үшін жүйеге кіріңіз.' });
    return;
  }
  response.json({ groups: readClassroomGroups() });
});

app.put('/api/teacher/groups', (request, response) => {
  const token = readToken(bearerToken(request));
  if (!token || token.role !== 'teacher') {
    response.status(401).json({ error: 'Топтарды сақтау үшін оқытушы ретінде кіріңіз.' });
    return;
  }

  const submittedGroups = request.body?.groups;
  if (!submittedGroups || typeof submittedGroups !== 'object') {
    response.status(400).json({ error: 'Топ құрамы дұрыс форматта емес.' });
    return;
  }

  const groups: ClassroomGroups = { group1: [], group2: [], group3: [] };
  let totalMembers = 0;
  for (const key of Object.keys(groups) as Array<keyof ClassroomGroups>) {
    const members: unknown = submittedGroups[key];
    if (!Array.isArray(members) || members.length > 100
      || members.some(name => typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 80)) {
      response.status(400).json({ error: 'Топтағы студенттер тізімі дұрыс емес.' });
      return;
    }
    groups[key] = members.map(name => (name as string).trim());
    totalMembers += groups[key].length;
  }

  if (totalMembers > 200) {
    response.status(400).json({ error: 'Студенттер саны рұқсат етілген шектен асты.' });
    return;
  }

  writeClassroomGroups(groups);
  response.json({ groups });
});

app.delete('/api/teacher/students/:id', (request, response) => {
  const token = readToken(bearerToken(request));
  if (!token || token.role !== 'teacher') {
    response.status(401).json({ error: 'Оқытушы ретінде кіріңіз.' });
    return;
  }

  const records = readStudents();
  const remainingStudents = records.filter(student => student.id !== request.params.id);
  if (remainingStudents.length === records.length) {
    response.status(404).json({ error: 'Студент табылмады.' });
    return;
  }

  writeStudents(remainingStudents);
  response.json({ success: true });
});

async function start() {
  if (isProduction) {
    const distDirectory = path.join(root, 'dist');
    app.use(express.static(distDirectory));
    app.get('*', (_request, response) => response.sendFile(path.join(distDirectory, 'index.html')));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
    app.use(vite.middlewares);
    app.use(async (request, response, next) => {
      if (request.path.startsWith('/api/')) {
        response.status(404).json({ error: 'API жолы табылмады.' });
        return;
      }

      try {
        const template = readFileSync(path.join(root, 'index.html'), 'utf8');
        const html = await vite.transformIndexHtml(request.originalUrl, template);
        response.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.info(`Classroom site ready at http://localhost:${port}`);
    console.info(`Phone access: use this computer's local network IP on port ${port}.`);
  });
}

start().catch(error => {
  console.error(error);
  process.exitCode = 1;
});