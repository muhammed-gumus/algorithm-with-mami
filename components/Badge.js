export default function Badge({ type, label }) {
  const colorMap = {
    easy: 'bg-neo-green text-neo-black',
    medium: 'bg-neo-yellow text-neo-black',
    hard: 'bg-neo-red text-neo-white',
    leetcode: 'bg-neo-orange text-neo-black',
    hackerrank: 'bg-neo-green text-neo-black',
    codewars: 'bg-neo-purple text-neo-white',
    javascript: 'bg-yellow-400 text-neo-black',
    python: 'bg-blue-500 text-neo-white',
    cpp: 'bg-blue-700 text-neo-white',
    sql: 'bg-neo-accent text-neo-black',
    typescript: 'bg-blue-600 text-neo-white',
    java: 'bg-red-600 text-neo-white',
    csharp: 'bg-violet-600 text-neo-white',
    go: 'bg-cyan-500 text-neo-white',
    rust: 'bg-orange-700 text-neo-white',
    swift: 'bg-orange-500 text-neo-white',
    kotlin: 'bg-purple-600 text-neo-white',
    ruby: 'bg-red-700 text-neo-white',
    php: 'bg-indigo-500 text-neo-white',
    c: 'bg-gray-600 text-neo-white',
  };

  const defaultColor = 'bg-gray-200 text-neo-black';

  return (
    <span className={`neo-badge ${colorMap[type] || defaultColor}`}>
      {label || type}
    </span>
  );
}
