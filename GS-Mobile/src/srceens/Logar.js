import { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,KeyboardAvoidingView,Platform,StatusBar,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, SetEmail] = useState("");
  const [nomeFazenda, SetNomeFazenda] = useState("");
  const [senha, SetSenha] = useState("");
  const [mostrarSenha, SetMostrarSenha] = useState(false);

  async function logar() {
    if (!email || !nomeFazenda || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const dados = await AsyncStorage.getItem("INFORMACOES");
    if (!dados) {
      Alert.alert("Erro", "Nenhum cadastro encontrado");
      return;
    }
    const obj = JSON.parse(dados);
    if (obj.email === email && obj.senha === senha) {
      await AsyncStorage.setItem("Logado", "true");
      navigation.reset({ index: 0, routes: [{ name: "App" }] });
    } else {
      Alert.alert("Erro", "Email ou senha incorretos");
    }
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.dividerTop} />
            <Text style={styles.title}>ACESSO</Text>
            <Text style={styles.subtitle}>Entre com suas credenciais</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#666"
                value={email}
                onChangeText={SetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>NOME DA FAZENDA</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome da fazenda"
                placeholderTextColor="#666"
                value={nomeFazenda}
                onChangeText={SetNomeFazenda}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.senhaWrapper}>
                <TextInput
                  style={[styles.input, styles.senhaInput]}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#666"
                  value={senha}
                  onChangeText={SetSenha}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.olhoBtn}
                  onPress={() => SetMostrarSenha(!mostrarSenha)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.olhoTexto}>
                    {mostrarSenha ? "OCULTAR" : "MOSTRAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnPrimario}
              onPress={logar}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimarioText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 48,
  },
  dividerTop: {
    width: 40,
    height: 3,
    backgroundColor: "#C8A96E",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  form: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C8A96E",
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1.5,
    borderBottomColor: "#333",
    paddingHorizontal: 0,
    paddingVertical: 12,
    fontSize: 15,
    color: "#F0EDE6",
  },
  senhaWrapper: {
    position: "relative",
  },
  senhaInput: {
    paddingRight: 80,
  },
  olhoBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  olhoTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C8A96E",
    letterSpacing: 1.5,
  },
  btnPrimario: {
    backgroundColor: "#C8A96E",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnPrimarioText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 3,
  },
});