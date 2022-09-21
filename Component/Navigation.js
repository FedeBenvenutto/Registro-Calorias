import React from 'react';
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Veringreso from "../screens/Veringreso";
import NuevoIngreso from "../screens/NuevoIngreso";
import IngresoDetalle from "../screens/IngresoDetalle";
import Totales from "../screens/Totales";
import AnadirCategoria from "../screens/AnadirCategoria";
import ModificarCategoria from "../screens/ModificarCategoria";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import plus from '../assets/plus.png'

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
       screenOptions={{headerShown: false}} >
      <Stack.Screen
        name="VeringresoSTC"
        component={Veringreso}
        options={{ title: "Ver ingreso" }}
      />
      <Stack.Screen
        name="IngresoDetalle"
        component={IngresoDetalle}
        options={{ title: "Detalle del Ingreso" }}
      />
    </Stack.Navigator>
  );
}
                                      
const TabBarNavigator = createBottomTabNavigator();
const TabNavigator = () => {
  return(
      <TabBarNavigator.Navigator
      
      screenOptions={{
        headerShown: false ,
        tabBarActiveTintColor: '#22806b',
         tabBarStyle: {
            position: 'absolute',
            bottom:10,
            right:20,
            left:20,
            borderRadius:15,
            backgroundColor: '#ffffff',
            minHeight: 50,
            elevation:0,
            ... styles.shadow
        },
         
          }}
      >      
          <TabBarNavigator.Screen 
          name="Totales" 
          component={Totales}
          options={{
            tabBarLabel: 'Total',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="text-box-check-outline" size={size} color={color} />
            ),
           
          }} />
          <TabBarNavigator.Screen 
          name="Veringreso" 
          component={MyStack} 
           options={{
            tabBarLabel: 'Ingresos',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="view-list" size={size} color={color} />
            ),
          }}/>
             <TabBarNavigator.Screen 
             name={"NuevoIngreso"} 
             component={NuevoIngreso} 
             options={{
             tabBarLabel: '  ',
            tabBarButton: (props) => (

            <TouchableOpacity onPress={() => props.onPress()}>
              <View style={{
                width: 55,
                height: 55,
                backgroundColor: '#22806b',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 20
              }}
              >
                <Image 
                source={plus} 
                style={{
                  width: 22,
                  height: 22,
                  tintColor: 'white',
                }}
                ></Image>
              </View>
            </TouchableOpacity>
          )
        }}></TabBarNavigator.Screen>
          <TabBarNavigator.Screen 
          name="ModificarCategoria" 
          component={ModificarCategoria} 
          options={{
            tabBarLabel: 'Modificar',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="autorenew" size={size} color={color} />
            ),
          }}/>
          <TabBarNavigator.Screen 
          name="AnadirCategoria" 
          component={AnadirCategoria}
          options={{
            tabBarLabel: 'Añadir',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chart-box-plus-outline" size={size} color={color} />
            ),
          }} />
      </TabBarNavigator.Navigator>
  )
}
const styles = StyleSheet.create({
    shadow : {
        shadowColor: '#7F5DF0',  
        shadowOffset: {
          width:0 ,
          height: 10 ,
        },
        shadowOpacity : -0.25,
        shadowRadius : 3.5 ,
        elevation : 5
  }});

export default TabNavigator