import React, { useState, useEffect } from 'react';
import './PreguntasHardware.css';

// Importar imágenes (debes moverlas a la carpeta public)
import procesadorImg from '../../../public/juegos-hardware/preg/img/procesador.webp';
import ramImg from '../../../public/juegos-hardware/preg/img/memoria ram.jpg';
import madreImg from '../../../public/juegos-hardware/preg/img/placa madre.jpeg';
import discoImg from '../../../public/juegos-hardware/preg/img/disco duro ssd.webp';
import graficaImg from '../../../public/juegos-hardware/preg/img/tarjeta grafica.jpeg';

const PreguntasHardware = () => {
  const questions = [
    {
      title: "Cuando juegas Fortnite, ¿quién es el componente que está más enfocado en que el juego funcione?",
      image: procesadorImg,
      options: [
        "Tarjeta Gráfica",
        "Disco Duro",
        "Procesador",
        "Placa Madre",
        "Memoria RAM"
      ],
      correctIndex: 2
    },
    {
      title: "Si tu computadora fuera un celular, ¿qué componente sería como la memoria que se llena cuando tienes muchas apps abiertas?",
      image: ramImg,
      options: [
        "Tarjeta Gráfica",
        "Disco Duro",
        "Procesador",
        "Placa Madre",
        "Memoria RAM"
      ],
      correctIndex: 4
    },
    {
      title: "En el parque de diversiones de la computadora, ¿quién es el que se asegura que todos los juegos estén todos conectados a la electricidad?",
      image: madreImg,
      options: [
        "Tarjeta Gráfica",
        "Disco Duro",
        "Procesador",
        "Placa Madre",
        "Memoria RAM"
      ],
      correctIndex: 3
    },
    {
      title: "¿Dónde crees que se guarda realmente todo lo que descargas (juegos, fotos, apps) cuando no los estás usando?",
      image: discoImg,
      options: [
        "Tarjeta Gráfica",
        "Disco Duro",
        "Procesador",
        "Placa Madre",
        "Memoria RAM"
      ],
      correctIndex: 1
    },
    {
      title: "¿Qué componente hace que los gráficos de tus juegos se vean tan realistas y fluidos?",
      image: graficaImg,
      options: [
        "Tarjeta Gráfica",
        "Disco Duro",
        "Procesador",
        "Placa Madre",
        "Memoria RAM"
      ],
      correctIndex: 0
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);

  // Cargar estadísticas guardadas
  useEffect(() => {
    const savedStats = localStorage.getItem('pcComponentsGameStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setCorrectAnswers(stats.correctAnswers || 0);
      setIncorrectAnswers(stats.incorrectAnswers || 0);
    }
  }, []);

  // Guardar estadísticas
  const saveGameStats = () => {
    const stats = {
      correctAnswers: correctAnswers,
      incorrectAnswers: incorrectAnswers,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('pcComponentsGameStats', JSON.stringify(stats));
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedOption !== null) return; // Evitar múltiples clics
    
    setSelectedOption(selectedIndex);
    const isCorrect = selectedIndex === questions[currentQuestion].correctIndex;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }

    saveGameStats();
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setSelectedOption(null);
    setGameFinished(false);
    saveGameStats();
  };

  const accuracy = correctAnswers + incorrectAnswers > 0 
    ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) 
    : 0;

  if (gameFinished) {
    return (
      <div className="juego-container">
        <div className="container">
          <h1>¡Juego Terminado! 🎉</h1>
          <div className="stats-container">
            <h3>Estadísticas Finales</h3>
            <p>Preguntas correctas: <span>{correctAnswers}</span></p>
            <p>Preguntas incorrectas: <span>{incorrectAnswers}</span></p>
            <p>Porcentaje de aciertos: <span>{accuracy}%</span></p>
            <button id="restart-btn" onClick={restartGame}>
              Jugar Nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="juego-container">
      <div className="container">
        <h1 id="question-title">{currentQ.title}</h1>

        <div className="image-container">
          <img 
            id="component-image" 
            src={currentQ.image} 
            alt="Componente" 
          />
        </div>

        <div className="options" id="options-container">
          {currentQ.options.map((option, index) => {
            let className = "option";
            if (selectedOption !== null) {
              if (index === currentQ.correctIndex) {
                className += " correct";
              }
              if (index === selectedOption && index !== currentQ.correctIndex) {
                className += " incorrect";
              }
              if (selectedOption !== null) {
                className += " disabled";
              }
            }
            
            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedOption !== null && (
          <button id="next-btn" onClick={nextQuestion}>
            {currentQuestion + 1 < questions.length ? 'Siguiente pregunta' : 'Ver resultados'}
          </button>
        )}
        
        <div className="stats-container">
          <h3>Estadísticas de la Partida</h3>
          <p>Preguntas correctas: <span>{correctAnswers}</span></p>
          <p>Preguntas incorrectas: <span>{incorrectAnswers}</span></p>
          <p>Porcentaje de aciertos: <span>{accuracy}%</span></p>
        </div>
      </div>
    </div>
  );
};

export default PreguntasHardware;