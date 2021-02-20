import { useState, useEffect } from "react";
import "./App.css";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // Write file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    // Run FFMpeg command
    await ffmpeg.run(
      // -i for input file
      "-i",
      // name of input file
      "test.mp4",
      // -t is for the time we want new vid length to be
      "-t",
      // specified duration
      "2.5",
      // -ss is offset for starting time
      "-ss",
      // specified start time
      "2.0",
      // -f is for file type
      "-f",
      // specifying we want a gif file
      "gif",
      // name of our created gif file
      "out.gif"
    );

    // Read result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create URL (so our file can be used in the browser)
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );

    // Update state
    setGif(url);
  };

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <h3>Result</h3>
      <button onClick={convertToGif} disabled={!video}>Convert</button>
      {gif && <img src={gif} width="250" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
