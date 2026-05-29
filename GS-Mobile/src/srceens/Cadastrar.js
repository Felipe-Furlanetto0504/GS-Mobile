import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet,Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaskedTextInput } from "react-native-mask-text";

export default function Cadastrar({ navigation }) {
  const [nome, SetNome] = useState("");
  const [senha, SetSenha] = useState("");
  const [cpf, SetCpf] = useState("");
  const [nomeFazenda, SetNomeFazenda] = useState("");
  const [mostrarSenha, SetMostrarSenha] = useState(false);

  async function salvar() {
    if (!nome || !senha || !cpf || !nomeFazenda) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (cpf.replace(/\D/g, "").length < 11) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      const dados = { nome, senha, cpf, nomeFazenda };
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(dados));
      await AsyncStorage.setItem("INFORMACOES", JSON.stringify(dados));
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        {
          text: "Ir para Login",
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados");
      console.log(error);
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
            <Text style={styles.title}>CADASTRO</Text>
            <Text style={styles.subtitle}>Crie sua conta para continuar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>NOME COMPLETO</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#666"
                value={nome}
                onChangeText={SetNome}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CPF</Text>
              <MaskedTextInput
                mask="999.999.999-99"
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#666"
                value={cpf}
                onChangeText={(text) => SetCpf(text)}
                keyboardType="numeric"
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
                  placeholder="Mínimo 6 caracteres"
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
              onPress={salvar}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimarioText}>CADASTRAR</Text>
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
    paddingTop: 64,
    paddingBottom: 40,
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
    marginBottom: 24,
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
    marginTop: 12,
  },
  btnPrimarioText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 3,
  },
});