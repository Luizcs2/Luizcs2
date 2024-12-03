import "./CSS/LoadingScreen.css";
import React from "react";
import loadingVideo from "../assets/loading-screen.mp4";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <video autoPlay muted>
        <source src={loadingVideo} type="video/mp4" />
      </video>
    </div>
  );
}
