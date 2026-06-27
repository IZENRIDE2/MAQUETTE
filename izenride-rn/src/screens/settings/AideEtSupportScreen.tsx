import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Heart, CreditCard, ChevronDown, MessageCircle } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

const FAQ = [
  {
    q: 'Comment vérifier mon profil ?',
    a: 'Va dans Profil → Vérification photo, puis suis les instructions du selfie. La validation prend généralement quelques minutes.',
  },
  {
    q: 'Comment fonctionne le paiement marketplace ?',
    a: "Les paiements passent par Stripe Connect : l'argent est sécurisé jusqu'à confirmation de réception par l'acheteur.",
  },
  {
    q: 'Puis-je annuler mon abonnement Premium ?',
    a: "Oui, à tout moment depuis Paramètres → Abonnement. Tu gardes l'accès jusqu'à la fin de la période payée.",
  },
  {
    q: 'Comment signaler un utilisateur ?',
    a: 'Ouvre le profil concerné, touche les trois points en haut à droite puis « Signaler ». Notre équipe traite chaque signalement.',
  },
];

/** Aide & support — FAQ + contact (localisé Paris). */
export default function AideEtSupportScreen() {
  const [open, setOpen] = useState(0);

  return (
    <Screen pad={0}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar title="Aide & support" />
        <Text style={styles.headerSub}>On est là pour t'aider</Text>
      </View>

      {/* Recherche */}
      <View style={styles.search}>
        <Search size={18} color={colors.inkMute} />
        <TextInput
          placeholder="Rechercher dans l'aide..."
          placeholderTextColor={colors.inkMute}
          style={styles.searchInput}
        />
      </View>

      {/* Accès rapides */}
      <View style={styles.qaRow}>
        <View style={styles.qaCard}>
          <View style={[styles.qaIcon, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
            <Heart size={17} color={colors.neon} />
          </View>
          <Text style={styles.qaTitle}>Matchs & profil</Text>
          <Text style={styles.qaSub}>Likes, filtres, vérif</Text>
        </View>
        <View style={styles.qaCard}>
          <View style={[styles.qaIcon, { backgroundColor: 'rgba(250,199,117,0.12)' }]}>
            <CreditCard size={17} color={colors.warn} />
          </View>
          <Text style={styles.qaTitle}>Paiements</Text>
          <Text style={styles.qaSub}>Premium, marketplace</Text>
        </View>
      </View>

      {/* FAQ */}
      <Text style={styles.secLabel}>Questions fréquentes</Text>
      <View style={styles.faq}>
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <Pressable
              key={item.q}
              onPress={() => setOpen(isOpen ? -1 : i)}
              style={[styles.fq, i > 0 && styles.fqBorder]}
            >
              <View style={styles.fqQ}>
                <Text style={styles.fqQTxt}>{item.q}</Text>
                <ChevronDown
                  size={16}
                  color={isOpen ? colors.neon : colors.inkMute}
                  style={isOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
                />
              </View>
              {isOpen ? <Text style={styles.fqA}>{item.a}</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {/* Contact */}
      <View style={styles.contact}>
        <Text style={styles.contactTitle}>Besoin de plus d'aide ?</Text>
        <Text style={styles.contactDesc}>Notre équipe répond sous 24h en moyenne.</Text>
        <Pressable>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} style={styles.contactBtn}>
            <MessageCircle size={17} color="#fff" />
            <Text style={styles.contactBtnTxt}>Contacter le support</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: -4, marginBottom: 8, marginLeft: 52 },

  search: {
    marginHorizontal: 16,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, paddingVertical: 13 },

  qaRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  qaCard: {
    flex: 1,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 14,
    gap: 8,
  },
  qaIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  qaTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  qaSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },

  secLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 9,
  },
  faq: {
    marginHorizontal: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fq: { padding: 15 },
  fqBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  fqQ: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  fqQTxt: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  fqA: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.inkDim, marginTop: 9 },

  contact: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: radius.md,
    padding: 16,
    backgroundColor: 'rgba(77,143,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.3)',
  },
  contactTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 3 },
  contactDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginBottom: 12 },
  contactBtn: {
    height: 46,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
