import PoseDetector from "./PoseDetector";
import VideoFeed from './VideoFeed';
import './index.css';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pose Detection App</h1>
      </header>
      <PoseDetector />
      {/* <VideoFeed /> */}
    </div>
  );
}

export default App;
