import { useState, useRef, useEffect } from "react";
import { courseData } from "../courseData";

// Add Google Fonts import
const fontStyle = document.createElement("style");
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
`;
document.head.appendChild(fontStyle);

function formatUIDate(dateStr) {
  // Format YYYY-MM-DD to '22 May 2025'
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-500 h-2.5 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

function TaskList({
  title,
  topic,
  tasks,
  checked,
  onCheck,
  isToday,
  sectionRef,
}) {
  const [expandedTask, setExpandedTask] = useState(null);

  return (
    <section
      ref={sectionRef}
      className={`bg-white rounded-xl shadow p-4 mb-4 ${
        isToday ? "border-2 border-blue-500" : ""
      }`}
    >
      <h2 className="text-2xl font-bold mb-2">
        {title}
        {topic && <span className="text-lg font-semibold ml-1">({topic})</span>}
      </h2>
      <ul>
        {tasks.map((task, idx) => (
          <li key={idx} className="border-b last:border-b-0">
            <div className="flex items-center justify-between py-2">
              <div
                className="cursor-pointer w-[90%]"
                onClick={() =>
                  setExpandedTask(expandedTask === idx ? null : idx)
                }
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {expandedTask === idx ? "▼" : "▶"}
                  </span>
                  <span className="truncate max-w-[70%]" title={task.taskTitle}>
                    {task.taskTitle}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 ml-2"
                checked={checked[idx]}
                onChange={() => onCheck(idx)}
              />
            </div>
            {expandedTask === idx && (
              <div className="pl-8 pb-3 text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                  <span>{task.taskTitle}</span>
                </div>
                <div className="flex items-center">
                  <span>{task.taskDurationExpected} minutes</span>
                </div>
                <div className="flex items-center">
                  <span>{task.taskTimeSuggested}</span>
                </div>
                <div>
                  <p className="text-gray-700">{task.taskDescription}</p>
                </div>
                {task.taskSuggestedLinks && (
                  <div>
                    <span className="font-medium block mb-1">Resources:</span>
                    <a
                      href={task.taskSuggestedLinks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {task.taskSuggestedLinks}
                    </a>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProgressAccordion({
  progress,
  totalTasks,
  completedTasks,
  pastDates,
  courseData,
  checkedMap,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-2 mt-4 bg-white rounded-lg shadow  max-h-[250px] overflow-y-auto">
      <div className="sticky top-0 bg-white p-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-sm">Progress</div>
          <div className="text-sm text-gray-600">
            {completedTasks}/{totalTasks} tasks completed
          </div>
          <span className="text-lg">{isOpen ? "▼" : "▶"}</span>
        </div>
        <ProgressBar progress={progress} />
      </div>
      {isOpen && (
        <div className="mt-2">
          <div className="space-y-3">
            {pastDates.map((date) => {
              const data = courseData[date];
              if (!data) return null;
              const completedCount =
                checkedMap[date]?.filter(Boolean).length || 0;
              const totalCount = data.taskstodo.length;

              return (
                <div key={date} className="bg-white rounded-lg shadow p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{formatUIDate(date)}</div>
                    <div className="text-sm text-gray-600">
                      {completedCount}/{totalCount} completed
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{data.title}</div>
                  <div className="space-y-1">
                    {data.taskstodo.map((task, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span
                          className={`mr-2 ${
                            checkedMap[date]?.[idx]
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {checkedMap[date]?.[idx] ? "✓" : "○"}
                        </span>
                        <span
                          className={
                            checkedMap[date]?.[idx]
                              ? "line-through text-gray-500"
                              : ""
                          }
                        >
                          {task.taskTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
      <p className="text-center">
        We're working hard to bring you this feature.
      </p>
    </div>
  );
}

