import { useEffect, useState } from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil() {
  const [dados, SetDados] = useState(null);

  useEffect(() => {
    async function carregar() {
      const dadosSalvos = await AsyncStorage.getItem("INFORMACOES");
      if (dadosSalvos) {
        SetDados(JSON.parse(dadosSalvos));
      }
    }
    carregar();
  }, []);

  if (!dados) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>CARREGANDO...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      <View style={styles.header}>
        <View style={styles.dividerTop} />
        <Text style={styles.titulo}>PERFIL</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {dados.nome?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.nomeDestaque}>{dados.nome}</Text>
        <Text style={styles.fazendaDestaque}>{dados.nomeFazenda}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>NOME COMPLETO</Text>
          <Text style={styles.itemValor}>{dados.nome}</Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.item}>
          <Text style={styles.itemLabel}>CPF</Text>
          <Text style={styles.itemValor}>{dados.cpf}</Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.item}>
          <Text style={styles.itemLabel}>NOME DA FAZENDA</Text>
          <Text style={styles.itemValor}>{dados.nomeFazenda}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 28,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 11,
    letterSpacing: 2,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 32,
  },
  dividerTop: {
    width: 40,
    height: 3,
    backgroundColor: "#C8A96E",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 6,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#C8A96E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarLetra: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1A1A1A",
  },
  nomeDestaque: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F0EDE6",
    letterSpacing: 1,
  },
  fazendaDestaque: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#242424",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 18,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C8A96E",
    letterSpacing: 2,
    marginBottom: 6,
  },
  itemValor: {
    fontSize: 15,
    color: "#F0EDE6",
    letterSpacing: 0.3,
  },
  separador: {
    height: 1,
    backgroundColor: "#2E2E2E",
  },
});