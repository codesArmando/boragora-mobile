import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BlocoHorarios } from '@/components/BlocoHorarios';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoErro } from '@/components/EstadoErro';
import { Tela } from '@/components/Tela';
import { useSessao } from '@/contexts/SessaoContext';
import { listarMinhasTurmas } from '@/repositories/planoRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';
import type { TurmaDoAluno } from '@/types/plano';
import { dataPorExtenso, primeiroNome } from '@/utils/data';

// Tela inicial do aluno (ALU-01) e A3, quando ele ainda não está em nenhuma turma.
export default function InicioAluno() {
  const { usuario } = useSessao();
  const [turmas, setTurmas] = useState<TurmaDoAluno[] | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setTurmas(await listarMinhasTurmas());
    } catch (falha) {
      setErro(falha);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const semTurma = turmas?.length === 0;

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.data}>{dataPorExtenso()}</Text>
          <Text style={estilos.titulo}>Olá, {primeiroNome(usuario?.nome)}</Text>
          {!semTurma && (
            <Text style={estilos.subtitulo}>Marque a presença de hoje em cada turma.</Text>
          )}
        </View>
        {carregando && turmas === null ? (
          <Carregando />
        ) : erro !== null && turmas === null ? (
          <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
        ) : semTurma ? (
          <SemTurma email={usuario?.email ?? ''} />
        ) : (
          <View style={estilos.lista}>
            {turmas?.map((turma) => (
              <CartaoTurma key={turma.id} turma={turma} />
            ))}
          </View>
        )}
        {erro !== null && turmas !== null && (
          <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
        )}
      </ScrollView>
    </Tela>
  );
}

function resumoDeHoje(turma: TurmaDoAluno): string {
  if (turma.incluiIda && turma.incluiVolta) return 'Hoje: ida e volta marcadas';
  if (turma.incluiIda) return 'Hoje: só a ida marcada';
  if (turma.incluiVolta) return 'Hoje: só a volta marcada';
  return 'Hoje: nada marcado ainda';
}

function CartaoTurma({ turma }: { turma: TurmaDoAluno }) {
  const marcou = turma.incluiIda || turma.incluiVolta;
  return (
    <Cartao>
      <Text style={estilos.nomeTurma}>
        {turma.grupo.nome} · {turma.nome}
      </Text>
      <Text style={estilos.motorista}>Motorista {turma.motorista.nome}</Text>
      <BlocoHorarios
        horarioSaidaIda={turma.grupo.horarioSaidaIda}
        horarioSaidaVolta={turma.grupo.horarioSaidaVolta}
      />
      <Text style={[estilos.resumo, marcou && estilos.resumoMarcado]}>{resumoDeHoje(turma)}</Text>
      <Link href={`/aluno/hoje/${turma.id}`} asChild>
        {/* expo-router 58 recusa lista de estilos no filho de um Link asChild. */}
        <Pressable
          style={StyleSheet.flatten([estilos.botao, marcou && estilos.botaoContorno])}
          accessibilityRole="button"
        >
          <Text style={[estilos.botaoTexto, marcou && estilos.botaoTextoContorno]}>
            {marcou ? 'Alterar presença' : 'Marcar presença'}
          </Text>
        </Pressable>
      </Link>
    </Cartao>
  );
}

// A3: conta criada, ainda sem vínculo com turma.
function SemTurma({ email }: { email: string }) {
  return (
    <View style={estilos.semTurma}>
      <Image
        source={require('../../../assets/simbolo-boragora.png')}
        style={estilos.simbolo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text style={estilos.tituloVazio}>Você ainda não está em uma van</Text>
      <Text style={estilos.textoVazio}>
        Avise o motorista que sua conta foi criada. Assim que ele vincular você à turma, o plano do
        dia aparece aqui.
      </Text>
      <View style={estilos.suaConta}>
        <Text style={estilos.suaContaRotulo}>Sua conta</Text>
        <Text style={estilos.suaContaEmail}>{email}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, paddingBottom: 28, gap: 18 },
  cabecalho: { gap: 6 },
  data: { color: cores.textoApagado, fontFamily: tipografia.texto.medio, fontSize: 14 },
  titulo: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 32 },
  subtitulo: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16 },
  lista: { gap: 14 },
  nomeTurma: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 26 },
  motorista: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16 },
  resumo: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 15 },
  resumoMarcado: { color: cores.destaque, fontFamily: tipografia.texto.semibold },
  botao: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  botaoContorno: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: cores.bordaBotaoSecundario,
  },
  botaoTexto: {
    color: cores.textoSobreDestaque,
    fontFamily: tipografia.texto.negrito,
    fontSize: 16,
  },
  botaoTextoContorno: { color: cores.texto },
  semTurma: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  simbolo: { width: 190, height: 186, marginBottom: 8 },
  tituloVazio: {
    color: cores.texto,
    fontFamily: tipografia.texto.negrito,
    fontSize: 22,
    textAlign: 'center',
  },
  textoVazio: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  suaConta: {
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: medidas.raioCartao,
  },
  suaContaRotulo: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14 },
  suaContaEmail: { color: cores.texto, fontFamily: tipografia.texto.semibold, fontSize: 16 },
});
