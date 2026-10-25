import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { cores } from '@/theme/cores';

export function ListaAtualizavel({
  children,
  atualizando,
  aoAtualizar,
}: {
  children: ReactNode;
  atualizando: boolean;
  aoAtualizar: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={estilos.conteudo}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={aoAtualizar}
          tintColor={cores.destaque}
          colors={[cores.destaque]}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({ conteudo: { flexGrow: 1 } });
