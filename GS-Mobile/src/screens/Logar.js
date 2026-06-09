import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaskedTextInput } from "react-native-mask-text";

const API_BASE_URL = "https://agrovision-gs-fewn.onrender.com";

export default function Login({ navigation }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!cpf || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const cpfNumerico = cpf.replace(/\D/g, "");

    if (cpfNumerico.length < 11) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cpf: Number(cpfNumerico),
          senha,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);

        const resUsuarios = await fetch(`${API_BASE_URL}/api/usuarios`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });

        let usuarioId = null;
        if (resUsuarios.ok) {
          const json = await resUsuarios.json();
          console.log("resposta usuarios:", JSON.stringify(json));

          let lista = [];
          if (json?._embedded) {
            lista = Object.values(json._embedded)[0] || [];
          } else if (Array.isArray(json)) {
            lista = json;
          }

          const encontrado = lista.find(
            (u) => Number(u.cpf) === Number(data.cpf),
          );
          console.log("encontrado:", JSON.stringify(encontrado));
          if (encontrado) usuarioId = encontrado.id;
        }

        await AsyncStorage.setItem(
          "usuarioLogado",
          JSON.stringify({
            id: usuarioId,
            cpf: data.cpf,
            nome: data.nome,
            nomeFazenda: data.nomeFazenda,
          }),
        );

        navigation.reset({ index: 0, routes: [{ name: "App" }] });
        return;
      }

      if (response.status === 401 || response.status === 403) {
        Alert.alert("Erro", "CPF ou senha incorretos.");
        return;
      }

      if (response.status === 400) {
        const mensagem =
          data?.message || data?.errors?.join("\n") || "Dados inválidos.";
        Alert.alert("Erro", mensagem);
        return;
      }

      Alert.alert(
        "Erro",
        data?.message || `Erro ao fazer login (status ${response.status}).`,
      );
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
      );
    } finally {
      setCarregando(false);
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
            <Text style={styles.title}>LOGIN</Text>
            <Text style={styles.subtitle}>Entre com sua conta</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CPF</Text>
              <MaskedTextInput
                mask="999.999.999-99"
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#666"
                value={cpf}
                onChangeText={(text) => setCpf(text)}
                keyboardType="numeric"
                editable={!carregando}
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
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  editable={!carregando}
                />
                <TouchableOpacity
                  style={styles.olhoBtn}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                  activeOpacity={0.7}
                  disabled={carregando}
                >
                  <Text style={styles.olhoTexto}>
                    {mostrarSenha ? "OCULTAR" : "MOSTRAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btnPrimario, carregando && styles.btnDesabilitado]}
              onPress={entrar}
              activeOpacity={0.85}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#1A1A1A" size="small" />
              ) : (
                <Text style={styles.btnPrimarioText}>ENTRAR</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#1A1A1A" },
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 48 },
  header: { paddingTop: 64, paddingBottom: 40 },
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
  subtitle: { fontSize: 13, color: "#888", marginTop: 8, letterSpacing: 0.5 },
  form: { flex: 1 },
  fieldGroup: { marginBottom: 24 },
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
  senhaWrapper: { position: "relative" },
  senhaInput: { paddingRight: 80 },
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
    marginTop: 12,
  },
  btnDesabilitado: { opacity: 0.6 },
  btnPrimarioText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 3,
  },
});
