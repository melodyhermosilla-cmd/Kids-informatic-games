import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensajes, setMensajes] = useState([
    { texto: "¡Hola! Soy tu asistente virtual 🤖", esUsuario: false },
    { texto: "Pregúntame sobre: hardware, software, cómo jugar, registro o login", esUsuario: false }
  ]);
  const [inputMensaje, setInputMensaje] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const generarRespuesta = (mensaje) => {
    const mensajeLower = mensaje.toLowerCase();
    
    const respuestas = {
      'hola': '¡Hola! Soy tu duende mágico 🤖 ¿En qué puedo ayudarte?',
      'hi': '¡Hello! I\'m your magical assistant 🤖 How can I help you?',
      'hardware': '🖥️ **Hardware**: Son las partes físicas de la computadora:\n• Teclado, mouse, monitor\n• CPU, RAM, disco duro\n• Placa base, tarjeta gráfica\n¡Tenemos juegos divertidos sobre hardware!',
      'software': '💾 **Software**: Son los programas y aplicaciones:\n• Sistemas operativos (Windows, macOS)\n• Programas (Word, Excel, juegos)\n• Navegadores (Chrome, Firefox)\n¡Descubre nuestros juegos de software!',
      'jugar': '🎮 Para jugar:\n1. Ve a la sección "JUEGOS"\n2. Elige entre Hardware o Software\n3. ¡Selecciona tu juego favorito y diviértete aprendiendo!',
      'registro': '📝 **Registrarse**:\n• Haz clic en "Usuario" → "Registrarse"\n• Completa tu nombre, email y contraseña\n• ¡Y listo! Tendrás tu cuenta mágica',
      'login': '🔐 **Iniciar Sesión**:\n• Haz clic en "Usuario" → "Iniciar Sesión"\n• Ingresa tu email y contraseña\n• ¡Bienvenido de vuelta!',
      'ayuda': '❓ **Puedo ayudarte con**:\n• hardware - Partes de computadora\n• software - Programas y apps\n• jugar - Cómo empezar a jugar\n• registro - Crear cuenta\n• login - Acceder a tu cuenta\n¡Pregúntame lo que quieras!',
      'gracias': '¡De nada! 😊 ¿Necesitas ayuda con algo más?',
      'adios': '¡Hasta luego! 👋 Recuerda que estoy aquí para ayudarte',
    };

    // Buscar respuesta o usar respuesta por defecto
    for (const [key, value] of Object.entries(respuestas)) {
      if (mensajeLower.includes(key)) {
        return value;
      }
    }

    return '🤔 No entiendo ese hechizo. Pregúntame sobre: hardware, software, jugar, registro, login, ayuda';
  };

  const enviarMensaje = () => {
    if (!inputMensaje.trim()) return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario = { texto: inputMensaje, esUsuario: true };
    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInputMensaje('');

    // Simular typing del bot
    setTimeout(() => {
      const respuestaBot = generarRespuesta(inputMensaje);
      const mensajeBot = { texto: respuestaBot, esUsuario: false };
      setMensajes(prev => [...prev, mensajeBot]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  };

  const limpiarChat = () => {
    setMensajes([
      { texto: "¡Hola! Soy tu asistente virtual 🤖", esUsuario: false },
      { texto: "Pregúntame sobre: hardware, software, cómo jugar, registro o login", esUsuario: false }
    ]);
  };

  return (
    <>
      {/* Botón del robotito flotante */}
      <div 
        className="chatbot-toggle"
        onClick={() => setMostrarChat(!mostrarChat)}
      >
        <div className="robot-icon">🤖</div>
        {!mostrarChat && <div className="notification-dot"></div>}
      </div>

      {/* Contenedor del chatbot */}
      {mostrarChat && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="robot-icon">🤖</div>
            <span>Asistente Virtual</span>
            <button className="close-chatbot" onClick={() => setMostrarChat(false)}>
              ×
            </button>
          </div>
          
          <div className="chatbot-messages">
            {mensajes.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.esUsuario ? 'user-message' : 'bot-message'}`}
              >
                {msg.texto.split('\n').map((line, i) => (
                  <div key={i}>
                    {line}
                    {i < msg.texto.split('\n').length - 1 && <br />}
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input 
              type="text"
              placeholder="Pregunta sobre hardware, software, cómo jugar..."
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={enviarMensaje} className="send-button">
              ➤
            </button>
            <button onClick={limpiarChat} className="clear-button" title="Limpiar chat">
              🗑️
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;