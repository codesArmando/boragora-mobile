import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { FolhaInferior } from '@/components/FolhaInferior';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export type OpcaoSeletor = {
  id: number | string;
  rotulo: string;
  /** Linha menor abaixo do rótulo (por exemplo, o e-mail do motorista). */
  descricao?: string;
};

type Props = {
  rotulo: string;
  opcoes: OpcaoSeletor[];
  /** `id` da opção escolhida; `null` quando nada foi escolhido. */
  valor: OpcaoSeletor['id'] | null;
  onSelecionar: (opcao: OpcaoSeletor) => void;
  placeholder?: string;
  /** Texto da lista quando `opcoes` está vazia. */
  textoVazio?: string;
  erro?: string | null;
  dica?: string;
  desabilitado?: boolean;
};

// Seletor em modal (decisão 11 do plano): um toque escolhe e fecha. Usado para grupo e motorista
// na D4 e para "Trocar" motorista na D5.
export function SeletorModal({
  rotulo,
  opcoes,
  valor,
  onSelecionar,
  placeholder = 'Selecione',
  textoVazio = 'Nenhuma opção disponível',
  erro,
  dica,
  desabilitado = false,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const escolhida = opcoes.find((opcao) => opcao.id === valor);
  const comErro = erro != null && erro !== '';

  function escolher(opcao: OpcaoSeletor) {
    setAberto(false);
    onSelecionar(opcao);
  }

  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={rotulo}
        accessibilityValue={{ text: escolhida?.rotulo ?? placeholder }}
        accessibilityState={{ disabled: desabilitado, expanded: aberto }}
        disabled={desabilitado}
        onPress={() => setAberto(true)}
        style={[
          estilos.campo,
          comErro && estilos.campoComErro,
          desabilitado && estilos.desabilitado,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[estilos.valor, escolhida === undefined && estilos.placeholder]}
        >
          {escolhida?.rotulo ?? placeholder}
        </Text>
        <Feather name="chevron-down" size={22} color={cores.textoSecundario} />
      </Pressable>
      {comErro ? (
        <Text accessibilityRole="alert" style={estilos.erro}>
          {erro}
        </Text>
      ) : dica ? (
        <Text style={estilos.dica}>{dica}</Text>
      ) : null}

      <ModalSeletor
        visivel={aberto}
        titulo={rotulo}
        opcoes={opcoes}
        valor={valor}
        textoVazio={textoVazio}
        onSelecionar={escolher}
        onFechar={() => setAberto(false)}
      />
    </View>
  );
}

type PropsModal = {
  visivel: boolean;
  titulo: string;
  opcoes: OpcaoSeletor[];
  valor: OpcaoSeletor['id'] | null;
  textoVazio?: string;
  onSelecionar: (opcao: OpcaoSeletor) => void;
  onFechar: () => void;
};

// Lista em folha, um toque escolhe. Usado direto quando o gatilho não é um campo, como o
// "Trocar" motorista da D5.
export function ModalSeletor({
  visivel,
  titulo,
  opcoes,
  valor,
  textoVazio = 'Nenhuma opção disponível',
  onSelecionar,
  onFechar,
}: PropsModal) {
  return (
    <FolhaInferior visivel={visivel} onFechar={onFechar}>
      <Text accessibilityRole="header" style={estilos.titulo}>
        {titulo}
      </Text>
      {opcoes.length === 0 ? (
        <Text style={estilos.vazio}>{textoVazio}</Text>
      ) : (
        <FlatList
          data={opcoes}
          keyExtractor={(opcao) => String(opcao.id)}
          style={estilos.lista}
          renderItem={({ item }) => {
            const selecionada = item.id === valor;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: selecionada }}
                onPress={() => onSelecionar(item)}
                style={estilos.linha}
              >
                <View style={estilos.textosLinha}>
                  <Text style={[estilos.rotuloLinha, selecionada && estilos.rotuloSelecionado]}>
                    {item.rotulo}
                  </Text>
                  {item.descricao !== undefined && (
                    <Text style={estilos.descricao}>{item.descricao}</Text>
                  )}
                </View>
                {selecionada && <Feather name="check" size={22} color={cores.destaque} />}
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={estilos.separador} />}
        />
      )}
    </FolhaInferior>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    gap: 8,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },
  campo: {
    height: medidas.alturaCampo,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: medidas.raioCampo,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  campoComErro: {
    borderColor: cores.perigo,
  },
  desabilitado: {
    opacity: 0.4,
  },
  valor: {
    flex: 1,
    color: cores.texto,
    fontSize: 16,
  },
  placeholder: {
    color: cores.textoApagado,
  },
  erro: {
    color: cores.perigo,
    fontSize: 14,
  },
  dica: {
    color: cores.textoApagado,
    fontSize: 14,
  },
  titulo: {
    marginTop: 6,
    color: cores.texto,
    fontSize: 22,
    fontWeight: '700',
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 16,
  },
  lista: {
    maxHeight: 360,
  },
  linha: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  textosLinha: {
    flex: 1,
  },
  rotuloLinha: {
    color: cores.texto,
    fontSize: 17,
    fontWeight: '500',
  },
  rotuloSelecionado: {
    color: cores.destaque,
    fontWeight: '700',
  },
  descricao: {
    color: cores.textoApagado,
    fontSize: 14,
  },
  separador: {
    height: 1,
    backgroundColor: cores.borda,
  },
});
