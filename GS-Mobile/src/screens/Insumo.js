import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTema } from "../theme";

const API_BASE_URL = "https://agrovision-gs-fewn.onrender.com";

async function fetchComToken(path, options = {}) {
  const token = await AsyncStorage.getItem("token");
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export default function Insumo() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const s = estilos(tema);

  const [insumos, setInsumos] = useState([]);
  const [plantacoes, setPlantacoes] = useState([]);
  const [loadingLista, setLoadingLista] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeInsumo, setNomeInsumo] = useState("");
  const [qtdEstoque, setQtdEstoque] = useState("");
  const [plantacaoSelecionada, setPlantacaoSelecionada] = useState(null);

  async function carregarDados() {
    setLoadingLista(true);
    try {
      const rawUsuario = await AsyncStorage.getItem("usuarioLogado");
      if (!rawUsuario) return;
      const usuario = JSON.parse(rawUsuario);

      const resPlantacoes = await fetchComToken(
        `/api/plantacoes/usuario/${usuario.id}`,
      );
      if (resPlantacoes.ok) {
        const data = await resPlantacoes.json();
        setPlantacoes(data);

        const todosInsumos = [];
        for (const p of data) {
          const resInsumos = await fetchComToken(
            `/api/insumos/plantacao/${p.id}`,
          );
          if (resInsumos.ok) {
            const ins = await resInsumos.json();
            todosInsumos.push(...ins);
          }
        }
        setInsumos(todosInsumos);
      }
    } catch (error) {
      console.error("Erro ao carregar insumos:", error);
      Alert.alert("Erro", "Não foi possível carregar os insumos.");
    } finally {
      setLoadingLista(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, []),
  );

  async function salvarInsumo() {
    if (!nomeInsumo || !qtdEstoque || !plantacaoSelecionada) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos e selecione uma plantação.",
      );
      return;
    }

    setSalvando(true);
    try {
      const response = await fetchComToken("/api/insumos", {
        method: "POST",
        body: JSON.stringify({
          plantacaoId: plantacaoSelecionada.id,
          nomeInsumo: nomeInsumo.trim(),
          qtdEstoque: parseFloat(qtdEstoque),
        }),
      });

      if (response.status === 201) {
        setNomeInsumo("");
        setQtdEstoque("");
        setPlantacaoSelecionada(null);
        setModalVisivel(false);
        await carregarDados();
        Alert.alert("Sucesso", "Insumo cadastrado com sucesso!");
        return;
      }

      const data = await response.json().catch(() => null);
      Alert.alert("Erro", data?.message || "Não foi possível salvar o insumo.");
    } catch (error) {
      console.error("Erro ao salvar insumo:", error);
      Alert.alert(
        "Erro de conexão",
        "Verifique sua internet e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirInsumo(id) {
    Alert.alert("Excluir", "Deseja excluir este insumo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetchComToken(`/api/insumos/${id}`, {
              method: "DELETE",
            });
            if (response.status === 204) {
              setInsumos((prev) => prev.filter((i) => i.id !== id));
            } else {
              Alert.alert("Erro", "Não foi possível excluir o insumo.");
            }
          } catch {
            Alert.alert("Erro de conexão", "Verifique sua internet.");
          }
        },
      },
    ]);
  }

  function renderInsumo({ item }) {
    return (
      <View style={s.card}>
        <View style={s.cardIcone}>
          <MaterialIcons name="inventory" size={22} color={tema.acento} />
        </View>
        <View style={s.cardInfo}>
          <Text style={s.cardNome}>{item.nomeInsumo}</Text>
          <View style={s.cardLinha}>
            <Feather name="package" size={12} color={tema.textoSecundario} />
            <Text style={s.cardDetalhe}> {item.qtdEstoque} un.</Text>
          </View>
          {item.tipoPlantio && (
            <View style={s.cardLinha}>
              <Feather name="sun" size={12} color={tema.acento} />
              <Text style={s.cardDetalhe}> {item.tipoPlantio}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => excluirInsumo(item.id)}
          style={s.cardExcluir}
        >
          <MaterialIcons name="delete-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />

      <View style={s.header}>
        <View style={s.dividerTop} />
        <Text style={s.titulo}>INSUMOS</Text>
      </View>

      {loadingLista ? (
        <View style={s.vazio}>
          <ActivityIndicator size="large" color={tema.acento} />
        </View>
      ) : insumos.length === 0 ? (
        <View style={s.vazio}>
          <Feather name="package" size={56} color={tema.vazioIcone} />
          <Text style={s.vazioTexto}>Nenhum insumo cadastrado</Text>
          <Text style={s.vazioSubTexto}>Toque no botão para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={insumos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderInsumo}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[s.botaoAdicionar, { marginBottom: 64 + insets.bottom + 16 }]}
        onPress={() => {
          if (plantacoes.length === 0) {
            Alert.alert(
              "Atenção",
              "Cadastre uma plantação antes de adicionar insumos.",
            );
            return;
          }
          setModalVisivel(true);
        }}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color={tema.acentoTexto} />
        <Text style={s.botaoAdicionarTexto}>NOVO INSUMO</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="fade" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitulo}>NOVO INSUMO</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={tema.textoBotaoIcone}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.label}>PLANTAÇÃO</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 4 }}
              >
                <View style={s.plantacaoContainer}>
                  {plantacoes.map((p) => {
                    const selecionado = plantacaoSelecionada?.id === p.id;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          s.plantacaoBotao,
                          selecionado && s.plantacaoBotaoSelecionado,
                        ]}
                        onPress={() => setPlantacaoSelecionada(p)}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            s.plantacaoBotaoTexto,
                            selecionado && s.plantacaoBotaoTextoSelecionado,
                          ]}
                        >
                          {p.tipoPlantio} · {p.localPlantio}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <Text style={s.label}>NOME DO INSUMO</Text>
              <TextInput
                value={nomeInsumo}
                onChangeText={setNomeInsumo}
                style={s.input}
                placeholder="Ex: Fertilizante, Defensivo..."
                placeholderTextColor={tema.textoPlaceholder}
                maxLength={50}
              />

              <Text style={s.label}>QUANTIDADE EM ESTOQUE</Text>
              <View style={s.localContainer}>
                <Feather
                  name="package"
                  size={18}
                  color={tema.textoBotaoIcone}
                  style={s.localIcone}
                />
                <TextInput
                  value={qtdEstoque}
                  onChangeText={setQtdEstoque}
                  style={s.localInput}
                  placeholder="Ex: 150.00"
                  placeholderTextColor={tema.textoPlaceholder}
                  keyboardType="numeric"
                />
              </View>

              <View style={s.modalBotoes}>
                <TouchableOpacity
                  style={s.botaoCancelar}
                  onPress={() => setModalVisivel(false)}
                  disabled={salvando}
                >
                  <Text style={s.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.botaoSalvar}
                  onPress={salvarInsumo}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#1A1A1A" size="small" />
                  ) : (
                    <Text style={s.botaoSalvarTexto}>SALVAR</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = (tema) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.fundo, paddingHorizontal: 24 },
    header: { paddingTop: 64, paddingBottom: 28 },
    dividerTop: {
      width: 40,
      height: 3,
      backgroundColor: tema.acento,
      marginBottom: 20,
    },
    titulo: {
      fontSize: 32,
      fontWeight: "900",
      color: tema.texto,
      letterSpacing: 6,
    },
    vazio: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
    vazioTexto: {
      color: tema.vazioTexto,
      fontSize: 15,
      fontWeight: "700",
      marginTop: 12,
      letterSpacing: 0.5,
    },
    vazioSubTexto: {
      color: tema.vazioSubTexto,
      fontSize: 12,
      letterSpacing: 0.5,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tema.fundoCard,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 3,
      borderLeftColor: tema.acento,
    },
    cardIcone: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: tema.fundoIcone,
      borderRadius: 10,
      width: 52,
      height: 52,
      marginRight: 14,
    },
    cardInfo: { flex: 1, gap: 4 },
    cardNome: {
      fontSize: 15,
      fontWeight: "700",
      color: tema.texto,
      marginBottom: 2,
    },
    cardLinha: { flexDirection: "row", alignItems: "center" },
    cardDetalhe: { fontSize: 12, color: tema.textoSecundario },
    cardExcluir: { padding: 4 },
    botaoAdicionar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: tema.acento,
      paddingVertical: 16,
      borderRadius: 4,
      gap: 8,
      marginBottom: 16,
    },
    botaoAdicionarTexto: {
      color: tema.acentoTexto,
      fontWeight: "800",
      fontSize: 13,
      letterSpacing: 2,
    },
    modalFundo: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    modalContainer: {
      backgroundColor: tema.fundoModal,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxHeight: "85%",
      borderWidth: 1,
      borderColor: tema.borda,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitulo: {
      fontSize: 16,
      fontWeight: "900",
      color: tema.texto,
      letterSpacing: 3,
    },
    label: {
      fontSize: 10,
      fontWeight: "700",
      color: tema.acento,
      letterSpacing: 2,
      marginTop: 16,
      marginBottom: 8,
    },
    input: {
      backgroundColor: tema.fundoInput,
      borderBottomWidth: 1.5,
      borderBottomColor: tema.bordaInput,
      paddingVertical: 12,
      paddingHorizontal: 0,
      fontSize: 14,
      color: tema.texto,
    },
    localContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tema.fundoInput,
      borderBottomWidth: 1.5,
      borderBottomColor: tema.bordaInput,
    },
    localIcone: { paddingRight: 8 },
    localInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 14,
      color: tema.texto,
    },
    plantacaoContainer: { flexDirection: "row", gap: 8 },
    plantacaoBotao: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: tema.bordaStatus,
      backgroundColor: tema.fundoStatus,
    },
    plantacaoBotaoSelecionado: {
      borderColor: tema.acento,
      backgroundColor: tema.acento + "22",
    },
    plantacaoBotaoTexto: {
      fontSize: 12,
      color: tema.textoBotaoIcone,
      fontWeight: "600",
    },
    plantacaoBotaoTextoSelecionado: { color: tema.acento, fontWeight: "700" },
    modalBotoes: {
      flexDirection: "row",
      gap: 10,
      marginTop: 28,
      marginBottom: 10,
    },
    botaoCancelar: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 4,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: tema.bordaStatus,
    },
    botaoCancelarTexto: {
      color: tema.textoSecundario,
      fontWeight: "700",
      fontSize: 12,
      letterSpacing: 2,
    },
    botaoSalvar: {
      flex: 1,
      backgroundColor: tema.acento,
      paddingVertical: 14,
      borderRadius: 4,
      alignItems: "center",
    },
    botaoSalvarTexto: {
      color: "#1A1A1A",
      fontWeight: "800",
      fontSize: 12,
      letterSpacing: 2,
    },
  });
