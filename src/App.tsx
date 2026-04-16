import { useState, useEffect, useRef } from 'react';

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({
  d,
  size = 20,
  stroke = 'currentColor',
  fill = 'none',
  strokeWidth = 1.8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? (
      d.map((path, i) => <path key={i} d={path} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  tasks: [
    'M9 11l3 3L22 4',
    'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  ],
  courses:
    'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  study:
    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  habits: 'M22 11.08V12a10 10 0 1 1-5.93-9.14',
  expenses: ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  menu: ['M3 12h18', 'M3 6h18', 'M3 18h18'],
  plus: ['M12 5v14', 'M5 12h14'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6'],
  edit: [
    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
    'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  ],
  check: 'M20 6L9 17l-5-5',
  x: ['M18 6L6 18', 'M6 6l12 12'],
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  flame:
    'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z',
  calendar: ['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  clock: [
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 6v6l4 2',
  ],
  target: [
    'M22 12A10 10 0 1 1 12 2',
    'M22 12a10 10 0 0 1-10 10',
    'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  ],
  trending: ['M22 7l-11.5 11.5-4.5-4.5L2 18'],
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

// ─── Utility ──────────────────────────────────────────────────────────────────
const useLocalStorage = (key, init) => {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal];
};

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().split('T')[0];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// ─── Progress Ring ────────────────────────────────────────────────────────────
const ProgressRing = ({
  value,
  max,
  size = 80,
  stroke = 6,
  color = '#6366f1',
  label,
  sublabel,
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div
          style={{
            fontSize: size < 70 ? 12 : 15,
            fontWeight: 700,
            color: '#f1f5f9',
            lineHeight: 1,
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontSize: 9,
              color: 'rgba(241,245,249,0.45)',
              marginTop: 2,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data, color = '#6366f1', height = 80 }) => {
  const max = Math.max(...data.map((d) => d.val), 1);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height,
        paddingTop: 4,
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div
            style={{
              width: '100%',
              borderRadius: 4,
              background: color,
              opacity: d.val ? 0.85 : 0.15,
              height: `${(d.val / max) * (height - 20)}px`,
              minHeight: d.val ? 4 : 0,
              transition: 'height 0.6s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: 'rgba(241,245,249,0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    display: 'flex',
    height: '100vh',
    background: '#080c14',
    fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
    color: '#e2e8f0',
    overflow: 'hidden',
  },
  sidebar: (collapsed) => ({
    width: collapsed ? 68 : 240,
    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
    background: 'rgba(15,20,35,0.95)',
    borderRight: '1px solid rgba(99,102,241,0.1)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    backdropFilter: 'blur(20px)',
    position: 'relative',
    zIndex: 10,
  }),
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background:
      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 0 20px rgba(99,102,241,0.4)',
  },
  logoText: {
    fontSize: 13,
    fontWeight: 700,
    color: '#f1f5f9',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(241,245,249,0.4)',
    whiteSpace: 'nowrap',
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
  },
  navItem: (active, collapsed) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: collapsed ? '10px 14px' : '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
    color: active ? '#a5b4fc' : 'rgba(226,232,240,0.55)',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    border: active
      ? '1px solid rgba(99,102,241,0.25)'
      : '1px solid transparent',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    position: 'relative',
  }),
  sidebarToggle: {
    position: 'absolute',
    right: -12,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#1e2540',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 20,
    color: '#a5b4fc',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  topbar: {
    padding: '16px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(8,12,20,0.8)',
    backdropFilter: 'blur(20px)',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  card: (glow = false) => ({
    background: 'rgba(15,22,40,0.7)',
    borderRadius: 16,
    border: `1px solid ${
      glow ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'
    }`,
    backdropFilter: 'blur(20px)',
    boxShadow: glow
      ? '0 0 30px rgba(99,102,241,0.12)'
      : '0 4px 20px rgba(0,0,0,0.3)',
    padding: '20px 22px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }),
  grid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 16,
  }),
  badge: (color) => ({
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: `${color}22`,
    color,
    border: `1px solid ${color}44`,
  }),
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  select: {
    background: 'rgba(30,37,64,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
  },
  btn: (variant = 'primary') => ({
    padding: '10px 18px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    background:
      variant === 'primary'
        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        : variant === 'ghost'
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(239,68,68,0.15)',
    color: variant === 'danger' ? '#f87171' : '#fff',
    boxShadow: variant === 'primary' ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
  }),
  label: {
    fontSize: 11,
    color: 'rgba(226,232,240,0.5)',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 6,
    display: 'block',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: 'rgba(226,232,240,0.45)',
    marginBottom: 20,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    boxShadow: '0 0 15px rgba(99,102,241,0.4)',
  },
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const seedTasks = [
  {
    id: uid(),
    title: 'Review linear algebra notes',
    category: 'Study',
    done: false,
    created: today(),
  },
  {
    id: uid(),
    title: 'Morning run 5km',
    category: 'Gym',
    done: true,
    created: today(),
  },
  {
    id: uid(),
    title: 'Complete React project',
    category: 'Work',
    done: false,
    created: today(),
  },
  {
    id: uid(),
    title: 'Call family',
    category: 'Personal',
    done: false,
    created: today(),
  },
  {
    id: uid(),
    title: 'Read 30 pages',
    category: 'Study',
    done: true,
    created: today(),
  },
];
const seedCourses = [
  {
    id: uid(),
    name: 'Advanced Mathematics',
    days: ['Mon', 'Wed', 'Fri'],
    time: '09:00',
    platform: 'Offline',
    color: '#6366f1',
  },
  {
    id: uid(),
    name: 'Web Development Bootcamp',
    days: ['Tue', 'Thu'],
    time: '14:00',
    platform: 'Online',
    color: '#8b5cf6',
  },
  {
    id: uid(),
    name: 'Data Structures & Algorithms',
    days: ['Mon', 'Thu'],
    time: '11:00',
    platform: 'Online',
    color: '#06b6d4',
  },
  {
    id: uid(),
    name: 'English Communication',
    days: ['Sat'],
    time: '10:00',
    platform: 'Offline',
    color: '#10b981',
  },
];
const seedHabits = [
  { id: uid(), name: 'Morning Meditation', icon: '🧘', streak: 7, log: {} },
  { id: uid(), name: 'Read 30 mins', icon: '📖', streak: 12, log: {} },
  { id: uid(), name: 'Exercise', icon: '💪', streak: 5, log: {} },
  { id: uid(), name: 'Drink 8 glasses water', icon: '💧', streak: 3, log: {} },
  {
    id: uid(),
    name: 'No Social Media before 10am',
    icon: '📵',
    streak: 9,
    log: {},
  },
];
const seedExpenses = [
  {
    id: uid(),
    desc: 'University fees',
    amount: 2500,
    category: 'Education',
    date: today(),
  },
  {
    id: uid(),
    desc: 'Gym membership',
    amount: 150,
    category: 'Health',
    date: today(),
  },
  {
    id: uid(),
    desc: 'Groceries',
    amount: 340,
    category: 'Food',
    date: today(),
  },
  {
    id: uid(),
    desc: 'Online courses',
    amount: 89,
    category: 'Education',
    date: today(),
  },
  {
    id: uid(),
    desc: 'Transport',
    amount: 120,
    category: 'Transport',
    date: today(),
  },
];
const seedStudy = [
  { id: uid(), subject: 'Mathematics', hours: 3, date: today() },
  { id: uid(), subject: 'Programming', hours: 4.5, date: today() },
];

// ─── CATEGORY COLORS ──────────────────────────────────────────────────────────
const catColor = {
  Study: '#6366f1',
  Gym: '#10b981',
  Work: '#f59e0b',
  Personal: '#ec4899',
};
const expCatColor = {
  Education: '#6366f1',
  Health: '#10b981',
  Food: '#f59e0b',
  Transport: '#06b6d4',
  Other: '#8b5cf6',
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ tasks, courses, habits, expenses, study }) {
  const doneTasks = tasks.filter((t) => t.done).length;
  const totalStudy = study.reduce((s, r) => s + r.hours, 0);
  const todayHabits = habits.filter((h) => h.log[today()]).length;
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return {
      label: dayNames[d.getDay()],
      val: study
        .filter((s) => s.date === d.toISOString().split('T')[0])
        .reduce((a, s) => a + s.hours, 0),
    };
  });

  const stats = [
    {
      label: 'Tasks Done',
      value: doneTasks,
      max: Math.max(tasks.length, 1),
      suffix: `/${tasks.length}`,
      color: '#6366f1',
      icon: icons.tasks,
    },
    {
      label: 'Study Hours',
      value: totalStudy,
      max: 10,
      suffix: 'hrs',
      color: '#8b5cf6',
      icon: icons.study,
    },
    {
      label: 'Habits Today',
      value: todayHabits,
      max: Math.max(habits.length, 1),
      suffix: `/${habits.length}`,
      color: '#06b6d4',
      icon: icons.habits,
    },
    {
      label: 'Expenses',
      value: totalExp,
      max: 5000,
      suffix: ' EGP',
      color: '#f59e0b',
      icon: icons.expenses,
    },
  ];

  const todayCourses = courses.filter((c) =>
    c.days.includes(dayNames[new Date().getDay()])
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Welcome */}
      <div
        style={{
          ...S.card(true),
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(15,22,40,0.7) 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: '#a5b4fc',
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome back, Anas 👋
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'rgba(226,232,240,0.5)',
                marginTop: 4,
              }}
            >
              You have{' '}
              <span style={{ color: '#a5b4fc', fontWeight: 600 }}>
                {tasks.filter((t) => !t.done).length} pending tasks
              </span>{' '}
              and{' '}
              <span style={{ color: '#67e8f9', fontWeight: 600 }}>
                {todayCourses.length} courses
              </span>{' '}
              today.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                background: 'linear-gradient(135deg,#a5b4fc,#c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {Math.round((doneTasks / Math.max(tasks.length, 1)) * 100)}%
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(226,232,240,0.4)',
                marginTop: 2,
              }}
            >
              COMPLETION
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={S.grid(4)}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              ...S.card(),
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <ProgressRing
              value={s.value}
              max={s.max}
              size={64}
              stroke={5}
              color={s.color}
              label={`${Math.round((s.value / s.max) * 100)}%`}
              sublabel="done"
            />
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(226,232,240,0.45)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#f1f5f9',
                  marginTop: 2,
                }}
              >
                {s.value.toFixed(s.suffix.includes('hrs') ? 1 : 0)}
                <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)' }}>
                  {s.suffix}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid(2)}>
        {/* Study chart */}
        <div style={S.card()}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Study Activity
            </div>
            <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)' }}>
              Last 7 days · hours
            </div>
          </div>
          <BarChart data={weekDays} color="#6366f1" height={100} />
        </div>

        {/* Today's courses */}
        <div style={S.card()}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Today's Schedule
            </div>
            <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
          </div>
          {todayCourses.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '20px 0',
                color: 'rgba(226,232,240,0.3)',
                fontSize: 13,
              }}
            >
              No courses today 🎉
            </div>
          ) : (
            todayCourses.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 36,
                    borderRadius: 2,
                    background: c.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>
                    {c.time} · {c.platform}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent tasks + habits */}
      <div style={S.grid(2)}>
        <div style={S.card()}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            Recent Tasks
          </div>
          {tasks.slice(0, 5).map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: t.done ? '#6366f1' : 'transparent',
                  border: `2px solid ${
                    t.done ? '#6366f1' : 'rgba(255,255,255,0.2)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {t.done && <Icon d={icons.check} size={10} strokeWidth={3} />}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: t.done ? 'rgba(226,232,240,0.35)' : '#e2e8f0',
                  textDecoration: t.done ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {t.title}
              </span>
              <span style={S.badge(catColor[t.category] || '#6366f1')}>
                {t.category}
              </span>
            </div>
          ))}
        </div>

        <div style={S.card()}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            Habit Streaks
          </div>
          {habits.slice(0, 5).map((h) => (
            <div
              key={h.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{ fontSize: 18 }}>{h.icon}</span>
              <span style={{ fontSize: 13, color: '#e2e8f0', flex: 1 }}>
                {h.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon d={icons.flame} size={14} fill="#f59e0b" stroke="none" />
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}
                >
                  {h.streak}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TASKS ────────────────────────────────────────────────────────────────────
function Tasks({ tasks, setTasks }) {
  const [form, setForm] = useState({ title: '', category: 'Study' });
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Study', 'Gym', 'Work', 'Personal'];
  const filtered = tasks.filter(
    (t) => filter === 'All' || t.category === filter
  );

  const add = () => {
    if (!form.title.trim()) return;
    setTasks((p) => [
      ...p,
      { id: uid(), ...form, done: false, created: today() },
    ]);
    setForm({ title: '', category: 'Study' });
  };
  const toggle = (id) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks((p) => p.filter((t) => t.id !== id));

  const pending = tasks.filter((t) => !t.done).length;
  const done = tasks.filter((t) => t.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={S.sectionTitle}>Task Manager</div>
        <div style={S.sectionSub}>
          {pending} pending · {done} completed
        </div>
      </div>

      {/* Add form */}
      <div style={S.card(true)}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            style={{ ...S.input, flex: 2, minWidth: 200 }}
            placeholder="Add a new task..."
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <select
            style={{ ...S.select, flex: 1, minWidth: 120 }}
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
          >
            {['Study', 'Gym', 'Work', 'Personal'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button style={S.btn()} onClick={add}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={icons.plus} size={15} strokeWidth={2.5} /> Add Task
            </div>
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={{
              ...S.btn(filter === c ? 'primary' : 'ghost'),
              padding: '7px 16px',
              fontSize: 12,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div
            style={{
              ...S.card(),
              textAlign: 'center',
              padding: '40px',
              color: 'rgba(226,232,240,0.3)',
            }}
          >
            No tasks here yet ✨
          </div>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            style={{
              ...S.card(),
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: t.done ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <button
              onClick={() => toggle(t.id)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                flexShrink: 0,
                cursor: 'pointer',
                background: t.done ? '#6366f1' : 'transparent',
                border: `2px solid ${
                  t.done ? '#6366f1' : 'rgba(255,255,255,0.2)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {t.done && <Icon d={icons.check} size={12} strokeWidth={3} />}
            </button>
            <span
              style={{
                flex: 1,
                fontSize: 14,
                color: '#e2e8f0',
                textDecoration: t.done ? 'line-through' : 'none',
              }}
            >
              {t.title}
            </span>
            <span style={S.badge(catColor[t.category] || '#6366f1')}>
              {t.category}
            </span>
            <button
              onClick={() => remove(t.id)}
              style={{
                ...S.btn('ghost'),
                padding: '6px 8px',
                color: '#f87171',
                display: 'flex',
              }}
            >
              <Icon d={icons.trash} size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COURSES ──────────────────────────────────────────────────────────────────
function Courses({ courses, setCourses }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    days: [],
    time: '09:00',
    platform: 'Online',
  });
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ec4899',
    '#ef4444',
  ];
  const [colorIdx, setColorIdx] = useState(0);
  const todayDay = dayNames[new Date().getDay()];

  const toggleDay = (d) =>
    setForm((p) => ({
      ...p,
      days: p.days.includes(d) ? p.days.filter((x) => x !== d) : [...p.days, d],
    }));

  const add = () => {
    if (!form.name.trim() || !form.days.length) return;
    setCourses((p) => [...p, { id: uid(), ...form, color: colors[colorIdx] }]);
    setForm({ name: '', days: [], time: '09:00', platform: 'Online' });
    setColorIdx((i) => (i + 1) % colors.length);
    setShow(false);
  };
  const remove = (id) => setCourses((p) => p.filter((c) => c.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={S.sectionTitle}>Course & Schedule</div>
          <div style={S.sectionSub}>{courses.length} courses enrolled</div>
        </div>
        <button style={S.btn()} onClick={() => setShow((s) => !s)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={icons.plus} size={15} strokeWidth={2.5} /> Add Course
          </div>
        </button>
      </div>

      {show && (
        <div style={S.card(true)}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            New Course
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={S.label}>Course Name</label>
              <input
                style={S.input}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Advanced Mathematics"
              />
            </div>
            <div>
              <label style={S.label}>Days</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {dayNames.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: form.days.includes(d)
                        ? '#6366f1'
                        : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${
                        form.days.includes(d)
                          ? '#6366f1'
                          : 'rgba(255,255,255,0.1)'
                      }`,
                      color: form.days.includes(d)
                        ? '#fff'
                        : 'rgba(226,232,240,0.6)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={S.grid(2)}>
              <div>
                <label style={S.label}>Time</label>
                <input
                  type="time"
                  style={S.input}
                  value={form.time}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, time: e.target.value }))
                  }
                />
              </div>
              <div>
                <label style={S.label}>Platform</label>
                <select
                  style={S.select}
                  value={form.platform}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, platform: e.target.value }))
                  }
                >
                  <option>Online</option>
                  <option>Offline</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={S.btn()} onClick={add}>
                Save Course
              </button>
              <button style={S.btn('ghost')} onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly calendar */}
      <div style={S.card()}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 16,
          }}
        >
          Weekly Schedule
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 8,
          }}
        >
          {dayNames.map((d) => {
            const dayCourses = courses.filter((c) => c.days.includes(d));
            const isToday = d === todayDay;
            return (
              <div
                key={d}
                style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '6px 4px',
                    borderRadius: 8,
                    background: isToday
                      ? 'rgba(99,102,241,0.2)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${
                      isToday
                        ? 'rgba(99,102,241,0.4)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isToday ? '#a5b4fc' : 'rgba(226,232,240,0.5)',
                    }}
                  >
                    {d}
                  </div>
                </div>
                {dayCourses.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 600,
                      background: `${c.color}18`,
                      border: `1px solid ${c.color}33`,
                      color: c.color,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.time}
                    <br />
                    <span style={{ fontWeight: 400, opacity: 0.8 }}>
                      {c.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Course cards */}
      <div style={S.grid(2)}>
        {courses.map((c) => (
          <div
            key={c.id}
            style={{
              ...S.card(),
              borderLeft: `3px solid ${c.color}`,
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#f1f5f9',
                    marginBottom: 6,
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    flexWrap: 'wrap',
                    marginBottom: 8,
                  }}
                >
                  {c.days.map((d) => (
                    <span key={d} style={{ ...S.badge(c.color), fontSize: 10 }}>
                      {d}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'rgba(226,232,240,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Icon d={icons.clock} size={12} /> {c.time}
                  </span>
                  <span
                    style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)' }}
                  >
                    📡 {c.platform}
                  </span>
                </div>
              </div>
              <button
                onClick={() => remove(c.id)}
                style={{
                  ...S.btn('ghost'),
                  padding: '6px',
                  color: '#f87171',
                  display: 'flex',
                }}
              >
                <Icon d={icons.trash} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STUDY ────────────────────────────────────────────────────────────────────
function Study({ study, setStudy }) {
  const [form, setForm] = useState({ subject: '', hours: '' });
  const total = study.reduce((s, r) => s + r.hours, 0);
  const subjects = [...new Set(study.map((s) => s.subject))];

  const add = () => {
    if (!form.subject.trim() || !form.hours) return;
    setStudy((p) => [
      ...p,
      {
        id: uid(),
        subject: form.subject,
        hours: parseFloat(form.hours),
        date: today(),
      },
    ]);
    setForm({ subject: '', hours: '' });
  };
  const remove = (id) => setStudy((p) => p.filter((s) => s.id !== id));

  const bySubject = subjects.map((s) => ({
    label: s.slice(0, 6),
    val: study.filter((r) => r.subject === s).reduce((a, r) => a + r.hours, 0),
  }));

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      label: dayNames[d.getDay()],
      val: study
        .filter((s) => s.date === dateStr)
        .reduce((a, s) => a + s.hours, 0),
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={S.sectionTitle}>Study Tracker</div>
        <div style={S.sectionSub}>{total.toFixed(1)} total hours logged</div>
      </div>

      <div style={S.grid(3)}>
        {[
          { label: 'Total Hours', value: total.toFixed(1), color: '#6366f1' },
          { label: 'Sessions', value: study.length, color: '#8b5cf6' },
          { label: 'Subjects', value: subjects.length, color: '#06b6d4' },
        ].map((s, i) => (
          <div
            key={i}
            style={{ ...S.card(), textAlign: 'center', padding: '24px 16px' }}
          >
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(226,232,240,0.45)',
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={S.card(true)}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 14,
          }}
        >
          Log Study Session
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            style={{ ...S.input, flex: 2, minWidth: 160 }}
            placeholder="Subject (e.g. Mathematics)"
            value={form.subject}
            onChange={(e) =>
              setForm((p) => ({ ...p, subject: e.target.value }))
            }
          />
          <input
            style={{ ...S.input, flex: 1, minWidth: 100 }}
            type="number"
            placeholder="Hours"
            min="0.5"
            max="12"
            step="0.5"
            value={form.hours}
            onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))}
          />
          <button style={S.btn()} onClick={add}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={icons.plus} size={15} strokeWidth={2.5} /> Log
            </div>
          </button>
        </div>
      </div>

      <div style={S.grid(2)}>
        <div style={S.card()}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            Weekly Activity
          </div>
          <BarChart data={weekData} color="#8b5cf6" height={110} />
        </div>
        <div style={S.card()}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            By Subject
          </div>
          {bySubject.length > 0 ? (
            <BarChart data={bySubject} color="#06b6d4" height={110} />
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '30px',
                color: 'rgba(226,232,240,0.3)',
                fontSize: 13,
              }}
            >
              No sessions yet
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {study
          .slice()
          .reverse()
          .map((s) => (
            <div
              key={s.id}
              style={{
                ...S.card(),
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a5b4fc',
                  flexShrink: 0,
                }}
              >
                <Icon d={icons.study} size={18} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}
                >
                  {s.subject}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>
                  {s.date}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#a5b4fc' }}>
                {s.hours}h
              </div>
              <button
                onClick={() => remove(s.id)}
                style={{
                  ...S.btn('ghost'),
                  padding: '6px',
                  color: '#f87171',
                  display: 'flex',
                }}
              >
                <Icon d={icons.trash} size={14} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── HABITS ───────────────────────────────────────────────────────────────────
function Habits({ habits, setHabits }) {
  const [form, setForm] = useState({ name: '', icon: '⭐' });
  const icons_list = [
    '⭐',
    '🧘',
    '📖',
    '💪',
    '💧',
    '🍎',
    '🎯',
    '🏃',
    '✍️',
    '🎵',
    '🌙',
    '☀️',
    '🧠',
    '💊',
    '🚫',
  ];

  const add = () => {
    if (!form.name.trim()) return;
    setHabits((p) => [...p, { id: uid(), ...form, streak: 0, log: {} }]);
    setForm({ name: '', icon: '⭐' });
  };
  const toggle = (id) =>
    setHabits((p) =>
      p.map((h) => {
        if (h.id !== id) return h;
        const log = { ...h.log };
        const t = today();
        if (log[t]) {
          delete log[t];
          return { ...h, log, streak: Math.max(0, h.streak - 1) };
        } else {
          log[t] = true;
          return { ...h, log, streak: h.streak + 1 };
        }
      })
    );
  const remove = (id) => setHabits((p) => p.filter((h) => h.id !== id));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={S.sectionTitle}>Habit Tracker</div>
        <div style={S.sectionSub}>
          {habits.filter((h) => h.log[today()]).length}/{habits.length}{' '}
          completed today
        </div>
      </div>

      <div style={S.card(true)}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 12,
          }}
        >
          Add New Habit
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          <input
            style={{ ...S.input, flex: 2, minWidth: 180 }}
            placeholder="Habit name..."
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <button style={S.btn()} onClick={add}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={icons.plus} size={15} strokeWidth={2.5} /> Add
            </div>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {icons_list.map((ic) => (
            <button
              key={ic}
              onClick={() => setForm((p) => ({ ...p, icon: ic }))}
              style={{
                fontSize: 20,
                background:
                  form.icon === ic ? 'rgba(99,102,241,0.2)' : 'transparent',
                border: `1px solid ${
                  form.icon === ic ? 'rgba(99,102,241,0.4)' : 'transparent'
                }`,
                borderRadius: 8,
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {habits.map((h) => {
          const doneToday = !!h.log[today()];
          return (
            <div
              key={h.id}
              style={{
                ...S.card(),
                border: doneToday
                  ? '1px solid rgba(16,185,129,0.3)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#f1f5f9',
                      marginBottom: 6,
                    }}
                  >
                    {h.name}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {last7.map((d) => (
                      <div
                        key={d}
                        title={d}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          background: h.log[d]
                            ? '#10b981'
                            : 'rgba(255,255,255,0.06)',
                          border:
                            d === today()
                              ? '1px solid rgba(255,255,255,0.2)'
                              : 'none',
                          transition: 'background 0.2s',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginRight: 8 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Icon
                      d={icons.flame}
                      size={16}
                      fill="#f59e0b"
                      stroke="none"
                    />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: '#fbbf24',
                      }}
                    >
                      {h.streak}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.4)' }}>
                    streak
                  </div>
                </div>
                <button
                  onClick={() => toggle(h.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: doneToday
                      ? '#10b981'
                      : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${
                      doneToday ? '#10b981' : 'rgba(255,255,255,0.15)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon d={icons.check} size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => remove(h.id)}
                  style={{
                    ...S.btn('ghost'),
                    padding: '6px',
                    color: '#f87171',
                    display: 'flex',
                  }}
                >
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EXPENSES ────────────────────────────────────────────────────────────────
function Expenses({ expenses, setExpenses }) {
  const [form, setForm] = useState({ desc: '', amount: '', category: 'Food' });
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const add = () => {
    if (!form.desc.trim() || !form.amount) return;
    setExpenses((p) => [
      ...p,
      {
        id: uid(),
        desc: form.desc,
        amount: parseFloat(form.amount),
        category: form.category,
        date: today(),
      },
    ]);
    setForm({ desc: '', amount: '', category: 'Food' });
  };
  const remove = (id) => setExpenses((p) => p.filter((e) => e.id !== id));

  const cats = Object.keys(expCatColor);
  const byCategory = cats
    .map((c) => ({
      label: c.slice(0, 5),
      val: expenses
        .filter((e) => e.category === c)
        .reduce((a, e) => a + e.amount, 0),
    }))
    .filter((c) => c.val > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={S.sectionTitle}>Expense Tracker</div>
        <div style={S.sectionSub}>Total: {total.toLocaleString()} EGP</div>
      </div>

      <div style={S.grid(3)}>
        {cats.map((c) => {
          const amt = expenses
            .filter((e) => e.category === c)
            .reduce((a, e) => a + e.amount, 0);
          return (
            <div
              key={c}
              style={{ ...S.card(), borderLeft: `3px solid ${expCatColor[c]}` }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(226,232,240,0.45)',
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {c.toUpperCase()}
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 800, color: expCatColor[c] }}
              >
                {amt.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>
                EGP
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.card(true)}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 14,
          }}
        >
          Add Expense
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            style={{ ...S.input, flex: 2, minWidth: 160 }}
            placeholder="Description..."
            value={form.desc}
            onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
          />
          <input
            style={{ ...S.input, flex: 1, minWidth: 100 }}
            type="number"
            placeholder="Amount (EGP)"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          />
          <select
            style={{ ...S.select, flex: 1, minWidth: 120 }}
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
          >
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button style={S.btn()} onClick={add}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={icons.plus} size={15} strokeWidth={2.5} /> Add
            </div>
          </button>
        </div>
      </div>

      <div style={S.grid(2)}>
        <div style={S.card()}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            By Category
          </div>
          <BarChart data={byCategory} color="#f59e0b" height={100} />
        </div>
        <div style={S.card()}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 14,
            }}
          >
            Budget Usage
          </div>
          <ProgressRing
            value={total}
            max={5000}
            size={100}
            stroke={8}
            color="#f59e0b"
            label={`${Math.round((total / 5000) * 100)}%`}
            sublabel="of 5000"
          />
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              color: 'rgba(226,232,240,0.4)',
            }}
          >
            {(5000 - total).toLocaleString()} EGP remaining of 5,000 budget
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {expenses
          .slice()
          .reverse()
          .map((e) => (
            <div
              key={e.id}
              style={{
                ...S.card(),
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: expCatColor[e.category] || '#6366f1',
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 14, color: '#e2e8f0' }}>
                {e.desc}
              </span>
              <span style={S.badge(expCatColor[e.category] || '#6366f1')}>
                {e.category}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fbbf24' }}>
                {e.amount.toLocaleString()} EGP
              </span>
              <button
                onClick={() => remove(e.id)}
                style={{
                  ...S.btn('ghost'),
                  padding: '6px',
                  color: '#f87171',
                  display: 'flex',
                }}
              >
                <Icon d={icons.trash} size={14} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tasks, setTasks] = useLocalStorage('lc_tasks', seedTasks);
  const [courses, setCourses] = useLocalStorage('lc_courses', seedCourses);
  const [habits, setHabits] = useLocalStorage('lc_habits', seedHabits);
  const [expenses, setExpenses] = useLocalStorage('lc_expenses', seedExpenses);
  const [study, setStudy] = useLocalStorage('lc_study', seedStudy);
  const [section, setSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'tasks', label: 'Tasks', icon: icons.tasks },
    { id: 'courses', label: 'Courses', icon: icons.courses },
    { id: 'study', label: 'Study', icon: icons.study },
    { id: 'habits', label: 'Habits', icon: icons.habits },
    { id: 'expenses', label: 'Expenses', icon: icons.expenses },
  ];

  const sectionTitles = {
    dashboard: 'Overview',
    tasks: 'Task Manager',
    courses: 'Course Manager',
    study: 'Study Tracker',
    habits: 'Habit Tracker',
    expenses: 'Expense Tracker',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
        input[type=time]::-webkit-calendar-picker-indicator { filter: invert(0.6); }
        select option { background: #1e2540; color: #e2e8f0; }
        button:hover { filter: brightness(1.1); }
      `}</style>
      <div style={S.app}>
        {/* Sidebar */}
        <div style={S.sidebar(collapsed)}>
          <div style={S.sidebarHeader}>
            <div style={S.logo}>
              <div style={S.logoIcon}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
                  A
                </span>
              </div>
              {!collapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <div style={S.logoText}>Anas Hamdy</div>
                  <div style={S.logoSub}>Life Control Dashboard</div>
                </div>
              )}
            </div>
          </div>

          <nav style={S.nav}>
            {nav.map((n) => (
              <div
                key={n.id}
                style={S.navItem(section === n.id, collapsed)}
                onClick={() => setSection(n.id)}
                title={collapsed ? n.label : ''}
              >
                <div style={{ flexShrink: 0, display: 'flex' }}>
                  <Icon
                    d={n.icon}
                    size={18}
                    strokeWidth={section === n.id ? 2.2 : 1.6}
                  />
                </div>
                {!collapsed && (
                  <span
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {n.label}
                  </span>
                )}
                {section === n.id && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 3,
                      borderRadius: '0 2px 2px 0',
                      background: '#6366f1',
                    }}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Profile */}
          <div
            style={{
              padding: '14px 12px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              overflow: 'hidden',
            }}
          >
            <div style={S.avatar}>AH</div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#f1f5f9',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Anas Hamdy
                </div>
                <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>
                  Student · Developer
                </div>
              </div>
            )}
          </div>

          {/* Toggle button */}
          <button
            style={S.sidebarToggle}
            onClick={() => setCollapsed((c) => !c)}
          >
            <Icon
              d={collapsed ? icons.chevronRight : icons.chevronLeft}
              size={12}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Main */}
        <div style={S.main}>
          {/* Topbar */}
          <div style={S.topbar}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
                {sectionTitles[section]}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)' }}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'rgba(16,185,129,0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
              >
                🟢 Active
              </div>
              <div style={S.avatar}>AH</div>
            </div>
          </div>

          {/* Content */}
          <div style={S.content}>
            {section === 'dashboard' && (
              <Dashboard
                tasks={tasks}
                courses={courses}
                habits={habits}
                expenses={expenses}
                study={study}
              />
            )}
            {section === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} />}
            {section === 'courses' && (
              <Courses courses={courses} setCourses={setCourses} />
            )}
            {section === 'study' && <Study study={study} setStudy={setStudy} />}
            {section === 'habits' && (
              <Habits habits={habits} setHabits={setHabits} />
            )}
            {section === 'expenses' && (
              <Expenses expenses={expenses} setExpenses={setExpenses} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
