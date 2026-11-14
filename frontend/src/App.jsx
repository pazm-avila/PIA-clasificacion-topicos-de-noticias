import { useState } from "react";
import Layout from "./components/layout/Layout";
import Hero from "./components/Hero";
import Form from "./components/Form";
import Card from "./components/Card";
import Probabilidades from "./components/Probabilidades";
import Resultado from "./components/Resultado";
import Razonamiento from "./components/Razonamiento";
import Explicacion from "./components/Explicacion";
import { clasificarTitular } from "./services/api";
import { masProbable } from "./utils/formato";

export default function App() {
  const [titular, setTitular] = useState("");
  const [res, setRes] = useState(null);
  const [sel, setSel] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function clasificar(texto) {
    setCargando(true);
    setError("");
    try {
      const data = await clasificarTitular(texto);
      setTitular(texto);
      setRes(data);
      setSel(masProbable(data.probabilidades));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Layout>
      <Hero />
      <Form onEnviar={clasificar} cargando={cargando} error={error} onError={setError} />

      {!res && !error && (
        <Card className="mt-5 border-dashed p-10 text-center text-sm text-soft">
          Ingresá un titular para ver la categoría, las probabilidades y la explicación.
        </Card>
      )}

      {res && (
        <>
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <Probabilidades res={res} sel={sel} onSeleccionar={setSel} />
            <div className="space-y-5">
              <Resultado res={res} />
              <Razonamiento res={res} sel={sel} titular={titular} />
            </div>
          </div>
          <Explicacion res={res} sel={sel} />
        </>
      )}
    </Layout>
  );
}