import { useProgressStore } from '../../store/progressStore';

interface ProgressTrackerProps {
  topicFile: string;
}

export function ProgressTracker({ topicFile }: Readonly<ProgressTrackerProps>) {
  const { progress, toggleComplete } = useProgressStore();
  const isComplete = !!progress.completedTopics[topicFile];

  return (
    <div className="pg-tracker">
      <label className={`pg-label ${isComplete ? 'pg-done' : ''}`}>
        <input
          type="checkbox"
          className="pg-check"
          checked={isComplete}
          onChange={(e) => toggleComplete(topicFile, e.target.checked)}
        />
        <span className="pg-icon">{isComplete ? '✅' : '☐'}</span>
        <span className="pg-text">{isComplete ? 'Completed!' : 'Mark as completed'}</span>
      </label>
    </div>
  );
}
