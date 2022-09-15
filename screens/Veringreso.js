import React, { useState, useEffect, useContext} from "react";
import { StyleSheet, View, ActivityIndicator} from "react-native";
import { ListItem} from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../Database/firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FechaContext } from "../Context/FechaContext.js";
import SpeedDialComp from "../Component/SpeedDial.js";
import { DatePicker } from 'react-native-woodpicker'


const Vergastos = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fechaDb, Meses, DiasSemana, setAno, setMes, setDia } = useContext(FechaContext);
  const [pickedDate, setPickedDate] = useState(new Date());
  useEffect(() => {
    setAno((pickedDate.getFullYear()).toString());
    setMes(Meses[pickedDate.getMonth()])
    setDia(pickedDate.getDate())
  }, [pickedDate]); 
 
  useEffect(() => {
    const collectionRef = collection(db, fechaDb);
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setIngresos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          MomentodelDia: doc.data().MomentosdelDia,
          MomentodelDiaIndex: doc.data().MomentodelDiaIndex,
          Alimento: doc.data().Alimento,
          AlimentoId: doc.data().AlimentoId,
          Porcion: doc.data().Porcion,
          Calorias: doc.data().Calorias,
          Cantidad: doc.data().Cantidad,
          Comentario: doc.data().Comentario,
          TotalCalorias: doc.data().TotalCalorias,
          createdAt: doc.data().createdAt,
        }))
      );
      setLoading(false);
    });
    return unsuscribe;
  }, [pickedDate, fechaDb]);
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <>
      <View>
      <DatePicker
        value={pickedDate}
        onDateChange={(date) => setPickedDate(date)}
        title="Date Picker"
        text={fechaDb}
        isNullable={false}
        style={styles.pickerStyle}
        androidDisplay="default"
      />
        <ScrollView>
          {ingresos.map((ingreso) => {
            var dia = ingreso.createdAt.toDate().getDate();
            var mes = Meses[ingreso.createdAt.toDate().getMonth()].slice(0, 3);
            var diasemana = DiasSemana[ingreso.createdAt.toDate().getDay()].slice(0,3);
            var hora = ingreso.createdAt.toDate().getHours();
            var minuto = String(ingreso.createdAt.toDate().getMinutes());
            if (minuto.length === 1) {
              minuto = "0" + minuto;
            }

            return (
              <ListItem
                key={ingreso.id}
                bottomDivider
                onPress={() => {
                  props.navigation.navigate("IngresoDetalle", {
                    ingresoId: ingreso.id,
                  });
                }}
              >

                <ListItem.Content>
                  <ListItem.Title>Momento del día: {ingreso.MomentodelDia}</ListItem.Title>
                  <ListItem.Subtitle>
                    Alimento: {ingreso.Alimento}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    TotalCalorias: {ingreso.TotalCalorias}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Comentario: {ingreso.Comentario}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Fecha de carga: {diasemana} {dia} {mes} {hora}:{minuto}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </ScrollView>
      </View>
      <SpeedDialComp />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerStyle: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    textAlign: 'flex-end',
    height: 50,
    marginStart: 10,
    width: 185,
  },
});

export default Vergastos;
