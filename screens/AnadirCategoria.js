import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Alert
} from "react-native";
import { Button } from "@rneui/themed";
import { dbcat } from "../Database/firebase.js";
import { ref, get, update } from "firebase/database";
import Loader from "../Component/Loader.js";

var heightY = Dimensions.get("window").height;
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
    Calorias: "x",
  });
  const [loading, setLoading] = useState(true);
  const saveNewCat = async () => {
    let calorias = Number(ingreso.Calorias.replace(/,/g, "."));
    if (!calorias || calorias < 0 || !ingreso.Alimento || !ingreso.Porcion ) {
      Alert.alert("", "Complete todos los datos");
    } else
      try {
        setLoading(true);
        const dbRef = ref(dbcat, "categorias/" + ingreso.Id);
        update(dbRef, {
          Id: ingreso.Id,
          Alimento: ingreso.Alimento,
          Porcion: ingreso.Porcion,
          Calorias: ingreso.Calorias,
        }).then(() => {
          Alert.alert("","Agregado");
          setLoading(false);
          props.navigation.navigate("NuevoIngreso");
        });
      } catch (e) {
        setLoading(false);
        Alert.alert(e);
      }
  };

  if (loading) {
    return <Loader setLoading={setLoading} navigation={props.navigation} />;
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titulo}> AÑADIR ALIMENTOS</Text>
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
            placeholder="Ej: 1 Botella(500ml)"
            onChangeText={(value) => setIngreso({ ...ingreso, Porcion: value })}
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Calorias PP </Text>
          <TextInput
            style={styles.input3}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={(value) =>
              setIngreso({
                ...ingreso,
                Calorias: value,
                Id: Number(categorias[categorias.length - 1].Id) + 1,
              })
            }
          ></TextInput>
        </SafeAreaView>

        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Agregar"
            onPress={() => saveNewCat()}
            color="#8FBC8F"
          />
        </View>

        <View style={styles.buttton}></View>
      </View>
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
    marginBottom: 30,
    fontWeight: "bold",
  },
  container: {
    marginTop: 80,
  },
  formulario: {
    flexDirection: "row",
  },
  text: {
    fontSize: heightY * 0.027,
    width: "48.5%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  input3: {
    height: 60,
    borderWidth: 0.5,
    padding: 10,
    width: "48.5%",
    fontSize: 15,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "left",
  },
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 30,
    marginStart: 25,
  },
});

export default AnadirCategoria;
