import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTema } from "../theme";

export default function Home({ navigation }) {
  const { tema } = useTema();
  const s = estilos(tema);

  const [fazenda, setFazenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("INFORMACOES");
      if (raw) setFazenda(JSON.parse(raw));
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar();
  }, [carregar]);

  async function sair() {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("Logado");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />

      <View style={s.header}>
        <View style={s.headerTop}>
          <View style={s.divider} />
          <TouchableOpacity onPress={sair}>
            <Text style={s.sairTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.titulo}>FAZENDAS</Text>
        <Text style={s.subtitulo}>
          {fazenda ? "1 fazenda monitorada" : "Nenhuma fazenda cadastrada"}
        </Text>
      </View>

      {loading ? (
        <View style={s.centrado}>
          <Text style={s.loadingTexto}>Carregando...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.lista}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tema.acento}
            />
          }
        >
          {fazenda ? (
            <View style={s.card}>
              <View style={s.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardNome}>{fazenda.nomeFazenda}</Text>
                  <Text style={s.cardDono}>👤 {fazenda.nome}</Text>
                </View>
              </View>

              <Text style={s.secaoLabel}>TALHÕES</Text>
              <View style={s.talhaoVazio}>
                <Text style={s.talhaoVazioTexto}>
                  Nenhuma plantação cadastrada.
                </Text>
                <TouchableOpacity
                  style={s.btnPlantacao}
                  onPress={() => navigation.navigate("plantacao")}
                  activeOpacity={0.85}
                >
                  <Feather name="plus" size={14} color="#1A1A1A" />
                  <Text style={s.btnPlantacaoTexto}>NOVA PLANTAÇÃO</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={s.centrado}>
              <Text style={s.emptyTexto}>Nenhuma fazenda cadastrada.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const estilos = (tema) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.fundo },
    centrado: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 60,
    },
    loadingTexto: {
      color: tema.textoSecundario,
      fontSize: 13,
      letterSpacing: 1,
    },
    emptyTexto: { color: tema.textoBotaoIcone, fontSize: 14 },
    header: { paddingTop: 64, paddingBottom: 24, paddingHorizontal: 24 },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    divider: { width: 40, height: 3, backgroundColor: tema.acento },
    titulo: {
      fontSize: 28,
      fontWeight: "900",
      color: tema.texto,
      letterSpacing: 5,
    },
    subtitulo: {
      fontSize: 11,
      color: tema.textoSecundario,
      marginTop: 4,
      letterSpacing: 1,
    },
    sairTexto: {
      fontSize: 12,
      color: tema.acento,
      fontWeight: "700",
      letterSpacing: 1,
    },
    lista: { padding: 16 },
    card: {
      backgroundColor: tema.fundoCard,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 3,
      borderLeftColor: tema.acento,
      borderWidth: 0.5,
      borderColor: tema.borda,
    },
    cardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    cardNome: { fontSize: 16, fontWeight: "800", color: tema.texto },
    cardDono: { fontSize: 11, color: tema.textoSecundario, marginTop: 3 },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#22C55E",
      backgroundColor: "#22C55E22",
      marginLeft: 8,
    },
    badgeTexto: { fontSize: 11, fontWeight: "700", color: "#22C55E" },
    secaoLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: tema.acento,
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    talhaoVazio: {
      backgroundColor: tema.fundo,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      gap: 12,
      borderWidth: 0.5,
      borderColor: tema.borda,
    },
    talhaoVazioTexto: { fontSize: 12, color: tema.textoBotaoIcone },
    btnPlantacao: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: tema.acento,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 4,
    },
    btnPlantacaoTexto: {
      fontSize: 11,
      fontWeight: "800",
      color: "#1A1A1A",
      letterSpacing: 2,
    },
  });
