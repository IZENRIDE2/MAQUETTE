import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Shield, Eye, MapPin, MessageCircle, User, Search, Image as ImageIcon, Bike, Heart, Navigation,
  Clock, Home, Check, ChevronRight, Download, Trash2, AlertTriangle, MapPinned,
} from 'lucide-react-native';
import { Screen, AppBar, Switch, Divider } from '@/components';
import { colors, fonts, radius } from '@/theme';

type Toggle = { icon: React.ReactNode; title: string; desc: string; on: boolean; green?: boolean };

const PROFILE_TOGGLES: Toggle[] = [
  { icon: <Search size={16} color={colors.neon} />, title: 'Apparaître dans les recherches', desc: 'Les autres riders peuvent vous trouver par nom ou pseudo', on: true },
  { icon: <ImageIcon size={16} color={colors.neon} />, title: 'Afficher ma photo', desc: "Visible sur la carte et dans les listes d'événements", on: true },
  { icon: <Bike size={16} color={colors.neon} />, title: 'Afficher ma moto', desc: 'Modèle, année et photos visibles sur le profil', on: true },
];

const CROSSING_TOGGLES: Toggle[] = [
  { icon: <MapPinned size={16} color={colors.neon} />, title: 'Visible sur la carte live', desc: 'Les autres riders voient votre position en temps réel', on: true, green: true },
  { icon: <Heart size={16} color={colors.neon} />, title: 'Suggestions de match', desc: 'Apparaître dans les suggestions de riders compatibles', on: true },
  { icon: <Eye size={16} color={colors.inkMute} />, title: 'Mode incognito', desc: 'Naviguez sans apparaître aux autres pendant 1h', on: false },
];

const MESSAGE_TOGGLES: Toggle[] = [
  { icon: <Check size={16} color={colors.neon} />, title: 'Confirmations de lecture', desc: 'Indiquer quand vous avez lu les messages', on: true },
  { icon: <MessageCircle size={16} color={colors.neon} />, title: 'Indicateur de saisie', desc: "Montrer aux autres que vous êtes en train d'écrire", on: true },
];

const GEO_TOGGLES: Toggle[] = [
  { icon: <Clock size={16} color={colors.neon} />, title: 'Position en arrière-plan', desc: 'Continuer à partager même app fermée (sécurité)', on: true, green: true },
  { icon: <Navigation size={16} color={colors.inkMute} />, title: 'Historique des trajets', desc: 'Sauvegarder vos itinéraires (visible vous seul)', on: false },
  { icon: <Home size={16} color={colors.neon} />, title: 'Masquer mon domicile', desc: 'Zone de 200 m autour de chez vous toujours floutée', on: true, green: true },
];

