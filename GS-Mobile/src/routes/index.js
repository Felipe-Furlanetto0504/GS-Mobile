import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cadastrar from "../srceens/Cadastrar";
import Login from "../srceens/Logar";
import TabRoutes from "./tab.routes";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [telaInicial, SetTelaInicial] = useState(null);

  useEffect(() => {
    async function verificar() {
      try {
        await AsyncStorage.clear();
        SetTelaInicial("Cadastro");
      } catch (error) {
        console.log("Erro:", error);
        SetTelaInicial("Cadastro");
      }
    }
    verificar();
  }, []);

  if (!telaInicial) {
    return (
      <View style={styles.container}>
        <View style={styles.divider} />
        <Text style={styles.titulo}>CAMPO & GESTÃO</Text>
        <ActivityIndicator size="large" color="#C8A96E" style={styles.loader} />
        <Text style={styles.subtitulo}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={telaInicial}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Cadastro" component={Cadastrar} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={TabRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#C8A96E",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 6,
  },
  loader: {
    marginTop: 40,
  },
  subtitulo: {
    fontSize: 11,
    color: "#666",
    letterSpacing: 2,
    marginTop: 12,
    textTransform: "uppercase",
  },
});