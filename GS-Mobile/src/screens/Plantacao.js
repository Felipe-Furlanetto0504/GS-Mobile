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
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTema } from "../theme";

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

  const [plantacoes, SetPlantacoes] = useState([]);
  const [modalVisivel, SetModalVisivel] = useState(false);
  const [cultura, SetCultura] = useState("");
  const [area, SetArea] = useState("");
  const [dataPlantio, SetDataPlantio] = useState("");
  const [talhao, SetTalhao] = useState("");
  const [status, SetStatus] = useState("");

  const [modalColheitaVisivel, SetModalColheitaVisivel] = useState(false);
  const [plantacaoSelecionada, SetPlantacaoSelecionada] = useState(null);
  const [dataColheita, SetDataColheita] = useState("");
  const [qtdColhida, SetQtdColhida] = useState("");

  useEffect(() => {
    carregarPlantacoes();
  }, []);

  async function carregarPlantacoes() {
    const dados = await AsyncStorage.getItem("PLANTACOES");
    if (dados) SetPlantacoes(JSON.parse(dados));
  }

  async function salvarPlantacao() {
    if (!cultura || !area || !dataPlantio || !talhao || !status) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const nova = {
      id: Date.now().toString(),
      cultura,
      area,
      dataPlantio,
      talhao,
      status,
    };
    const novaLista = [...plantacoes, nova];
    SetPlantacoes(novaLista);
    await AsyncStorage.setItem("PLANTACOES", JSON.stringify(novaLista));
    SetCultura("");
    SetArea("");
    SetDataPlantio("");
    SetTalhao("");
    SetStatus("");
    SetModalVisivel(false);
  }

  async function excluirPlantacao(id) {
    Alert.alert("Excluir", "Deseja excluir esta plantação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const novaLista = plantacoes.filter((p) => p.id !== id);
          SetPlantacoes(novaLista);
          await AsyncStorage.setItem("PLANTACOES", JSON.stringify(novaLista));
        },
      },
    ]);
  }

  function abrirModalColheita(item) {
    SetPlantacaoSelecionada(item);
    SetDataColheita("");
    SetQtdColhida("");
    SetModalColheitaVisivel(true);
  }

  async function salvarColheita() {
    if (!dataColheita || !qtdColhida) {
      Alert.alert("Erro", "Preencha todos os campos da colheita");
      return;
    }
    const novaColheita = {
      id: Date.now().toString(),
      plantacaoId: plantacaoSelecionada.id,
      cultura: plantacaoSelecionada.cultura,
      talhao: plantacaoSelecionada.talhao,
      dataColheita,
      qtdColhida,
    };
    const dadosColheitas = await AsyncStorage.getItem("COLHEITAS");
    const colheitas = dadosColheitas ? JSON.parse(dadosColheitas) : [];
    await AsyncStorage.setItem(
      "COLHEITAS",
      JSON.stringify([...colheitas, novaColheita]),
    );
    SetModalColheitaVisivel(false);
    SetPlantacaoSelecionada(null);
    Alert.alert(
      "Sucesso",
      `Colheita de ${novaColheita.cultura} registrada com ${qtdColhida} toneladas!`,
    );
  }

  function renderPlantacao({ item }) {
    const partes = item.dataPlantio.split("/");
    const dia = partes[0] || "--";
    const mes = partes[1] || "--";
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.PLANTADO;

    return (
      <View style={s.card}>
        <View style={s.cardData}>
          <Text style={s.cardDia}>{dia}</Text>
          <Text style={s.cardMes}>/{mes}</Text>
        </View>
        <View style={s.cardInfo}>
          <Text style={s.cardNome}>{item.cultura}</Text>
          <View style={s.cardLinha}>
            <Feather name="map-pin" size={12} color="#C8A96E" />
            <Text style={s.cardDetalhe}> {item.talhao}</Text>
          </View>
          <View style={s.cardLinha}>
            <Feather name="maximize" size={12} color={tema.textoSecundario} />
            <Text style={s.cardDetalhe}> {item.area} ha</Text>
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

      {plantacoes.length === 0 ? (
        <View style={s.vazio}>
          <Feather name="sun" size={56} color={tema.vazioIcone} />
          <Text style={s.vazioTexto}>Nenhuma plantação cadastrada</Text>
          <Text style={s.vazioSubTexto}>Toque no botão para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={plantacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderPlantacao}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[s.botaoAdicionar, { marginBottom: 64 + insets.bottom + 16 }]}
        onPress={() => SetModalVisivel(true)}
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
              <TouchableOpacity onPress={() => SetModalVisivel(false)}>
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
                onChangeText={SetCultura}
                style={s.input}
                placeholder="Ex: Soja, Milho, Cana..."
                placeholderTextColor={tema.textoPlaceholder}
              />
              <Text style={s.label}>ÁREA (hectares)</Text>
              <TextInput
                value={area}
                onChangeText={SetArea}
                style={s.input}
                placeholder="Ex: 12.5"
                placeholderTextColor={tema.textoPlaceholder}
                keyboardType="numeric"
              />
              <Text style={s.label}>DATA DE PLANTIO</Text>
              <MaskedTextInput
                mask="99/99/9999"
                value={dataPlantio}
                onChangeText={(text) => SetDataPlantio(text)}
                style={s.input}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                placeholderTextColor={tema.textoPlaceholder}
              />
              <Text style={s.label}>LOCAL</Text>
              <View style={s.localContainer}>
                <Feather
                  name="map-pin"
                  size={18}
                  color={tema.textoBotaoIcone}
                  style={s.localIcone}
                />
                <TextInput
                  value={talhao}
                  onChangeText={SetTalhao}
                  style={s.localInput}
                  placeholder="Ex: Talhão A, Área Norte..."
                  placeholderTextColor={tema.textoPlaceholder}
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
                      style={[
                        s.statusBotao,
                        selecionado && {
                          borderColor: config.cor,
                          backgroundColor: config.cor + "18",
                        },
                      ]}
                      onPress={() => SetStatus(opcao)}
                      activeOpacity={0.75}
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
                  onPress={() => SetModalVisivel(false)}
                >
                  <Text style={s.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.botaoSalvar}
                  onPress={salvarPlantacao}
                >
                  <Text style={s.botaoSalvarTexto}>SALVAR</Text>
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
                    {plantacaoSelecionada.cultura} ·{" "}
                    {plantacaoSelecionada.talhao}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => SetModalColheitaVisivel(false)}>
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
                onChangeText={(text) => SetDataColheita(text)}
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
                  onChangeText={SetQtdColhida}
                  style={s.localInput}
                  placeholder="Ex: 45.80"
                  placeholderTextColor={tema.textoPlaceholder}
                  keyboardType="numeric"
                />
              </View>
              <View style={s.modalBotoes}>
                <TouchableOpacity
                  style={s.botaoCancelar}
                  onPress={() => SetModalColheitaVisivel(false)}
                >
                  <Text style={s.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.botaoColherModal}
                  onPress={salvarColheita}
                >
                  <MaterialIcons name="grass" size={16} color="#1A1A1A" />
                  <Text style={s.botaoSalvarTexto}>COLHER</Text>
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
