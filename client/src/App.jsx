import { useEffect, useState } from 'react';
import { api } from './api';
import StartVisit from './components/StartVisit';
import RoomSetup from './components/RoomSetup';
import WindowAssignment from './components/WindowAssignment';
import WindowForm from './components/WindowForm';
import ReviewSummary from './components/ReviewSummary';
import './App.css';

const STEPS = ['start', 'rooms', 'assign', 'measure', 'summary'];

export default function App() {
  const [step, setStep] = useState('start');
  const [visit, setVisit] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [windowIndex, setWindowIndex] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getFabrics().then(setFabrics).catch((err) => setError(err.message));
  }, []);

  const flatWindows = rooms.flatMap((room) => room.windows.map((w) => ({ ...w, room })));
  const totalWindows = flatWindows.length;

  async function handleStart(label) {
    const v = await api.createVisit(label);
    setVisit(v);
    setStep('rooms');
  }

  async function handleAddRoom(name) {
    const room = await api.createRoom(visit.id, name);
    setRooms((prev) => [...prev, { ...room, windows: [] }]);
  }

  async function handleAddWindow(roomId, label) {
    const win = await api.createWindow(roomId, label);
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, windows: [...r.windows, win] } : r))
    );
  }

  async function handleSaveWindow(windowId, data) {
    await api.updateWindow(windowId, data);
    if (windowIndex + 1 < totalWindows) {
      setWindowIndex(windowIndex + 1);
    } else {
      const s = await api.getSummary(visit.id);
      setSummary(s);
      setStep('summary');
    }
  }

  function handleRestart() {
    setStep('start');
    setVisit(null);
    setRooms([]);
    setWindowIndex(0);
    setSummary(null);
    setError(null);
  }

  return (
    <div className="app">
      <header>
        <h1>Window Measurement Capture — v1</h1>
        <div className="steps">
          {STEPS.map((s) => (
            <span key={s} className={s === step ? 'step active' : 'step'}>
              {s}
            </span>
          ))}
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {step === 'start' && <StartVisit onStart={handleStart} />}

      {step === 'rooms' && (
        <RoomSetup rooms={rooms} onAddRoom={handleAddRoom} onNext={() => setStep('assign')} />
      )}

      {step === 'assign' && (
        <WindowAssignment
          rooms={rooms}
          onAddWindow={handleAddWindow}
          totalWindows={totalWindows}
          onNext={() => {
            setWindowIndex(0);
            setStep('measure');
          }}
        />
      )}

      {step === 'measure' && totalWindows > 0 && (
        <WindowForm
          key={flatWindows[windowIndex].id}
          window={flatWindows[windowIndex]}
          room={flatWindows[windowIndex].room}
          fabrics={fabrics}
          index={windowIndex}
          total={totalWindows}
          onSave={handleSaveWindow}
        />
      )}

      {step === 'summary' && <ReviewSummary summary={summary} onRestart={handleRestart} />}
    </div>
  );
}
