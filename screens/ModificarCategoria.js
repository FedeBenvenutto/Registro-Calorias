import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ListItem, Avatar } from "@rneui/themed";
import { Button } from "@rneui/themed";
import { db, dbcat } from "../Database/firebase.js";
// import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
// import SelectDropdown from "react-native-select-dropdown";
// import { MomentosdelDia } from "../Database/Otraslistas.js";
import { FechaContext } from "../Context/FechaContext.js";
import SpeedDialComp from "../Component/SpeedDial.js";
import { ref, get, update, where, orderByChild, equalTo, query, remove} from "firebase/database";

const ModificarCategoria = (props) => {
  const [categorias, setCategorias] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(dbcat);
      await get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          setCategorias(snapshot.val().categorias);
          setLoading(false);
        } else {
          alert("No se pudieron recuperar los datos");
          setLoading(false);
        }
      });
    };
    fetchData().catch((e) => {
      Alert(e);
      setLoading(false);
    });
  }, []);
  
  const { fechaDb } = useContext(FechaContext);
  const [ingreso, setIngreso] = useState({
    Alimento: "",
    AlimentoId: "x",
    Porcion: "",
    Calorias: "",
  });
  const [valueAlimentos, setvalueAlimentos] = useState();
  if (categorias) { 
  var AlimentoFiltrado = categorias
    .filter((val) =>
      String(val.Alimento)
        .toLowerCase()
        .includes(String(valueAlimentos).toLowerCase()))
    .splice(0, 30)}
  const [loading, setLoading] = useState(true);
  
  const ActualizarCat = async () => {
    let calorias = Number(ingreso.Calorias.replace(/,/g, "."));
    if (!calorias || calorias < 0) {
      alert("", "Ingrese un número de caloría por porción válida");
    } else
      try {
        setLoading(true);
        const dbRef = ref(dbcat, "categorias/");
        let q = query(dbRef, orderByChild("Id"), equalTo(ingreso.AlimentoId));
        get(q).then((results) => 
        results.forEach((snapshot) => {
          const newDbref= ref(dbcat, "categorias/" + snapshot.key);
          update(newDbref, {
              "Id": ingreso.AlimentoId,
              "Alimento": ingreso.Alimento,
              "Porcion": ingreso.Porcion,
              "Calorias": ingreso.Calorias
            })
            .then(() => {
              alert("Actualizado")
              setLoading(false)
              props.navigation.navigate("NuevoIngreso")
            });
        }))
        }
 catch (e) {
  setLoading(false);
  alert(e);
}};
const alertaConfirmacion = () => {
  Alert.alert(
    "Eliminando Categoría",
    "¿Está seguro?",
    [
      { text: "Confirmar", onPress: () => EliminarCat() },
      { text: "Cancelar", onPress: () => console.log("canceled") },
    ],
    {
      cancelable: true,
    }
  );
};
const EliminarCat = async () => {
      try {
      setLoading(true);
      const dbRef = ref(dbcat, "categorias/");
      let q = query(dbRef, orderByChild("Id"), equalTo(ingreso.AlimentoId));
      get(q).then((results) => 
      results.forEach((snapshot) => {
        const newDbref= ref(dbcat, "categorias/" + snapshot.key);
        remove(newDbref)
          .then(() => {
            alert("Eliminado")
            setLoading(false)
            props.navigation.navigate("NuevoIngreso")
          });
      }))
      }
catch (e) {
setLoading(false);
alert(e);
}};

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
        <Button
          buttonStyle={{ backgroundColor: "gray" }}
          title="Volver"
          onPress={() => {
            setLoading(false);
            props.navigation.navigate("NuevoIngreso");
          }}
        />
      </View>
    );
    
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titulo}>MODIFICACION DE CATEGORÍA</Text>

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
        <ScrollView style={styles.formulario2}>
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
          <Text style={styles.text}> Porción </Text>
          <TextInput
            style={styles.input3}
            value={ingreso.Porcion}
            onChangeText={(value) =>
              setIngreso({ ...ingreso, Porcion: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Calorias PP </Text>
          <TextInput
            style={styles.input3}
            value={ingreso.Calorias}
            onChangeText={(value) =>
              setIngreso({ ...ingreso, Calorias: value })
            }
          ></TextInput>
        </SafeAreaView>
        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Actualizar"
            onPress={() => ActualizarCat ()}
          />
        </View>
        <View style={styles.buttton}>
          <Button
            buttonStyle={{ backgroundColor: "red" }}
            containerStyle={styles.buttton}
            title="Eliminar"
            onPress={() => alertaConfirmacion ()}
          />
        </View>

        <View style={styles.buttton}></View>
      </View>
      <SpeedDialComp />
    </>
  );
};

const styles = StyleSheet.create({
  fechaDb: {
    position: "absolute",
    marginTop: 0,
    textAlign: "right",
    width: "100%",
    fontSize: 16,
  },
  titulo: {
    marginTop: 20,
    alignItems: "center",
    fontSize: 30,
    justifyContent: "center",
    textAlign: "center",
    color: "blue",
    marginBottom: 10,
    fontWeight: "bold",
  },
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
  formulario: {
    flexDirection: "row",
  },
  formulario2: {
    width: 200,
    alignContent: "center",
    alignSelf: "center",
    marginStart: 150,
    maxHeight: 300,
  },
  text: {
    fontSize: 20,
    width: 200,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  text2: {
    fontSize: 15,
    width: 200,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  input2: {
    height: 50,
    borderWidth: 0.5,
    padding: 10,
    minWidth: 200,
    fontSize: 15,
    borderRadius: 10,
    textAlign: "center",
  },
  input3: {
    height: 60,
    borderWidth: 0.5,
    padding: 10,
    minWidth: 200,
    maxWidth: 200,
    fontSize: 15,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "left",
  },
  hidden: {
    hidden: false,
    height: 0,
  },
  buttton: {
    width: 320,
    alignContent: "center",
    marginTop: 10,
    marginStart: 25,
  },
  buttton2: {
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "gray",
  },
  dropdown: {
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 10,
    width: 200,
    marginTop: 10,
  },
  lista: {
    position: "relative",
    flexDirection: "row",
    marginTop: 100,
    marginStart: -100,
  },
});

export default ModificarCategoria;
