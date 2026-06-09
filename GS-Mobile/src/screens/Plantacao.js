import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

function formatarDataParaAPI(data) {
  const p = data.replace(/\D/g, "");
  if (p.length !== 8) return null;
  const dia = p.slice(0, 2),
    mes = p.slice(2, 4),
    ano = p.slice(4);
  if (Number(mes) < 1 || Number(mes) > 12) return null;
  if (Number(dia) < 1 || Number(dia) > 31) return null;
  if (Number(ano) < 2000 || Number(ano) > 2100) return null;
  return `${ano}-${mes}-${dia}`;
}

const STATUS_OPCOES = ["PLANTADO", "PREPARACAO", "DESCANSO"];
const STATUS_CONFIG = {
  PLANTADO: { cor: "#4CAF7D", icone: "activity" },
  PREPARACAO: { cor: "#C8A96E", icone: "tool" },
  DESCANSO: { cor: "#7B8FA1", icone: "moon" },
};

export default function Plantacao() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const s = estilos(tema);

  const [plantacoes, setPlantacoes] = useState([]);
  const [loadingLista, setLoadingLista] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [cultura, setCultura] = useState("");
  const [area, setArea] = useState("");
  const [dataPlantio, setDataPlantio] = useState("");
  const [talhao, setTalhao] = useState("");
  const [status, setStatus] = useState("");

  const [modalColheitaVisivel, setModalColheitaVisivel] = useState(false);
  const [plantacaoSelecionada, setPlantacaoSelecionada] = useState(null);
  const [dataColheita, setDataColheita] = useState("");
  const [qtdColhida, setQtdColhida] = useState("");

  useEffect(() => {
    carregarPlantacoes();
  }, []);

  async function carregarPlantacoes() {
    setLoadingLista(true);
    try {
      const rawUsuario = await AsyncStorage.getItem("usuarioLogado");
      if (!rawUsuario) return;
      const usuario = JSON.parse(rawUsuario);
      const response = await fetchComToken(
        `/api/plantacoes/usuario/${usuario.id}`,
      );
      if (response.ok) setPlantacoes(await response.json());
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as plantações.");
    } finally {
      setLoadingLista(false);
    }
  }

  async function salvarPlantacao() {
    if (!cultura || !area || !dataPlantio || !talhao || !status) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const dataFormatada = formatarDataParaAPI(dataPlantio);
    if (!dataFormatada) {
      Alert.alert("Erro", "Data inválida. Use o formato DD/MM/AAAA.");
      return;
    }
    if (talhao.length > 20) {
      Alert.alert("Erro", "Local deve ter no máximo 20 caracteres.");
      return;
    }
    setSalvando(true);
    try {
      const usuario = JSON.parse(await AsyncStorage.getItem("usuarioLogado"));
      const response = await fetchComToken("/api/plantacoes", {
        method: "POST",
        body: JSON.stringify({
          usuarioId: usuario.id,
          tipoPlantio: cultura.trim(),
          areaPlantio: Number(area),
          dataPlantio: dataFormatada,
          localPlantio: talhao.trim(),
          status,
        }),
      });
      if (response.status === 201) {
        setCultura("");
        setArea("");
        setDataPlantio("");
        setTalhao("");
        setStatus("");
        setModalVisivel(false);
        await carregarPlantacoes();
        Alert.alert("Sucesso", "Plantação cadastrada com sucesso!");
        return;
      }
      const data = await response.json().catch(() => null);
      Alert.alert(
        "Erro",
        data?.message || "Não foi possível salvar a plantação.",
      );
    } catch {
      Alert.alert(
        "Erro de conexão",
        "Verifique sua internet e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirPlantacao(id) {
    Alert.alert("Excluir", "Deseja excluir esta plantação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetchComToken(`/api/plantacoes/${id}`, {
              method: "DELETE",
            });
            if (response.status === 204) {
              setPlantacoes((prev) => prev.filter((p) => p.id !== id));
            } else {
              Alert.alert("Erro", "Não foi possível excluir a plantação.");
            }
          } catch {
            Alert.alert("Erro de conexão", "Verifique sua internet.");
          }
        },
      },
    ]);
  }

  function abrirModalColheita(item) {
    if (item.status !== "PLANTADO") {
      Alert.alert(
        "Ação indisponível",
        "Só é possível registrar colheita em plantações com status PLANTADO.",
      );
      return;
    }
    setPlantacaoSelecionada(item);
    setDataColheita("");
    setQtdColhida("");
    setModalColheitaVisivel(true);
  }

  async function salvarColheita() {
    if (!dataColheita || !qtdColhida) {
      Alert.alert("Erro", "Preencha todos os campos da colheita");
      return;
    }
    const dataFormatada = formatarDataParaAPI(dataColheita);
    if (!dataFormatada) {
      Alert.alert("Erro", "Data inválida. Use o formato DD/MM/AAAA.");
      return;
    }
    setSalvando(true);
    try {
      const response = await fetchComToken("/api/safras", {
        method: "POST",
        body: JSON.stringify({
          plantacaoId: plantacaoSelecionada.id,
          dataColheita: dataFormatada,
          qtdColhida: parseFloat(qtdColhida),
        }),
      });
      if (response.status === 201) {
        await fetchComToken(`/api/plantacoes/${plantacaoSelecionada.id}`, {
          method: "DELETE",
        });
        setModalColheitaVisivel(false);
        setPlantacaoSelecionada(null);
        await carregarPlantacoes();
        Alert.alert(
          "Colheita registrada!",
          `${plantacaoSelecionada.tipoPlantio} colhida com ${qtdColhida} toneladas e removida da lista.`,
        );
        return;
      }
      const data = await response.json().catch(() => null);
      Alert.alert(
        "Erro",
        data?.message || "Não foi possível registrar a colheita.",
      );
    } catch {
      Alert.alert(
        "Erro de conexão",
        "Verifique sua internet e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function renderPlantacao({ item }) {
    const [, mes, dia] = item.dataPlantio?.split("-") || [];
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.PLANTADO;
    return (
      <View style={s.card}>
        <View style={s.cardData}>
          <Text style={s.cardDia}>{dia || "--"}</Text>
          <Text style={s.cardMes}>/{mes || "--"}</Text>
        </View>
        <View style={s.cardInfo}>
          <Text style={s.cardNome}>{item.tipoPlantio}</Text>
          <View style={s.cardLinha}>
            <Feather name="map-pin" size={12} color="#C8A96E" />
            <Text style={s.cardDetalhe}> {item.localPlantio}</Text>
          </View>
          <View style={s.cardLinha}>
            <Feather name="maximize" size={12} color={tema.textoSecundario} />
            <Text style={s.cardDetalhe}> {item.areaPlantio} ha</Text>
          </View>
          <View style={s.cardLinha}>
            <Feather name={config.icone} size={12} color={config.cor} />
            <Text style={[s.cardDetalhe, { color: config.cor }]}>
              {" "}
              {item.status}
            </Text>
          </View>
        </View>
        <View style={s.cardAcoes}>
          <TouchableOpacity
            onPress={() => abrirModalColheita(item)}
            style={s.botaoColher}
            activeOpacity={0.8}
          >
            <MaterialIcons name="grass" size={16} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => excluirPlantacao(item.id)}
            style={s.cardExcluir}
          >
            <MaterialIcons name="delete-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />
      <View style={s.header}>
        <View style={s.dividerTop} />
        <Text style={s.titulo}>PLANTAÇÃO</Text>
      </View>

      {loadingLista ? (
        <View style={s.vazio}>
          <ActivityIndicator size="large" color={tema.acento} />
        </View>
      ) : plantacoes.length === 0 ? (
        <View style={s.vazio}>
          <Feather name="sun" size={56} color={tema.vazioIcone} />
          <Text style={s.vazioTexto}>Nenhuma plantação cadastrada</Text>
          <Text style={s.vazioSubTexto}>Toque no botão para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={plantacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPlantacao}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[s.botaoAdicionar, { marginBottom: 64 + insets.bottom + 16 }]}
        onPress={() => setModalVisivel(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color={tema.acentoTexto} />
        <Text style={s.botaoAdicionarTexto}>NOVA PLANTAÇÃO</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="fade" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitulo}>NOVA PLANTAÇÃO</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={tema.textoBotaoIcone}
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.label}>PLANTIO</Text>
              <TextInput
                value={cultura}
                onChangeText={setCultura}
                style={s.input}
                placeholder="Ex: Soja, Milho, Cana..."
                placeholderTextColor={tema.textoPlaceholder}
              />
              <Text style={s.label}>ÁREA (hectares)</Text>
              <TextInput
                value={area}
                onChangeText={setArea}
                style={s.input}
                placeholder="Ex: 12"
                placeholderTextColor={tema.textoPlaceholder}
                keyboardType="numeric"
              />
              <Text style={s.label}>DATA DE PLANTIO</Text>
              <MaskedTextInput
                mask="99/99/9999"
                value={dataPlantio}
                onChangeText={setDataPlantio}
                style={s.input}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                placeholderTextColor={tema.textoPlaceholder}
              />
              <Text style={s.label}>LOCAL (máx. 20 caracteres)</Text>
              <View style={s.localContainer}>
                <Feather
                  name="map-pin"
                  size={18}
                  color={tema.textoBotaoIcone}
                  style={s.localIcone}
                />
                <TextInput
                  value={talhao}
                  onChangeText={setTalhao}
                  style={s.localInput}
                  placeholder="Ex: Setor A"
                  placeholderTextColor={tema.textoPlaceholder}
                  maxLength={20}
                />
              </View>
              <Text style={s.label}>STATUS</Text>
              <View style={s.statusContainer}>
                {STATUS_OPCOES.map((opcao) => {
                  const selecionado = status === opcao;
                  const config = STATUS_CONFIG[opcao];
                  return (
                    <TouchableOpacity
                      key={opcao}
                      onPress={() => setStatus(opcao)}
                      activeOpacity={0.75}
                      style={[
                        s.statusBotao,
                        selecionado && {
                          borderColor: config.cor,
                          backgroundColor: config.cor + "18",
                        },
                      ]}
                    >
                      <Feather
                        name={config.icone}
                        size={13}
                        color={selecionado ? config.cor : tema.textoBotaoIcone}
                      />
                      <Text
                        style={[
                          s.statusTexto,
                          selecionado && { color: config.cor },
                        ]}
                      >
                        {opcao}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                  onPress={salvarPlantacao}
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

      <Modal visible={modalColheitaVisivel} animationType="fade" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <View>
                <Text style={s.modalTitulo}>REGISTRAR COLHEITA</Text>
                {plantacaoSelecionada && (
                  <Text style={s.modalSubtitulo}>
                    {plantacaoSelecionada.tipoPlantio} ·{" "}
                    {plantacaoSelecionada.localPlantio}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setModalColheitaVisivel(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={tema.textoBotaoIcone}
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.label}>DATA DA COLHEITA</Text>
              <MaskedTextInput
                mask="99/99/9999"
                value={dataColheita}
                onChangeText={setDataColheita}
                style={s.input}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                placeholderTextColor={tema.textoPlaceholder}
              />
              <Text style={s.label}>QUANTIDADE COLHIDA (toneladas)</Text>
              <View style={s.localContainer}>
                <MaterialIcons
                  name="grass"
                  size={18}
                  color={tema.textoBotaoIcone}
                  style={s.localIcone}
                />
                <TextInput
                  value={qtdColhida}
                  onChangeText={setQtdColhida}
                  style={s.localInput}
                  placeholder="Ex: 45.80"
                  placeholderTextColor={tema.textoPlaceholder}
                  keyboardType="numeric"
                />
              </View>
              <View style={s.modalBotoes}>
                <TouchableOpacity
                  style={s.botaoCancelar}
                  onPress={() => setModalColheitaVisivel(false)}
                  disabled={salvando}
                >
                  <Text style={s.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.botaoColherModal}
                  onPress={salvarColheita}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#1A1A1A" size="small" />
                  ) : (
                    <>
                      <MaterialIcons name="grass" size={16} color="#1A1A1A" />
                      <Text style={s.botaoSalvarTexto}>COLHER</Text>
                    </>
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
    cardData: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: tema.fundoIcone,
      borderRadius: 10,
      width: 52,
      height: 52,
      marginRight: 14,
    },
    cardDia: {
      fontSize: 20,
      fontWeight: "900",
      color: tema.acento,
      lineHeight: 22,
    },
    cardMes: { fontSize: 12, color: tema.acento },
    cardInfo: { flex: 1, gap: 4 },
    cardNome: {
      fontSize: 15,
      fontWeight: "700",
      color: tema.texto,
      marginBottom: 2,
    },
    cardLinha: { flexDirection: "row", alignItems: "center" },
    cardDetalhe: { fontSize: 12, color: tema.textoSecundario },
    cardAcoes: { alignItems: "center", gap: 6 },
    botaoColher: {
      backgroundColor: "#4CAF7D",
      borderRadius: 8,
      padding: 6,
      alignItems: "center",
      justifyContent: "center",
    },
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
    modalSubtitulo: {
      fontSize: 11,
      color: "#4CAF7D",
      letterSpacing: 1,
      marginTop: 3,
      fontWeight: "600",
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
    statusContainer: { flexDirection: "row", gap: 8, marginTop: 4 },
    statusBotao: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 11,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: tema.bordaStatus,
      backgroundColor: tema.fundoStatus,
    },
    statusTexto: {
      fontSize: 10,
      fontWeight: "700",
      color: tema.textoBotaoIcone,
      letterSpacing: 1,
    },
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
    botaoColherModal: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "#4CAF7D",
      paddingVertical: 14,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    botaoSalvarTexto: {
      color: "#1A1A1A",
      fontWeight: "800",
      fontSize: 12,
      letterSpacing: 2,
    },
  });
