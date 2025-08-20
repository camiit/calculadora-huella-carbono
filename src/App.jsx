import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [combustible, setCombustible] = useState("");
  const [gas, setGas] = useState("");
  const [luz,setLuz] = useState("");
  const [basura, setBasura] = useState("");
  const [personas, setPersonas] = useState("");

  const [combustibleM, setCombustibleM] = useState(0);
  const [gasM, setGasM] = useState("");
  const [luzM,setLuzM] = useState("");
  const [basuraM, setBasuraM] = useState("");
  const [personasM, setPersonasM] = useState("");

  const [combustibleA, setCombustibleA] = useState(0);
  const [gasA, setGasA] = useState("");
  const [luzA,setLuzA] = useState("");
  const [basuraA, setBasuraA] = useState("");
  const [personasA, setPersonasA] = useState("");

  const [resultado, setResultado] = useState(null);
  const [showResultado, setShowResultado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const combustibleNum = parseFloat(combustible);
    const gasNum = parseFloat(gas);
    const luzNum = parseFloat(luz);
    const basuraNum = parseFloat(basura);
    const personasNum = parseInt(personas);

    const combustibleM = combustibleNum * 2.5;
    const gasM = gasNum * 2.1;
    const luzM = luzNum * 0.77;
    const basuraM = basuraNum * 0.7;

    const combustibleA = combustibleM * 12;
    const gasA = gasM * 12;
    const luzA = luzM * 12;
    const basuraA =  basuraM * 12;

    const resultado = (combustibleA + gasA + luzA + basuraA)/personasNum;

    setResultado(resultado);
    setShowResultado(true);
  }

  const handleReset = () => {
    setCombustible("");
    setGas("");
    setLuz("");
    setBasura("");
    setPersonas("");
    setResultado(null);
    setShowResultado(false);
  };

  const mensaje = () => {
    if (resultado > 4000) return "MAYOR A 4000, EXCEDIDO 🔴";
    if(resultado == 4000) return "IGUAL A 4000, NORMAL 🟠"
    if(resultado < 4000) return "MENOR A 4000, OK 🟢"
  }

  return (
    <div className="app-container">

      <form onSubmit={handleSubmit} className="formulario" >
        <h1 className="titulo">Calculadora Huella de Carbono</h1>
        <p className="texto">Calculá estimativamente cuanto mide tu huella de carbono anual en base a tus consumos de combustible, gas, luz y la basura que producís por mes</p>
        
        <label className="label">Consumo de combustible:
          <input className="input"
            type='number'
            step="any"
            min="0"
            value={combustible}
            onChange={(e) => setCombustible(e.target.value)}
            placeholder="L"
            required
          />
        </label>

        <label className="label">Consumo de gas:
          <input className="input"
            type='number'
            step="any"
            min="0"
            value={gas}
            onChange={(e) => setGas(e.target.value)}
            placeholder="m3"
            required
          />
        </label>

        <label className="label">Consumo de luz:
          <input className="input"
            type='number'
            step="any"
            min="0"
            value={luz}
            onChange={(e) => setLuz(e.target.value)}
            placeholder="Kw"
            required
          />
        </label>

        <label className="label">Basura producida:
          <input className="input"
            type='number'
            step="any"
            min="0"
            value={basura}
            onChange={(e) => setBasura(e.target.value)}
            placeholder="Kg"
            required
          />
        </label>

        <label className="label">Cantidad de personas:
          <input className="input"
            type='number'
            step="1"
            min="0"
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
            required
          />
        </label>

        <button className="btn-calcular" type="submit">Calcular</button>
        <button className="btn-limpiar" type="button" onClick={handleReset}>Limpiar campos</button>

        {resultado !== null && (
          <div className="resultado-container">
            <p className="texto">El semáforo ecológico te indica si tu huella de carbono es menor, igual o mayor al valor esperado para una persona durante un año de consumo y producción de desechos</p>
            <div className="resultado-row">
              <img className="resultado-imagen" src="/img/semaforo.jpg" alt="Resultado"/>

              <div className="resultado-textos">
                <p className="resultado-numero">{resultado.toFixed(2)}</p>
                <p className="resultado-mensaje">{mensaje()}</p>
              </div>
            </div>
            
          </div>
        )}

        
      </form>

    </div>
    
  )
}

export default App
