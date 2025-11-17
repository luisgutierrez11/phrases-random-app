import { useEffect, useState } from 'react'
import "./App.css"

// Componente principal de la aplicación
const App = () => {
  // Estado que guarda todas las frases del archivo local
  const [quotes, setQuotes] = useState([])
  // Índice de la frase actual mostrada
  const [index, setIndex] = useState(0)
  // Controla si el ciclo automático de frases está activo o detenido
  const [stopCycle, setStopCycle] = useState(true)
  // Tiempo (en segundos) entre frases cuando el ciclo automático está activo
  const [delay, setDelay] = useState(5)

  // useEffect que carga las frases desde el archivo local solo una vez al inicio
  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setQuotes(data)) // Guarda las frases en el estado
      .catch((err) => console.error("Error cargando las frases:", err))
  }, [])

  // useEffect que controla el cambio automático de frases
  useEffect(() => {
    // Si el ciclo está detenido o aún no se cargaron las frases, no hacer nada
    if (stopCycle || quotes.length === 0) return

    // Crea un intervalo que cambia la frase cada cierto tiempo (delay * 1000 ms)
    const interval = setInterval(() => {
      // Avanza al siguiente índice o vuelve al inicio con módulo (%)
      setIndex((prev) => (prev + 1) % quotes.length)
    }, delay * 1000)
    
    // Limpia el intervalo al desmontar o cambiar dependencias
    return () => clearInterval(interval)
  }, [quotes.length, stopCycle, delay])

  // Copia la frase actual al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(quotes[index])
  }

  // Cambia manualmente a la siguiente frase
  const handleNext = () => {
    setIndex((prev) => (prev + 1) % quotes.length)
  }
  // 👇 Alternativa (comentada) para mostrar frases en orden aleatorio:
  // setIndex(Math.floor(Math.random() * quotes.length))

  // Si aún no se cargaron las frases, mostrar mensaje de carga
  if (quotes.length === 0) return <p>Cargando frases...</p>

  return (
    <div className='app-container'>
      {/* Frase actual */}
      <h1 className='quote'>{quotes[index]}</h1>

      {/* Botones de interacción */}
      <button onClick={handleNext}>Nueva frase</button>
      <button onClick={copyToClipboard}>Copiar</button>
      <button onClick={() => setStopCycle((prev) => !prev)}>
        {stopCycle ? "Iniciar ciclo automático" : "Detener ciclo automático"}
      </button>

       {/* Control para ajustar el tiempo entre frases */}
      <div className='interval-timer'>
        <label>
          Tiempo entre frases:{" "}
          <input
            type="number"
            value={delay}
            // Evita que el usuario ingrese valores menores a 1 segundo
            onChange={(e) => setDelay(Math.max(1, Number(e.target.value)))}
          />
        </label>
      </div>
    </div>
  )
}

export default App
