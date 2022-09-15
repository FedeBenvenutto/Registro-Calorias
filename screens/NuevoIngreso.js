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
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import SelectDropdown from "react-native-select-dropdown";
import { MomentosdelDia as MomentodelDia } from "../Database/Otraslistas.js";
import { FechaContext } from "../Context/FechaContext.js";
import SpeedDialComp from "../Component/SpeedDial.js";
import { ref, get } from "firebase/database";
import { DatePicker } from 'react-native-woodpicker'

const NuevoIngreso = (props) => {
  const { fechaDb, setMes, setAno, setDia, Meses} = useContext(FechaContext);
  const [categorias, setCategorias] = useState();
  const [pickedDate, setPickedDate] = useState(new Date());

  useEffect(() => {
    setAno((pickedDate.getFullYear()).toString());
    setMes(Meses[pickedDate.getMonth()])
    setDia(pickedDate.getDate())
  }, [pickedDate]); 

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
  if (categorias) {
  var AlimentoFiltrado = categorias
    .filter((val) =>
      String(val.Alimento)
        .toLowerCase()
        .includes(String(valueAlimentos).toLowerCase()))
    .splice(0, 30)}
  const [loading, setLoading] = useState(true);
  const saveNewIngreso = async () => {
    let calorias = Number(ingreso.Calorias);
    let cantidadPorcion = Number(ingreso.Cantidad.replace(/,/g, "."));
    if (!cantidadPorcion || cantidadPorcion < 0) {
      Alert.alert("", "Ingrese una porción válida");
    } else if (isNaN(ingreso.AlimentoId) || isNaN(ingreso.MomentodelDiaIndex)) {
      Alert.alert("", "Complete todos los campos");
    } else
      try {
        setLoading(true);
        const docRef = await addDoc(collection(db, fechaDb), {
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
        });
        setIngreso({
          MomentodelDia: "",
          MomentodelDiaIndex: "x",
          Alimento: "",
          AlimentoId: "x",
          Porcion: "",
          Cantidad: "",
          Comentario: "",
          TotalCalorias: "",
        });
        setLoading(false);
        alert("", "Agregado");
      } catch (e) {
        setLoading(false);
        alert(e);
      }
  };
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
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>INGRESO NUEVO ALIMENTO</Text>
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
        <View>
      
    </View>

        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Momento </Text>
          <SelectDropdown
            data={MomentodelDia}
            onSelect={(selectedItem, index) => {
              setIngreso({
                ...ingreso,
                MomentodelDia: selectedItem,
                MomentodelDiaIndex: index,
              });
            }}
            buttonStyle={styles.dropdown}
            defaultButtonText={"Seleccione una opción"}
            dropdownStyle={{ marginStart: -60, width: 260 }}
            rowStyle={styles.dropdown1RowStyle}
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
            title="Agregar"
            onPress={() => saveNewIngreso()}
          />
        </View>

        <View style={styles.buttton}></View>
      </ScrollView>
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
    textAlign: "center",
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
  pickerStyle: {
    height: 50,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 10,
    width: 200,
    marginTop: 10,
    textAlign: 'center',
    alignContent: 'center',
  },
  textPicker: {
    alignSelf: 'center',
    fontSize: 15
  }
});

export default NuevoIngreso;
