import React from 'react'
import { PacmanIndicator } from 'react-native-indicators';
import { View,  StyleSheet } from 'react-native';
import { Button } from '@rneui/base';

const Loader = (props) => {
  return (
          <View style={styles.loader}>
        <PacmanIndicator size={100} height= {10}/>
        <Button
          buttonStyle={{ backgroundColor: "gray"}}
          title="Volver"
          onPress={() => {
            props.setLoading(false);
            props.navigation.navigate("NuevoIngreso");
          }}
          containerStyle={{position: 'absolute', top: '60%'}}
        />
      </View>
  )
}

const styles = StyleSheet.create({
    loader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default Loader