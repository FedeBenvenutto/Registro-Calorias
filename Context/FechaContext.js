import React, { createContext, useState } from "react";

export const FechaContext = createContext();
export const FechaProvider = ({ children }) => {
  const FechaActual = new Date();
  const AnoActual = FechaActual.getFullYear().toString();
  const Meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const DiasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const MesActual = FechaActual.getMonth();
  const DiaActual = FechaActual.getDate();
  const [Mes, setMes] = useState(Meses[MesActual]);
  const [Ano, setAno] = useState(AnoActual);
  const [Dia, setDia] = useState(DiaActual);
  const fechaDb = Dia + "-" + Mes + "-" + Ano;
  return (
    <FechaContext.Provider
      value={{
        setMes,
        setAno,
        setDia,
        fechaDb,
        Mes,
        Ano,
        Meses,
        MesActual,
        DiaActual,
        AnoActual,
        DiasSemana,
      }}
    >
      {children}
    </FechaContext.Provider>
  );
};
