import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { FechaProvider } from "./Context/FechaContext";
import TabNavigator from "./Component/Navigation";


export default function App() {
  return (
    <FechaProvider>
      <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    </FechaProvider>
  );
}
