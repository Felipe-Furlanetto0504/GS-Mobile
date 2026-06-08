import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTema } from "../theme";

export default function Home({ navigation }) {
  const { tema } = useTema();
  const s = estilos(tema);

  const [fazenda, setFazenda] = useState(null);
  const [plantacoes, setPlantacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function carregar() {
    try {
      const rawFazenda = await AsyncStorage.getItem("INFORMACOES");
      const rawPlantacoes = await AsyncStorage.getItem("PLANTACOES");
      if (rawFazenda) setFazenda(JSON.parse(rawFazenda));
      if (rawPlantacoes) setPlantacoes(JSON.parse(rawPlantacoes));
      else setPlantacoes([]);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

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

  const STATUS_CONFIG = {
    PLANTADO: { cor: "#4CAF7D", icone: "activity" },
    PREPARACAO: { cor: "#C8A96E", icone: "tool" },
    DESCANSO: { cor: "#7B8FA1", icone: "moon" },
  };

  function renderPlantacao({ item }) {
    const partes = item.dataPlantio?.split("/") || [];
    const dia = partes[0] || "--";
    const mes = partes[1] || "--";
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.PLANTADO;

    return (
      <View style={s.plantacaoCard}>
        <View style={s.plantacaoData}>
          <Text style={s.plantacaoDia}>{dia}</Text>
          <Text style={s.plantacaoMes}>/{mes}</Text>
        </View>
        <View style={s.plantacaoInfo}>
          <Text style={s.plantacaoNome}>{item.cultura}</Text>
          <View style={s.plantacaoLinha}>
            <Feather name="map-pin" size={11} color="#C8A96E" />
            <Text style={s.plantacaoDetalhe}> {item.talhao}</Text>
          </View>
          <View style={s.plantacaoLinha}>
            <Feather name={config.icone} size={11} color={config.cor} />
            <Text style={[s.plantacaoDetalhe, { color: config.cor }]}>
              {" "}
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={s.plantacaoArea}>{item.area} ha</Text>
      </View>
    );
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
              onRefresh={() => {
                setRefreshing(true);
                carregar();
              }}
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

              <Text style={s.secaoLabel}>
                TALHÕES {plantacoes.length > 0 ? `(${plantacoes.length})` : ""}
              </Text>

              {plantacoes.length === 0 ? (
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
              ) : (
                <>
                  <FlatList
                    data={plantacoes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPlantacao}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 8 }} />
                    )}
                  />
                  <TouchableOpacity
                    style={[
                      s.btnPlantacao,
                      { marginTop: 12, alignSelf: "center" },
                    ]}
                    onPress={() => navigation.navigate("plantacao")}
                    activeOpacity={0.85}
                  >
                    <Feather name="plus" size={14} color="#1A1A1A" />
                    <Text style={s.btnPlantacaoTexto}>NOVA PLANTAÇÃO</Text>
                  </TouchableOpacity>
                </>
              )}
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
    lista: { padding: 16, paddingBottom: 100 },
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
    plantacaoCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tema.fundo,
      borderRadius: 10,
      padding: 12,
      borderWidth: 0.5,
      borderColor: tema.borda,
      borderLeftWidth: 3,
      borderLeftColor: tema.acento,
    },
    plantacaoData: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: tema.fundoIcone,
      borderRadius: 8,
      width: 44,
      height: 44,
      marginRight: 12,
    },
    plantacaoDia: {
      fontSize: 17,
      fontWeight: "900",
      color: tema.acento,
      lineHeight: 19,
    },
    plantacaoMes: { fontSize: 10, color: tema.acento },
    plantacaoInfo: { flex: 1, gap: 3 },
    plantacaoNome: { fontSize: 13, fontWeight: "700", color: tema.texto },
    plantacaoLinha: { flexDirection: "row", alignItems: "center" },
    plantacaoDetalhe: { fontSize: 11, color: tema.textoSecundario },
    plantacaoArea: {
      fontSize: 13,
      fontWeight: "700",
      color: tema.textoSecundario,
    },
  });
