import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Button } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../Database/firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FechaContext } from "../Context/FechaContext.js";
import { DatePicker } from "react-native-woodpicker";
import Loader from "../Component/Loader.js";

const Vergastos = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fechaDb, Meses, DiasSemana, setAno, setMes, setDia } =
    useContext(FechaContext);
  const [pickedDate, setPickedDate] = useState(new Date());
  useEffect(() => {
    setAno(pickedDate.getFullYear().toString());
    setMes(Meses[pickedDate.getMonth()]);
    setDia(pickedDate.getDate());
  }, [pickedDate]);

  useEffect(() => {
    const collectionRef = collection(db, fechaDb);
    const q = query(collectionRef, orderBy("MomentodelDiaIndex", "asc"));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setIngresos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          MomentodelDia: doc.data().MomentodelDia,
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
          textInputStyle={{ textAlign: "right" }}
        />
        <ScrollView>
          {ingresos.map((ingreso) => {
            var dia = ingreso.createdAt.toDate().getDate();
            var mes = Meses[ingreso.createdAt.toDate().getMonth()].slice(0, 3);
            var diasemana = DiasSemana[
              ingreso.createdAt.toDate().getDay()
            ].slice(0, 3);
            var hora = ingreso.createdAt.toDate().getHours();
            var minuto = String(ingreso.createdAt.toDate().getMinutes());
            if (minuto.length === 1) {
              minuto = "0" + minuto;
            }

            return (
              <ListItem
                key={ingreso.id}
                bottomDivider
                containerStyle={styles.lista}
                onPress={() => {
                  props.navigation.navigate("IngresoDetalle", {
                    ingresoId: ingreso.id,
                  });
                }}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    Momento del d??a: {ingreso.MomentodelDia}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    Alimento: {ingreso.Alimento}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Total Calorias: {ingreso.TotalCalorias}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    maxHeight: "85%"
  },
  pickerStyle: {
    alignContent: "flex-end",
    marginEnd: 10,
    height: 50,
    marginStart: "auto",
    width: "50%",
  },
  lista: {
    backgroundColor: "burlywood",
    marginTop: 5,
    alignContent: "center",
    marginStart: 5,
    marginEnd: 10,
    borderRadius: 30
  },
});

export default Vergastos;
