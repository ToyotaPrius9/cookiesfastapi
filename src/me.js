import React from 'react';
import './App.css'; 
function Me() {
  return <p className="Me">Harman Singh Minhas 2602184220</p>;
  
}
function BackgroundMusic() {
    return (
      <div>
                <audio autoPlay loop volume = "0.2">
                    <source src={process.env.PUBLIC_URL + '/Intense - Only You.mp3'} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            <Me />
      </div>
    );
}

export default BackgroundMusic;