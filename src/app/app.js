"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  async function uploadVideo() {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setVideoUrl(data.url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Video Upload</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadVideo}>Upload</button>

      <br /><br />

      {videoUrl && (
        <video src={videoUrl} controls width="500" />
      )}
    </div>
  );
}
