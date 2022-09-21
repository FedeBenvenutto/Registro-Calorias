import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, dbcat } from "../Database/firebase.js";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { Button, ListItem } from "@rneui/themed";
import SelectDropdown from "react-native-select-dropdown";
import { FechaContext } from "../Context/FechaContext.js";
import { MomentosdelDia } from "../Database/Otraslistas.js";
import { ref, get } from "firebase/database";
import { DatePicker } from "react-native-woodpicker";
import Loader from "../Component/Loader.js";

var heightY = Dimensions.get("window").height;
const GastoDetalle = (props) => {
  const { fechaDb, setMes, setAno, setDia, Meses } = useContext(FechaContext);
  const [categorias, setCategorias] = useState();
  const [pickedDate, setPickedDate] = useState(new Date());
  useEffect(() => {
    setAno(pickedDate.getFullYear().toString());
    setMes(Meses[pickedDate.getMonth()]);
    setDia(pickedDate.getDate());
  }, [pickedDate]);
  const fetchData = async () => {
    const dbRef = ref(dbcat);
    await get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCategorias(snapshot.val().categorias);
        setLoading(false);
      } else {
        Alert.alert("No se pudieron recuperar los datos");
        setLoading(false);
      }
    });
  };
  const [ingreso, setIngreso] = useState({
    MomentodelDia: "",
    MomentodelDiaIndex: "x",
    Alimento: "",
    AlimentoId: "x",
    Porcion: "",
    Calorias: "",
    Cantidad: "",
    Comentario: "",
    TotalCalorias: "",
  });
  const [valueAlimentos, setvalueAlimentos] = useState();

  const getIngresoById = async (id) => {
    const docRef = doc(db, fechaDb, id);
    try {
      await getDoc(docRef).then((doc) => {
        const ingreso = doc.data();
        setIngreso({ ...ingreso, id: doc.id });
      });
    } catch (e) {
      Alert.alert(e);
      setLoading(false);
    }
  };

  const borrarIngreso = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, fechaDb, props.route.params.ingresoId);
      await deleteDoc(docRef);
      setLoading(false);
      Alert.alert("", "Borrado");
      props.navigation.navigate("Veringreso");
    } catch (e) {
      alert(e);
    }
  };

  const alertaConfirmacion = () => {
    Alert.alert(
      "Eliminando ingreso",
      "¿Esta seguro?",
      [
        { text: "Confirmar", onPress: () => borrarIngreso() },
        { text: "Cancelar", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  const actualizarIngreso = async () => {
    try {
      let cantidadPorcion =
        typeof ingreso.Cantidad === "string"
          ? Number(ingreso.Cantidad.replace(/,/g, "."))
          : ingreso.Cantidad;
      if (!cantidadPorcion || cantidadPorcion < 0) {
        Alert.alert("", "Ingrese una porción válida");
      } else if (
        isNaN(ingreso.AlimentoId) ||
        isNaN(ingreso.MomentodelDiaIndex)
      ) {
        Alert.alert("", "Complete todos los campos");
      } else {
        let calorias = Number(ingreso.Calorias);
        setLoading(true);
        const docRef = doc(db, fechaDb, props.route.params.ingresoId);
        const data = {
          MomentodelDia: ingreso.MomentodelDia,
          MomentodelDiaIndex: ingreso.MomentodelDiaIndex,
          Alimento: ingreso.Alimento,
          AlimentoId: ingreso.AlimentoId,
          Porcion: ingreso.Porcion,
          Calorias: calorias,
          Cantidad: cantidadPorcion,
          Comentario: ingreso.Comentario,
          TotalCalorias: cantidadPorcion * calorias,
          createdAt: new Date(),
        };
        await setDoc(docRef, data);
        setLoading(false);
        Alert.alert("", "Actualizado");
        props.navigation.navigate("Veringreso");
      }
    } catch (e) {
      Alert.alert(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getIngresoById(props.route.params.ingresoId);
    fetchData().catch((e) => {
      Alert.alert(e);
      setLoading(false);
    });
  }, []);
  if (categorias) {
    var AlimentoFiltrado = categorias
      .filter((val) =>
        String(val.Alimento)
          .toLowerCase()
          .includes(String(valueAlimentos).toLowerCase())
      )
      .splice(0, 30);
  }
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader setLoading={setLoading} navigation={props.navigation} />;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>DETALLE DEL INGRESO</Text>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Día </Text>
          <DatePicker
            value={pickedDate}
            onDateChange={(date) => setPickedDate(date)}
            title="Date Picker"
            text={fechaDb}
            isNullable={false}
            style={styles.pickerStyle}
            androidDisplay="default"
            textInputStyle={styles.textPicker}
          />
        </SafeAreaView>

        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Momento </Text>
          <SelectDropdown
            data={MomentosdelDia}
            onSelect={(selectedItem, index) => {
              setIngreso({
                ...ingreso,
                MomentodelDia: selectedItem,
                MomentodelDiaIndex: index,
              });
            }}
            buttonStyle={styles.dropdown}
            defaultButtonText={"Seleccione una opción"}
            dropdownStyle={styles.dropdown2}
            defaultValueByIndex={ingreso.MomentodelDiaIndex}
          />
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Alimento</Text>
          <TextInput
            style={styles.input3}
            value={ingreso.Alimento}
            onChangeText={(value) => {
              setIngreso({
                ...ingreso,
                Alimento: value,
              });
              setvalueAlimentos(value);
            }}
          ></TextInput>
        </SafeAreaView>
        <ScrollView style={styles.lista} nestedScrollEnabled={true}>
          {valueAlimentos && valueAlimentos.length > 2
            ? AlimentoFiltrado.map((val) => (
                <ListItem
                  key={val.Id}
                  bottomDivider
                  onPress={() => {
                    setIngreso({
                      ...ingreso,
                      Alimento: val.Alimento,
                      AlimentoId: val.Id,
                      Porcion: val.Porcion,
                      Calorias: val.Calorias,
                    });
                    setvalueAlimentos("");
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title>{val.Alimento}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ))
            : ""}
        </ScrollView>

        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Porcion</Text>
          <Text style={styles.text2}> {ingreso.Porcion}</Text>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Calorías PP</Text>
          <Text style={styles.text2}> {ingreso.Calorias}</Text>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Cantidad </Text>
          <TextInput
            style={styles.input3}
            defaultvalue="0"
            keyboardType="numeric"
            onChangeText={(value) =>
              setIngreso({ ...ingreso, Cantidad: value })
            }
            value={ingreso.Cantidad.toString()}
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Comentario</Text>
          <TextInput
            style={styles.input3}
            multiline
            value={ingreso.Comentario}
            onChangeText={(value) =>
              setIngreso({ ...ingreso, Comentario: value })
            }
          ></TextInput>
        </SafeAreaView>
        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Actualizar"
            onPress={() => actualizarIngreso()}
            color="#8FBC8F"
          />
        </View>
        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Eliminar"
            color="#c0261c"
            onPress={() => {
              alertaConfirmacion();
            }}
          />
        </View>
        <View style={styles.buttton}></View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  titulo: {
    marginTop: 20,
    alignItems: "center",
    fontSize: heightY * 0.04,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 10,
    fontWeight: "bold",
  },
  container: {
    marginTop: 80,
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
  formulario: {
    flexDirection: "row",
  },
  lista: {
    width: "55%",
    alignContent: "center",
    alignSelf: "center",
    marginStart: "40%",
    maxHeight: "10%",
  },
  text: {
    fontSize: heightY * 0.027,
    width: "48.5%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  text2: {
    fontSize: heightY * 0.02,
    width: "48.5%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  input3: {
    height: "90%",
    borderWidth: 0.5,
    padding: 10,
    width: "48.5%",
    fontSize: heightY * 0.02,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "center",
  },
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 10,
    marginStart: "6.5%",
  },
  dropdown: {
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 10,
    width: "48.5%",
    marginTop: 10,
  },
  dropdown2: {
    marginTop: "-10%",
    width: "50%",
  },
  pickerStyle: {
    height: 50,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 10,
    width: "126%",
    marginTop: 10,
    textAlign: "center",
    alignContent: "center",
  },
  textPicker: {
    alignSelf: "center",
    fontSize: heightY * 0.02,
  },
});

export default GastoDetalle;
