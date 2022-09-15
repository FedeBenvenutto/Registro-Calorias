import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ActivityIndicator} from "react-native";
import { ListItem } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../Database/firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FechaContext } from "../Context/FechaContext.js";
import { MomentosdelDia as MomentodelDia } from "../Database/Otraslistas.js";
import SpeedDialComp from "../Component/SpeedDial.js";
import { DatePicker } from 'react-native-woodpicker'



const Totales = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(true);
  const {fechaDb, Meses, DiasSemana, setAno, setMes, setDia } = useContext(FechaContext);
  const [pickedDate, setPickedDate] = useState(new Date());
  useEffect(() => {
    setAno((pickedDate.getFullYear()).toString());
    setMes(Meses[pickedDate.getMonth()])
    setDia(pickedDate.getDate())
  }, [pickedDate]); 

  useEffect(() => {
    const collectionRef = collection(db, fechaDb);
    const q = query(collectionRef);
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
  var sumaTotal = 0;
  var sumaMom = [0, 0, 0, 0, 0, 0, 0];
  ingresos.forEach((ingreso) => {
    sumaTotal += Number(ingreso.TotalCalorias);
    sumaMom[ingreso.MomentodelDiaIndex] += Number(ingreso.TotalCalorias);
  });

  return (
    <>
      <View style={styles.container}>
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
          <ListItem.Accordion
            content={
              <>
                <ListItem.Content>
                  <ListItem.Title style={styles.text}>
                    TOTAL CALORIAS DEL DÍA
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={expanded}
            onPress={() => {
              setExpanded(!expanded);
            }}
          >
            <ListItem.Content>
              <ListItem.Title style={styles.text3}>
                 {sumaTotal}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem.Accordion>
          <ListItem.Accordion
            content={
              <>
                <ListItem.Content>
                  <ListItem.Title style={styles.text}>
                    TOTAL POR MOMENTO DEL DÍA
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={expanded2}
            onPress={() => {
              setExpanded2(!expanded2);
            }}
          >
            <ListItem.Content>
              {MomentodelDia.map((ingreso, i) => (
                <ListItem.Title style={styles.text2} key={i}>
                  {" "}
                  {MomentodelDia[i]} :  {sumaMom[i]}
                </ListItem.Title>
              ))}
            </ListItem.Content>
          </ListItem.Accordion>
        </ScrollView>
      </View>
      <SpeedDialComp />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 19,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    marginStart: 10,
  },
  text2: {
    fontSize: 18,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "darkkhaki",
    width: 400,
  },
  text3: {
    fontSize: 20,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "darkkhaki",
    width: 400,
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

export default Totales;