function SectionHeader({ icon, title, bg }: { icon: React.ReactNode; title: string; bg: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function ToggleList({ data }: { data: Toggle[] }) {
  return (
    <View style={styles.card}>
      {data.map((t, i) => (
        <View key={t.title}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleIcon}>{t.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>{t.title}</Text>
              <Text style={styles.toggleDesc}>{t.desc}</Text>
            </View>
            <Switch value={t.on} />
          </View>
          {i < data.length - 1 && <Divider style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

function Segment({ options, active }: { options: string[]; active: number }) {
  const [sel, setSel] = useState(active);
  return (
    <View style={styles.segmentControl}>
      {options.map((o, i) => (
        <Pressable key={o} onPress={() => setSel(i)} style={[styles.segmentOption, i === sel && styles.segmentOptionOn]}>
          <Text style={[styles.segmentTxt, i === sel && { color: colors.neon }]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function ConfidentialiteDetailleScreen() {
  return (
    <Screen pad={16}>
      <AppBar title="Confidentialité" right={<Shield size={18} color={colors.neon} />} />
      <Text style={styles.headerSub}>Contrôlez votre visibilité</Text>

      {/* Privacy score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>75%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scoreLabel}>Niveau de protection</Text>
            <Text style={styles.scoreTitle}>Protection forte</Text>
            <Text style={styles.scoreStatus}>● Bon équilibre vie privée / visibilité</Text>
          </View>
        </View>
        <View style={styles.scoreBarTrack}>
          <View style={styles.scoreBarFill} />
        </View>
      </View>

      {/* Visibilité du profil */}
      <View style={styles.section}>
        <SectionHeader icon={<Eye size={14} color={colors.neon} />} title="Visibilité du profil" bg="rgba(77,143,255,0.12)" />
        <View style={styles.card}>
          <View style={styles.segmentRow}>
            <View style={styles.segHeader}>
              <View style={styles.toggleIcon}><User size={16} color={colors.neon} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Mode du profil</Text>
                <Text style={styles.toggleDesc}>Choisissez qui peut voir votre profil complet</Text>
              </View>
            </View>
            <Segment options={['Public', 'Riders', 'Privé']} active={1} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardInner}>
            <ToggleListInline data={PROFILE_TOGGLES} />
          </View>
        </View>
      </View>

      {/* Qui peut me croiser */}
      <View style={styles.section}>
        <SectionHeader icon={<MapPin size={14} color={colors.purple} />} title="Qui peut me croiser" bg="rgba(184,132,230,0.12)" />
        <View style={styles.card}>
          <View style={styles.segmentRow}>
            <View style={styles.segHeader}>
              <View style={styles.toggleIcon}><Navigation size={16} color={colors.neon} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Détection de croisement</Text>
                <Text style={styles.toggleDesc}>Notification quand vous croisez un autre rider</Text>
              </View>
            </View>
            <Segment options={['Tout le monde', 'Riders proches', 'Personne']} active={1} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardInner}>
            <ToggleListInline data={CROSSING_TOGGLES} />
          </View>
        </View>
      </View>

      {/* Messagerie */}
      <View style={styles.section}>
        <SectionHeader icon={<MessageCircle size={14} color={colors.warn} />} title="Messagerie" bg="rgba(251,191,36,0.12)" />
        <View style={styles.card}>
          <View style={styles.segmentRow}>
            <View style={styles.segHeader}>
              <View style={styles.toggleIcon}><MessageCircle size={16} color={colors.neon} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Qui peut m'envoyer un message</Text>
                <Text style={styles.toggleDesc}>Filtre les nouvelles conversations entrantes</Text>
              </View>
            </View>
            <Segment options={['Tous', 'Matchs', 'Aucun']} active={1} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardInner}>
            <ToggleListInline data={MESSAGE_TOGGLES} />
          </View>
        </View>
      </View>

      {/* Géolocalisation */}
      <View style={styles.section}>
        <SectionHeader icon={<MapPin size={14} color={colors.successText} />} title="Géolocalisation" bg="rgba(93,202,165,0.12)" />
        <View style={styles.card}>
          <View style={styles.segmentRow}>
            <View style={styles.segHeader}>
              <View style={styles.toggleIcon}><MapPin size={16} color={colors.neon} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Précision de la position</Text>
                <Text style={styles.toggleDesc}>Niveau de détail partagé avec les autres riders</Text>
              </View>
            </View>
            <Segment options={['Précise', 'Floue', 'Ville']} active={0} />
            <View style={styles.geoPreview}>
              <View style={styles.geoBadge}>
                <Text style={styles.geoBadgeTxt}>~10 m</Text>
              </View>
              <View style={styles.geoRadius} />
              <View style={styles.geoPin} />
              <Text style={styles.geoLabel}>Aperçu de la zone partagée</Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardInner}>
            <ToggleListInline data={GEO_TOGGLES} />
          </View>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Shield size={16} color={colors.neon} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Vos données sont à vous</Text>
          <Text style={styles.infoTxt}>
            IzenRide ne vend ni ne partage votre position avec des tiers. Vos paramètres sont chiffrés et synchronisés.
          </Text>
        </View>
      </View>

      {/* Danger zone */}
      <View style={styles.section}>
        <SectionHeader icon={<AlertTriangle size={14} color={colors.danger} />} title="Zone sensible" bg="rgba(226,75,74,0.12)" />
        <View style={styles.dangerCard}>
          <Pressable style={styles.dangerRow}>
            <View style={styles.dangerIcon}><Download size={16} color={colors.danger} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerTitle}>Télécharger mes données</Text>
              <Text style={styles.dangerDesc}>Recevez une copie complète au format ZIP</Text>
            </View>
            <ChevronRight size={16} color={colors.inkMute} />
          </Pressable>
          <Divider style={styles.dividerRed} />
          <Pressable style={styles.dangerRow}>
            <View style={styles.dangerIcon}><Trash2 size={16} color={colors.danger} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerTitle}>Supprimer mon compte</Text>
              <Text style={styles.dangerDesc}>Action définitive — toutes les données effacées</Text>
            </View>
            <ChevronRight size={16} color={colors.inkMute} />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

/** Liste de toggles "inline" (sans card englobante, pour insertion dans une section-card). */
function ToggleListInline({ data }: { data: Toggle[] }) {
  return (
    <>
      {data.map((t, i) => (
        <View key={t.title}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleIcon}>{t.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>{t.title}</Text>
              <Text style={styles.toggleDesc}>{t.desc}</Text>
            </View>
            <Switch value={t.on} />
          </View>
          {i < data.length - 1 && <Divider style={styles.divider} />}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  headerSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute, marginTop: -4, marginBottom: 8 },

  scoreCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 20, padding: 20, marginBottom: 8 },
  scoreHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.bgDeep, borderWidth: 3, borderColor: colors.successText, alignItems: 'center', justifyContent: 'center' },
  scoreValue: { fontFamily: fonts.bold, fontSize: 16, color: colors.successText, letterSpacing: -0.5 },
  scoreLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  scoreTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  scoreStatus: { fontFamily: fonts.semibold, fontSize: 12, color: colors.successText, marginTop: 2 },
  scoreBarTrack: { height: 6, borderRadius: 3, backgroundColor: colors.bgDeep, overflow: 'hidden' },
  scoreBarFill: { height: '100%', width: '75%', borderRadius: 3, backgroundColor: colors.neon },

  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, paddingHorizontal: 4 },
  sectionIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, letterSpacing: -0.2 },

  card: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, overflow: 'hidden' },
  cardInner: {},
  divider: { marginVertical: 0, marginHorizontal: 16, height: 1, backgroundColor: 'rgba(26,30,40,0.6)' },
  dividerRed: { marginVertical: 0, marginHorizontal: 16, height: 1, backgroundColor: 'rgba(26,30,40,0.6)' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  toggleIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  toggleDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },

  segmentRow: { paddingVertical: 14, paddingHorizontal: 16 },
  segHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  segmentControl: { flexDirection: 'row', gap: 2, backgroundColor: colors.bgDeep, borderRadius: 10, padding: 3, borderWidth: 1, borderColor: 'rgba(26,30,40,0.8)' },
  segmentOption: { flex: 1, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  segmentOptionOn: { backgroundColor: 'rgba(77,143,255,0.15)' },
  segmentTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute },

  geoPreview: { marginTop: 14, height: 100, backgroundColor: colors.bgDeep, borderRadius: 12, borderWidth: 1, borderColor: '#1A1E28', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  geoBadge: { position: 'absolute', top: 8, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(77,143,255,0.12)' },
  geoBadgeTxt: { fontFamily: fonts.bold, fontSize: 10, color: colors.neon },
  geoRadius: { position: 'absolute', width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(77,143,255,0.2)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.5)' },
  geoPin: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.neon },
  geoLabel: { position: 'absolute', bottom: 8, left: 10, fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },

  infoCard: { flexDirection: 'row', gap: 12, marginTop: 20, padding: 14, backgroundColor: 'rgba(77,143,255,0.06)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.15)', borderRadius: 14 },
  infoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.neon, marginBottom: 3 },
  infoTxt: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.ink, lineHeight: 17, opacity: 0.85 },

  dangerCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: 'rgba(226,75,74,0.2)', borderRadius: radius.md, overflow: 'hidden' },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  dangerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(226,75,74,0.1)', alignItems: 'center', justifyContent: 'center' },
  dangerTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.danger, marginBottom: 2 },
  dangerDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },
});
