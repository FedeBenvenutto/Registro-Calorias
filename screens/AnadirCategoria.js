import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from "@rneui/themed";
import { dbcat } from "../Database/firebase.js";
import { FechaContext } from "../Context/FechaContext.js";
import SpeedDialComp from "../Component/SpeedDial.js";
import { ref, get, update } from "firebase/database";

const AnadirCategoria = (props) => {
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
      alert(e);
      setLoading(false);
    });
    
  }, []);
  
  const [ingreso, setIngreso] = useState({
    Id: "",
    Alimento: "",
    Porcion: "",
    Calorias: "",
  });
  const [loading, setLoading] = useState(true);
  const saveNewCat = async () => {
    let calorias = Number(ingreso.Calorias.replace(/,/g, "."));
    if (!calorias || calorias < 0) {
      alert("", "Ingrese un número de caloría por porción válida");
    } else
      try {
        setLoading(true);
        const dbRef = ref(dbcat, "categorias/" + ingreso.Id);
        update(dbRef, {
            "Id": ingreso.Id,
            "Alimento": ingreso.Alimento,
            "Porcion": ingreso.Porcion,
            "Calorias": ingreso.Calorias
          })
          .then(() => {
            alert("Agregado")
            setLoading(false)
            props.navigation.navigate("NuevoIngreso")
          });
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
        <Text style={styles.titulo}> AÑADIR CATEGORIA</Text>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Nombre del Alimento </Text>
          <TextInput
            style={styles.input3}
            placeholder="Ingrese un nombre"
            onChangeText={(value) =>
                setIngreso({ ...ingreso, Alimento: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Porción </Text>
          <TextInput
            style={styles.input3}
            placeholder= "Ej: 1 Botella(500ml)"
            onChangeText={(value) =>
                setIngreso({ ...ingreso, Porcion: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Calorias PP </Text>
          <TextInput
            style={styles.input3}
            placeholder= "0"
            onChangeText={(value) =>
              setIngreso({ ...ingreso, Calorias : value, Id: Number(categorias[categorias.length - 1].Id) + 1 })
            }
          ></TextInput>
        </SafeAreaView>

        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Agregar"
            onPress={() => saveNewCat()}
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

export default AnadirCategoria;