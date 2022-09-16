import React, { useState } from "react";
import { SpeedDial } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

const SpeedDialComp = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  return (
    <SpeedDial
      color={"#606e8c"}
      isOpen={open}
      icon={{ name: "add", color: "#fff" }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        icon={{ name: "add", color: "#fff" }}
        title="Añadir nuevo ingreso"
        onPress={() => {
          setOpen(!open);
          navigation.navigate("NuevoIngreso");
        }}
      />
      <SpeedDial.Action
        icon={{ name: "add-chart", color: "#fff" }}
        title="Ver ingresos"
        onPress={() => {
          setOpen(!open);
          navigation.navigate("Veringreso");
        }}
      />
      <SpeedDial.Action
        icon={{ name: "done-outline", color: "#fff" }}
        title="Totales"
        onPress={() => {
          setOpen(!open);
          navigation.navigate("Totales");
        }}
      />
      <SpeedDial.Action
        icon={{ name: "done-outline", color: "#fff" }}
        title="Añadir Categoría"
        onPress={() => {
          setOpen(!open);
          navigation.navigate("AnadirCategoria");
        }}
      />
      <SpeedDial.Action
        icon={{ name: "done-outline", color: "#fff" }}
        title="Modificar Categoría"
        onPress={() => {
          setOpen(!open);
          navigation.navigate("ModificarCategoria");
        }}
      />
    </SpeedDial>
  );
};

export default SpeedDialComp;
