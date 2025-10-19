import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { supabase } from './supabaseClient.js'

function App() {
  const [combustible, setCombustible] = useState("");
  const [gas, setGas] = useState("");
  const [luz,setLuz] = useState("");
  const [basura, setBasura] = useState("");
  const [personas, setPersonas] = useState("");

  const [resultado, setResultado] = useState(null);
  const [showResultado, setShowResultado] = useState(false);

  const [estadisticas, setEstadisticas] = useState(null);

  //Consultar columnas
  const fetchEstadisticas = async () => {
    const { data: selectData, error: selectError} = await supabase
      .from('estadisticas')
      .select('total, rojo, amarillo, verde')
      .eq('id', 1)
      .single();

    if(selectError) console.error('Error fetching data: ', selectError);
    else{
      const { total, rojo, amarillo, verde } = selectData;
      const porcentajeRojo = total > 0 ? (rojo * 100) / total : 0;
      const porcentajeAmarillo = total > 0 ? (amarillo * 100) / total : 0;
      const porcentajeVerde = total > 0 ? (verde * 100) / total : 0;

      setEstadisticas({
        porcentajeRojo,
        porcentajeAmarillo,
        porcentajeVerde,
      });
      console.log('Data fetched: ', selectData);
    } 
  };
  
  //Cargar estadisticas
  useEffect(() => {
    fetchEstadisticas();
  }, []);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Calcular resultado
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

    //Actualizar columnas
    let columna = '';
    if (resultado > 4000) columna = 'rojo';
    else if(resultado == 4000) columna = 'amarillo';
    else columna = 'verde';

    const {data: currentData, error: fetchError } = await supabase
      .from ('estadisticas')
      .select('total, rojo, amarillo, verde')
      .eq('id', 1)
      .single();
    if (fetchError) console.error('Error fetching current data: ', fetchError);
    else console.log('Current data fetched');

    const newData = {
      total: currentData.total + 1,
      rojo: columna === 'rojo' ? currentData.rojo + 1 : currentData.rojo,
      amarillo: columna === 'amarillo' ? currentData.amarillo + 1 : currentData.amarillo,
      verde: columna === 'verde' ? currentData.verde + 1 : currentData.verde,
      ult_actualizacion: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('estadisticas')
      .update(newData)
      .eq('id', 1);
    if(updateError) console.error('Error updating data: ', updateError);
    else console.log('Data updated: ', newData);

    await fetchEstadisticas();

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
    if (resultado > 4000) return "MAYOR A 4000, EXCEDIDO🔴";
    if(resultado == 4000) return "IGUAL A 4000, NORMAL🟡"
    if(resultado < 4000) return "MENOR A 4000, OK🟢"
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

        {showResultado && resultado !== null && (
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

        {estadisticas && (
          <div className="estadisticas-container">
            <h2 className="estadisticas-titulo">Estadíscas generales</h2>
            <table className="estadisticas-table">
              <tbody>
                <tr>
                  <td>Rojo🔴</td>
                  <td>{estadisticas.porcentajeRojo.toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>Amarillo🟡</td>
                  <td>{estadisticas.porcentajeAmarillo.toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>Verde🟢</td>
                  <td>{estadisticas.porcentajeVerde.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </form>

    </div>
    
  )
}

export default App