function Tab({ icon, label, isActive, onClick }) {
  return (
    <button
      className={`flex flex-col items-center text-xs focus:outline-none transition-all w-full h-full ${
        isActive
          ? "text-blue-600 bg-blue-50 border-t-2 border-blue-600"
          : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="text-2xl mb-1">{icon}</span>
      {label}
    </button>
  );
}

export default function App() {
  // Sort dates: today at top, then future, then past
  const todayStr = new Date().toISOString().slice(0, 10);
  const allDates = Object.keys(courseData).sort();
  const todayIdx = allDates.indexOf(todayStr);
  let orderedDates = [];
  if (todayIdx !== -1) {
    orderedDates = [allDates[todayIdx], ...allDates.slice(todayIdx + 1)];
  } else {
    // If today not in data, just show all future then past
    const future = allDates.filter((d) => d > todayStr);
    const past = allDates.filter((d) => d < todayStr);
    orderedDates = [todayStr, ...future];
  }

  // Initialize checkedMap from localStorage or create new
  const [checkedMap, setCheckedMap] = useState(() => {
    const savedCheckedMap = localStorage.getItem("checkedTasks");
    if (savedCheckedMap) {
      return JSON.parse(savedCheckedMap);
    }
    // If no saved data, initialize with all false
    const initialMap = {};
    allDates.forEach((date) => {
      initialMap[date] = Array(courseData[date]?.taskstodo.length || 0).fill(
        false
      );
    });
    return initialMap;
  });

  // Save to localStorage whenever checkedMap changes
  useEffect(() => {
    localStorage.setItem("checkedTasks", JSON.stringify(checkedMap));
  }, [checkedMap]);

  // Progress calculation
  const totalTasks = allDates.reduce(
    (acc, date) => acc + (courseData[date]?.taskstodo.length || 0),
    0
  );
  const completedTasks = allDates.reduce(
    (acc, date) => acc + (checkedMap[date]?.filter(Boolean).length || 0),
    0
  );
  const progress = (completedTasks / totalTasks) * 100;

  // Ref for today section and main container
  const todaySectionRef = useRef(null);
  const mainRef = useRef(null);

  // Scroll to today section on mount
  useEffect(() => {
    if (todaySectionRef.current && mainRef.current) {
      const main = mainRef.current;
      const todayBox = todaySectionRef.current;
      // Scroll so that todayBox is at the top of the main container
      main.scrollTo({
        top: todayBox.offsetTop - main.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  // Separate past dates for the accordion
  const pastDates = allDates.filter((d) => d < todayStr);

  // Add active tab state
  const [activeTab, setActiveTab] = useState("daily");

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "daily":
        return (
          <>
            {/* Progress Accordion */}
            <ProgressAccordion
              progress={progress}
              totalTasks={totalTasks}
              completedTasks={completedTasks}
              pastDates={pastDates}
              courseData={courseData}
              checkedMap={checkedMap}
            />
            {/* Task Sections */}
            <main className="flex-1 overflow-y-auto px-2 mt-2" ref={mainRef}>
              {orderedDates.map((date, idx) => {
                const data = courseData[date];
                if (!data) return null;
                const isToday = date === todayStr;
                return (
                  <TaskList
                    key={date}
                    title={isToday ? "Today" : formatUIDate(date)}
                    topic={isToday ? data.title : undefined}
                    tasks={data.taskstodo}
                    checked={checkedMap[date]}
                    onCheck={(taskIdx) =>
                      setCheckedMap((prev) => ({
                        ...prev,
                        [date]: prev[date].map((v, i) =>
                          i === taskIdx ? !v : v
                        ),
                      }))
                    }
                    isToday={isToday}
                    sectionRef={isToday ? todaySectionRef : undefined}
                  />
                );
              })}
            </main>
          </>
        );
      case "summary":
        return <Summary />;
      case "next":
      case "account":
        return <ComingSoon />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="min-h-screen bg-gray-100 flex flex-col pb-20 max-w-[400px] mx-auto relative">
        {/* Header */}
        <header className="bg-white shadow p-2 flex flex-col items-center">
          <div className="text-4xl font-thin tracking-tight mb-2">
            <span className="font-['Monoton'] font-light mr-2">BE</span>
            PREPARE
          </div>
        </header>

        {/* Main Content */}
        {renderContent()}

        {/* Sticky Footer */}
        <footer className="fixed bottom-0 left-[50%] translate-x-[-50%] w-full bg-white border-t shadow flex justify-around items-center h-16 z-10 max-w-[400px]">
          <Tab
            icon="🏃‍♂️"
            label="Daily"
            isActive={activeTab === "daily"}
            onClick={() => setActiveTab("daily")}
          />
          <Tab
            icon="📋"
            label="Summary"
            isActive={activeTab === "summary"}
            onClick={() => setActiveTab("summary")}
          />
          <Tab
            icon="🤔"
            label="Next"
            isActive={activeTab === "next"}
            onClick={() => setActiveTab("next")}
          />
          <Tab
            icon="⭐"
            label="Account"
            isActive={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          />
        </footer>
      </div>
      <div className="hidden md:block w-[20%] h-screen fixed top-0 right-[4%]">
        <img
          src="/mobile.svg"
          alt="use mobile to better view"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

function Summary() {
  return (
    <div className="p-4">
      This is the summary of the project.
      <img
        src="/example.png"
        alt="Example image of project"
        className="object-contain w-full my-5"
      />
      <div class="p-6 bg-slate-900 text-white font-sans space-y-8">
        <h1 class="text-3xl font-bold border-b border-gray-700 pb-2">
          🧩 Key Sections of the App (UI Structure)
        </h1>

        <div class="space-y-4">
          <p>Here’s what your app will include:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>
              <strong>Sidebar (Navigation)</strong>
              <ul class="list-disc list-inside pl-4">
                <li>Dashboard</li>
                <li>Tasks</li>
                <li>Snippets</li>
                <li>GitHub</li>
                <li>Settings (optional)</li>
              </ul>
            </li>
            <li>
              <strong>Top Bar (Header)</strong>
              <ul class="list-disc list-inside pl-4">
                <li>App name / logo</li>
                <li>Theme toggle (Light/Dark)</li>
                <li>User/avatar (optional)</li>
              </ul>
            </li>
            <li>
              <strong>Main Content Area</strong> (changes with route)
            </li>
          </ol>
        </div>

        <div>
          <h2 class="text-2xl font-semibold border-b border-gray-700 pb-2">
            🧠 Layout Concept (like Notion or Linear)
          </h2>
          <pre class="bg-gray-800 text-green-200 p-4 rounded-md overflow-x-auto text-sm">
            +-----------------------------------------------------------+ |
            DevBoard [⚙️][🌙] |
            +------------------+----------------------------------------+ | 🏠
            Dashboard | | | ✅ Tasks | Page Content Area (dynamic) | | 📄
            Snippets | -------------------------------- | | 🐙 GitHub | - Task
            List | | | - Snippet Editor | | | - GitHub Repos |
            +------------------+----------------------------------------+
          </pre>
        </div>

        <div>
          <h2 class="text-2xl font-semibold border-b border-gray-700 pb-2">
            🎨 UI Design Overview (Clean + Developer-Centric)
          </h2>
          <h3 class="text-xl font-medium mt-4">🔹 Color Palette</h3>
          <ul class="list-disc list-inside pl-4">
            <li>
              Light theme:{" "}
              <code class="text-blue-400">
                #ffffff, #f3f4f6, #e2e8f0, #3b82f6
              </code>
            </li>
            <li>
              Dark theme:{" "}
              <code class="text-blue-400">
                #0f172a, #1f2937, #60a5fa, #6ee7b7
              </code>
            </li>
          </ul>

          <h3 class="text-xl font-medium mt-4">🔹 Font</h3>
          <ul class="list-disc list-inside pl-4">
            <li>Use system font or Inter</li>
            <li>
              Code snippets: monospace (e.g., <code>Fira Code</code>)
            </li>
          </ul>

          <h3 class="text-xl font-medium mt-4">🔹 Design Style</h3>
          <ul class="list-disc list-inside pl-4">
            <li>Minimalist, clean</li>
            <li>Card-based layout (rounded corners, soft shadows)</li>
            <li>TailwindCSS or Shadcn UI (if using component lib)</li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-semibold border-b border-gray-700 pb-2">
            🧱 Page-by-Page Breakdown
          </h2>

          <div class="space-y-6 mt-4">
            <div>
              <h3 class="text-xl font-medium">1. Dashboard</h3>
              <ul class="list-disc list-inside pl-4">
                <li>Welcome message</li>
                <li>
                  Summary stats: Tasks completed, Snippets saved, GitHub repos
                  viewed
                </li>
              </ul>
              <pre class="bg-gray-800 text-green-200 p-3 rounded-md text-sm mt-2 overflow-auto">
                &lt;Card title="Today's Progress"&gt; &lt;ul&gt; &lt;li&gt;Tasks
                Completed: 3&lt;/li&gt; &lt;li&gt;Snippets Saved: 2&lt;/li&gt;
                &lt;li&gt;Repos Searched: 1&lt;/li&gt; &lt;/ul&gt; &lt;/Card&gt;
              </pre>
            </div>

            <div>
              <h3 class="text-xl font-medium">2. Tasks Page</h3>
              <ul class="list-disc list-inside pl-4">
                <li>Input bar (Task title)</li>
                <li>Task list with check/uncheck toggle</li>
                <li>Filter (All / Done / Pending)</li>
              </ul>
              <pre class="bg-gray-800 text-green-200 p-3 rounded-md text-sm mt-2 overflow-auto">
                [ + New Task ][ Add ] [ ] Fix GitHub fetch bug [x] Add dark mode
                toggle ✅
              </pre>
            </div>

            <div>
              <h3 class="text-xl font-medium">3. Snippets Page</h3>
              <ul class="list-disc list-inside pl-4">
                <li>Title input</li>
                <li>Multiline textarea</li>
                <li>Syntax-highlighted display (optional)</li>
                <li>Tag system (e.g., “React”, “CSS”)</li>
              </ul>
              <pre class="bg-gray-800 text-green-200 p-3 rounded-md text-sm mt-2 overflow-auto">
                [ Title: "Custom Hook for API" ] [ Code Editor ] (multiline) [
                Tags: useEffect, fetch ] [ Save ] [ Cancel ]
              </pre>
            </div>

            <div>
              <h3 class="text-xl font-medium">4. GitHub Page</h3>
              <ul class="list-disc list-inside pl-4">
                <li>Input: GitHub username</li>
                <li>
                  Fetch + display list of repos:
                  <ul class="list-disc list-inside pl-4">
                    <li>Name</li>
                    <li>Stars</li>
                    <li>Language</li>
                    <li>Link to repo</li>
                  </ul>
                </li>
              </ul>
              <pre class="bg-gray-800 text-green-200 p-3 rounded-md text-sm mt-2 overflow-auto">
                [ Search: ____________ ] [ 🔍 ]
                ------------------------------------- 📘 openai/gpt-react ⭐
                1.2k | JS | 🔗 View
              </pre>
            </div>

            <div>
              <h3 class="text-xl font-medium">5. Settings (Optional)</h3>
              <ul class="list-disc list-inside pl-4">
                <li>Toggle theme</li>
                <li>Reset localStorage</li>
                <li>Export data (JSON)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
