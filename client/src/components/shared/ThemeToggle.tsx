// Temporary disabled ThemeToggle to fix context issues
const ThemeToggle = () => {
  return (
    <button
      className="rounded-md px-3 py-1 text-sm flex items-center mr-2 bg-surface hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      <i className="ri-sun-line"></i>
    </button>
  );
};

export default ThemeToggle;
