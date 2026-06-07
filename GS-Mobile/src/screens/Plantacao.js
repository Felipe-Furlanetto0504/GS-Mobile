import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {Text, View, TextInput, TouchableOpacity, FlatList, Alert, Modal, ScrollView, StyleSheet, StatusBar} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATUS_OPCOES = ["PLANTADO", "PREPARACAO", "DESCANSO"];

const STATUS_CONFIG = {
  PLANTADO:   { cor: "#4CAF7D", icone: "activity" },
  PREPARACAO: { cor: "#C8A96E", icone: "tool" },
  DESCANSO:   { cor: "#7B8FA1", icone: "moon" },
};

export default function Plantacao() {
  const insets = useSafeAreaInsets();
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
      cultura, area, dataPlantio, talhao, status,
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
    const novasColheitas = [...colheitas, novaColheita];
    await AsyncStorage.setItem("COLHEITAS", JSON.stringify(novasColheitas));

    SetModalColheitaVisivel(false);
    SetPlantacaoSelecionada(null);
    Alert.alert("Sucesso", `Colheita de ${novaColheita.cultura} registrada com ${qtdColhida} toneladas!`);
  }

  function renderPlantacao({ item }) {
    const partes = item.dataPlantio.split("/");
    const dia = partes[0] || "--";
    const mes = partes[1] || "--";
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.PLANTADO;

    return (
      <View style={styles.card}>
        <View style={styles.cardData}>
          <Text style={styles.cardDia}>{dia}</Text>
          <Text style={styles.cardMes}>/{mes}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>{item.cultura}</Text>

          <View style={styles.cardLinha}>
            <Feather name="map-pin" size={12} color="#C8A96E" />
            <Text style={styles.cardDetalhe}> {item.talhao}</Text>
          </View>

          <View style={styles.cardLinha}>
            <Feather name="maximize" size={12} color="#666" />
            <Text style={styles.cardDetalhe}> {item.area} ha</Text>
          </View>

          <View style={styles.cardLinha}>
            <Feather name={config.icone} size={12} color={config.cor} />
            <Text style={[styles.cardDetalhe, { color: config.cor }]}> {item.status}</Text>
          </View>
        </View>

        <View style={styles.cardAcoes}>
          <TouchableOpacity
            onPress={() => abrirModalColheita(item)}
            style={styles.botaoColher}
            activeOpacity={0.8}
          >
            <MaterialIcons name="grass" size={16} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => excluirPlantacao(item.id)}
            style={styles.cardExcluir}
          >
            <MaterialIcons name="delete-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      <View style={styles.header}>
        <View style={styles.dividerTop} />
        <Text style={styles.titulo}>PLANTAÇÃO</Text>
      </View>

      {plantacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Feather name="sun" size={56} color="#333" />
          <Text style={styles.vazioTexto}>Nenhuma plantação cadastrada</Text>
          <Text style={styles.vazioSubTexto}>Toque no botão para adicionar</Text>
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
        style={[styles.botaoAdicionar, { marginBottom: 64 + insets.bottom + 16 }]}
        onPress={() => SetModalVisivel(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color="#1A1A1A" />
        <Text style={styles.botaoAdicionarTexto}>NOVA PLANTAÇÃO</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="fade" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>NOVA PLANTAÇÃO</Text>
              <TouchableOpacity onPress={() => SetModalVisivel(false)}>
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>PLANTIO</Text>
              <TextInput
                value={cultura}
                onChangeText={SetCultura}
                style={styles.input}
                placeholder="Ex: Soja, Milho, Cana..."
                placeholderTextColor="#444"
              />

              <Text style={styles.label}>ÁREA (hectares)</Text>
              <TextInput
                value={area}
                onChangeText={SetArea}
                style={styles.input}
                placeholder="Ex: 12.5"
                placeholderTextColor="#444"
                keyboardType="numeric"
              />

              <Text style={styles.label}>DATA DE PLANTIO</Text>
              <MaskedTextInput
                mask="99/99/9999"
                value={dataPlantio}
                onChangeText={(text) => SetDataPlantio(text)}
                style={styles.input}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#444"
              />

              <Text style={styles.label}>LOCAL</Text>
              <View style={styles.localContainer}>
                <Feather name="map-pin" size={18} color="#555" style={styles.localIcone} />
                <TextInput
                  value={talhao}
                  onChangeText={SetTalhao}
                  style={styles.localInput}
                  placeholder="Ex: Talhão A, Área Norte..."
                  placeholderTextColor="#444"
                />
              </View>

              <Text style={styles.label}>STATUS</Text>
              <View style={styles.statusContainer}>
                {STATUS_OPCOES.map((opcao) => {
                  const selecionado = status === opcao;
                  const config = STATUS_CONFIG[opcao];
                  return (
                    <TouchableOpacity
                      key={opcao}
                      style={[
                        styles.statusBotao,
                        selecionado && { borderColor: config.cor, backgroundColor: config.cor + "18" },
                      ]}
                      onPress={() => SetStatus(opcao)}
                      activeOpacity={0.75}
                    >
                      <Feather
                        name={config.icone}
                        size={13}
                        color={selecionado ? config.cor : "#555"}
                      />
                      <Text style={[styles.statusTexto, selecionado && { color: config.cor }]}>
                        {opcao}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalBotoes}>
                <TouchableOpacity style={styles.botaoCancelar} onPress={() => SetModalVisivel(false)}>
                  <Text style={styles.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoSalvar} onPress={salvarPlantacao}>
                  <Text style={styles.botaoSalvarTexto}>SALVAR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={modalColheitaVisivel} animationType="fade" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitulo}>REGISTRAR COLHEITA</Text>
                {plantacaoSelecionada && (
                  <Text style={styles.modalSubtitulo}>
                    {plantacaoSelecionada.cultura} · {plantacaoSelecionada.talhao}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => SetModalColheitaVisivel(false)}>
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>DATA DA COLHEITA</Text>
              <MaskedTextInput
                mask="99/99/9999"
                value={dataColheita}
                onChangeText={(text) => SetDataColheita(text)}
                style={styles.input}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#444"
              />

              <Text style={styles.label}>QUANTIDADE COLHIDA (toneladas)</Text>
              <View style={styles.localContainer}>
                <MaterialIcons name="grass" size={18} color="#555" style={styles.localIcone} />
                <TextInput
                  value={qtdColhida}
                  onChangeText={SetQtdColhida}
                  style={styles.localInput}
                  placeholder="Ex: 45.80"
                  placeholderTextColor="#444"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalBotoes}>
                <TouchableOpacity style={styles.botaoCancelar} onPress={() => SetModalColheitaVisivel(false)}>
                  <Text style={styles.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoColherModal} onPress={salvarColheita}>
                  <MaterialIcons name="grass" size={16} color="#1A1A1A" />
                  <Text style={styles.botaoSalvarTexto}>COLHER</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 28,
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
  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  vazioTexto: {
    color: "#444",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
    letterSpacing: 0.5,
  },
  vazioSubTexto: {
    color: "#333",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#C8A96E",
  },
  cardData: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C8A96E20",
    borderRadius: 10,
    width: 52,
    height: 52,
    marginRight: 14,
  },
  cardDia: {
    fontSize: 20,
    fontWeight: "900",
    color: "#C8A96E",
    lineHeight: 22,
  },
  cardMes: {
    fontSize: 12,
    color: "#C8A96E",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F0EDE6",
    marginBottom: 2,
  },
  cardLinha: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDetalhe: {
    fontSize: 12,
    color: "#666",
  },
  cardAcoes: {
    alignItems: "center",
    gap: 6,
  },
  botaoColher: {
    backgroundColor: "#4CAF7D",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cardExcluir: {
    padding: 4,
  },
  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C8A96E",
    paddingVertical: 16,
    borderRadius: 4,
    gap: 8,
    marginBottom: 16,
  },
  botaoAdicionarTexto: {
    color: "#1A1A1A",
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 2,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "#2A2A2A",
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
    color: "#F0EDE6",
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
    color: "#C8A96E",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#242424",
    borderBottomWidth: 1.5,
    borderBottomColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 14,
    color: "#F0EDE6",
  },
  localContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderBottomWidth: 1.5,
    borderBottomColor: "#333",
  },
  localIcone: {
    paddingRight: 8,
  },
  localInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#F0EDE6",
  },
  unidade: {
    fontSize: 12,
    color: "#555",
    fontWeight: "700",
    letterSpacing: 1,
    paddingLeft: 6,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statusBotao: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#333",
    backgroundColor: "#242424",
  },
  statusTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: "#555",
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
    borderColor: "#333",
  },
  botaoCancelarTexto: {
    color: "#666",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 2,
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: "#C8A96E",
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