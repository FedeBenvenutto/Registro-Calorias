import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { ListItem, Button } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../Database/firebase.js";
import { collection, onSnapshot, query } from "firebase/firestore";
import { FechaContext } from "../Context/FechaContext.js";
import { MomentosdelDia as MomentodelDia } from "../Database/Otraslistas.js";
import { DatePicker } from "react-native-woodpicker";
import Loader from "../Component/Loader.js";

var heightY = Dimensions.get("window").height;
const Totales = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(true);
  const { fechaDb, Meses, setAno, setMes, setDia } = useContext(FechaContext);
  const [pickedDate, setPickedDate] = useState(new Date());
  useEffect(() => {
    setAno(pickedDate.getFullYear().toString());
    setMes(Meses[pickedDate.getMonth()]);
    setDia(pickedDate.getDate());
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
    return <Loader setLoading={setLoading} navigation={props.navigation} />;
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
          textInputStyle={{ textAlign: "right" }}
          androidDisplay="default"
        />
        <ScrollView>
          <ListItem.Accordion
            containerStyle={styles.text4}
            content={
              <ListItem.Content>
                <ListItem.Title style={styles.text}>
                  TOTAL CALORIAS DEL DÍA
                </ListItem.Title>
              </ListItem.Content>
            }
            isExpanded={expanded}
            onPress={() => {
              setExpanded(!expanded);
            }}
          >
            <ListItem.Content style={styles.lista}>
              <ListItem.Title style={styles.text3}>{sumaTotal}</ListItem.Title>
            </ListItem.Content>
          </ListItem.Accordion>
          <ListItem.Accordion
            containerStyle={styles.text4}
            content={
              <ListItem.Content>
                <ListItem.Title style={styles.text5}>
                  TOTAL POR MOMENTO DEL DÍA
                </ListItem.Title>
              </ListItem.Content>
            }
            isExpanded={expanded2}
            onPress={() => {
              setExpanded2(!expanded2);
            }}
          >
            <ListItem.Content style={styles.lista}>
              {MomentodelDia.map((ingreso, i) => (
                <ListItem.Title style={styles.text2} key={i}>
                  {" "}
                  {MomentodelDia[i]} : {sumaMom[i]}
                </ListItem.Title>
              ))}
            </ListItem.Content>
          </ListItem.Accordion>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
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
  text: {
    fontSize: heightY * 0.025,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    marginStart: "17%",
    color: "white",
  },
  text2: {
    fontSize: heightY * 0.024,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "chocolate",
    width: "95%",
    marginStart: 10,
    lineHeight: 30,
  },
  text3: {
    fontSize: heightY * 0.027,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "chocolate",
    width: "95%",
    marginStart: 10,
  },
  pickerStyle: {
    alignContent: "flex-end",
    marginEnd: 10,
    height: 50,
    marginStart: "auto",
    width: "50%",
  },
  lista: {
    marginTop: 10,
    marginBottom: 10,
  },
  text4: {
    backgroundColor: "saddlebrown",
  },
  text5: {
    backgroundColor: "saddlebrown",
    fontSize: heightY * 0.024,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "bold",
    marginStart: "5%",
    color: "white",
  },
});

export default Totales;
