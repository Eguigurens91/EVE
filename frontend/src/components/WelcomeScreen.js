// src/components/WelcomeScreen.js
import React from 'react';

function WelcomeScreen({ onStart }) {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  };

  const imageStyle = {
    width: '250px', 
    height: 'auto',       
    marginBottom: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1>Bienvenido a EVE !</h1>
      <h2>"Elecciones Virtuales Escolares"</h2>   
      <img
        src={`${imageBaseUrl}/Eevee1.png`}
        alt="EVE"
        style={imageStyle}
      />
      
      {/* <p>Presiona el botón para iniciar</p>
      <button style={buttonStyle} onClick={onStart}>
        Iniciar
      </button> */}
    </div>
  );
}

export default WelcomeScreen;
