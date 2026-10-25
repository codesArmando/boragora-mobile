import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LinhaPessoa } from '@/components/LinhaPessoa';
import { TelaDados } from '@/components/TelaDados';
import { listarMotoristasAdmin } from '@/repositories/gestaoConsultaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export default function Motoristas() {
  const carregar = useCallback(() => listarMotoristasAdmin(), []);
  return (
    <TelaDados
      carregar={carregar}
      titulo="Motoristas"
      vazio={(motoristas) => motoristas.length === 0}
      mensagemVazia="Nenhum motorista cadastrado."
      renderizar={(motoristas) => (
        <View>
          <Link href="/motorista/gestao/motoristas/novo" asChild>
            <Pressable style={estilos.botao}>
              <Text style={estilos.textoBotao}>+ Novo motorista</Text>
            </Pressable>
          </Link>
          {motoristas.map((motorista) => (
            <LinhaPessoa
              key={motorista.id}
              nome={motorista.nome}
              email={motorista.email}
              mostrarIniciais={false}
            />
          ))}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: medidas.alturaBotao,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: { color: cores.textoSobreDestaque, fontSize: 16, fontWeight: '700' },
});
