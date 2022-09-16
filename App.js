import React from "react";
import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Veringreso from "./screens/Veringreso";
import NuevoIngreso from "./screens/NuevoIngreso";
import IngresoDetalle from "./screens/IngresoDetalle";
import Totales from "./screens/Totales";
import { FechaProvider } from "./Context/FechaContext";
import AnadirCategoria from "./screens/AnadirCategoria";
import ModificarCategoria from "./screens/ModificarCategoria";

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Totales"
        component={Totales}
        options={{ title: "Totales" }}
      />
      <Stack.Screen
        name="NuevoIngreso"
        component={NuevoIngreso}
        options={{ title: "Nuevo Ingreso" }}
      />
      <Stack.Screen
        name="Veringreso"
        component={Veringreso}
        options={{ title: "Ver ingreso" }}
      />
      <Stack.Screen
        name="IngresoDetalle"
        component={IngresoDetalle}
        options={{ title: "Detalle del Ingreso" }}
      />
      <Stack.Screen
        name="AnadirCategoria"
        component={AnadirCategoria}
        options={{ title: "Añadir categoría" }}
      />
      <Stack.Screen
        name="ModificarCategoria"
        component={ModificarCategoria}
        options={{ title: "Modificar categoría" }}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <FechaProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </FechaProvider>
  );
}
