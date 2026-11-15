import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { LOGO_ALTURA, LOGO_LARGURA, logoBoragoraXml } from '@/components/marca/logoBoragoraXml';

// Logo "Boragora Viagens" (A1). A altura acompanha a largura, na proporção do arquivo original.
export function Logo({ largura = 300 }: { largura?: number }) {
  const altura = Math.round((largura * LOGO_ALTURA) / LOGO_LARGURA);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Boragora Viagens">
      <SvgXml xml={logoBoragoraXml} width={largura} height={altura} />
    </View>
  );
}
