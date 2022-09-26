import React, { useState, useEffect } from "react";
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
import { ListItem, Button } from "@rneui/themed";
import { dbcat } from "../Database/firebase.js";
import {
  ref,
  get,
  update,
  orderByChild,
  equalTo,
  query,
  remove,
} from "firebase/database";
import Loader from "../Component/Loader.js";

var heightY = Dimensions.get("window").height;
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
          Alert.alert("No se pudieron recuperar los datos");
          setLoading(false);
        }
      });
    };
    fetchData().catch((e) => {
      Alert.alert(e);
      setLoading(false);
    });
  }, []);

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
          .includes(String(valueAlimentos).toLowerCase())
      )
      .splice(0, 30);
  }
  const [loading, setLoading] = useState(true);

  const ActualizarCat = async () => {
    let calorias = Number(ingreso.Calorias.replace(/,/g, "."));
    if (!calorias || calorias < 0 || !ingreso.Porcion || !ingreso.Alimento) {
      Alert.alert("", "Complete todos los campos");
    } else
      try {
        setLoading(true);
        const dbRef = ref(dbcat, "categorias/");
        let q = query(dbRef, orderByChild("Id"), equalTo(ingreso.AlimentoId));
        get(q).then((results) =>
          results.forEach((snapshot) => {
            const newDbref = ref(dbcat, "categorias/" + snapshot.key);
            update(newDbref, {
              Id: ingreso.AlimentoId,
              Alimento: ingreso.Alimento,
              Porcion: ingreso.Porcion,
              Calorias: ingreso.Calorias,
            }).then(() => {
              setIngreso({
                Alimento: "",
                AlimentoId: "x",
                Porcion: "",
                Calorias: "",
              });
              Alert.alert("", "Actualizado");
              setLoading(false);
              props.navigation.navigate("NuevoIngreso");
            });
          })
        );
      } catch (e) {
        setLoading(false);
        Alert.alert(e);
      }
  };
  const alertaConfirmacion = () => {
    if (!ingreso.Calorias || !ingreso.Porcion || !ingreso.Alimento) {
      Alert.alert("", "Elija un alimento");
    } else {
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
  }};
  const EliminarCat = async () => {
    try {
      setLoading(true);
      const dbRef = ref(dbcat, "categorias/");
      let q = query(dbRef, orderByChild("Id"), equalTo(ingreso.AlimentoId));
      get(q).then((results) =>
        results.forEach((snapshot) => {
          const newDbref = ref(dbcat, "categorias/" + snapshot.key);
          remove(newDbref).then(() => {
            setIngreso({
              Alimento: "",
              AlimentoId: "x",
              Porcion: "",
              Calorias: "",
            });
            Alert.alert("","Eliminado");
            setLoading(false);
            props.navigation.navigate("NuevoIngreso");
          });
        })
      );
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
        <Text style={styles.titulo}>MODIFICAR ALIMENTOS</Text>

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
          <Text style={styles.text}> Porción </Text>
          <TextInput
            style={styles.input3}
            value={ingreso.Porcion}
            onChangeText={(value) => setIngreso({ ...ingreso, Porcion: value })}
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
            onPress={() => ActualizarCat()}
            color="#8FBC8F"
          />
        </View>
        <View style={styles.buttton2}>
          <Button
            containerStyle={styles.buttton}
            title="Eliminar"
            onPress={() => alertaConfirmacion()}
            color="#c0261c"
          />
        </View>
        <View style={styles.buttton}></View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titulo: {
    marginTop: 55,
    alignItems: "center",
    fontSize: heightY * 0.04,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 30,
    fontWeight: "bold",
  },
  container: {
    marginTop: 50,
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
    fontSize: heightY * 0.021,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "left",
  },
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 30,
    marginStart: "6.5%",
  },
  buttton2: {
    width: "88%",
    alignContent: "center",
    marginTop: 0,
    marginStart: "6.5%",
  },
  lista: {
    width: "55%",
    alignContent: "center",
    alignSelf: "center",
    marginStart: "40%",
    maxHeight: "50%",
  },
});

export default ModificarCategoria;
