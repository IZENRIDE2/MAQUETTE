import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import Svg, { Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { ArrowUpRight, ArrowDownRight, Table2, BarChart3 } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { LoadState, SectionTitle } from '@/components/groups';
import { colors, fonts } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle } from '@/api/groups';
import { getGroupStats, subscribePro } from '@/api/pro';
import type { GroupStats } from '@/api/types';

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const weekLabel = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : '—');

/** Statistiques du groupe (insights.view) : membres, engagement, sorties, suggestions, invitations. */
export default function StatsScreen({ groupId }: { groupId: string }) {
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId]);
  const stats = useQuery(() => getGroupStats(groupId), [groupId], subscribePro);

  if (!bundle.data || !stats.data) {
    return (
      <Screen>
        <AppBar title="Statistiques" />
        <LoadState loading={!bundle.error && !stats.error} error={bundle.error ?? stats.error} onRetry={stats.reload} />
      </Screen>
    );
  }
  const s = stats.data;
  const pro = bundle.data.group.kind === 'pro';

  return (
    <Screen>
      <AppBar title="Statistiques" />
      <Text style={styles.group}>{bundle.data.group.name}</Text>

      {/* Chiffre-vedette : un seul par écran */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Membres</Text>
        <Text style={styles.heroValue}>{s.members.total}</Text>
        <View style={styles.deltaRow}>
          <Delta value={s.members.joined_30d} up label="arrivées" />
          <Delta value={s.members.left_30d} label="départs" />
          <Text style={styles.deltaPeriod}>sur 30 jours</Text>
        </View>
      </View>

      <SectionTitle style={{ marginTop: 22 }}>Engagement</SectionTitle>
      <View style={styles.grid}>
        <Tile label="Membres actifs sur 7 jours" value={s.engagement.active_7d} sub={`${s.engagement.active_30d} sur 30 jours`} />
        <Tile label="Taux d’activité sur 30 jours" value={pct(s.engagement.active_30d, s.members.total)} sub="membres ayant écrit" />
      </View>
      <WeeklyMessages weeks={s.engagement.messages_per_week} />

      <SectionTitle style={{ marginTop: 22 }}>Sorties</SectionTitle>
      <View style={styles.grid}>
        <Tile label="Sorties à venir" value={s.rides.upcoming} sub={`${s.rides.past_90d} sur les 90 derniers jours`} />
        <Tile label="Inscrits par sortie" value={s.rides.avg_participants ?? '—'} sub="moyenne sur 90 jours" />
        {pro && <Tile label="Inscrits hors groupe" value={s.rides.outside_participants} sub="via l’onglet Événements" />}
      </View>
      <Text style={styles.note}>La présence effective le jour J n’est pas encore mesurée : les chiffres portent sur les inscrits.</Text>

      <SectionTitle style={{ marginTop: 22 }}>Suggestions</SectionTitle>
      <View style={styles.grid}>
        <Tile label="Reçues sur 30 jours" value={s.suggestions.received_30d} sub={`${pct(s.suggestions.accepted_30d, s.suggestions.received_30d)} acceptées`} />
        <Tile
          label="Délai médian de décision"
          value={s.suggestions.median_decision_hours === null ? '—' : `${s.suggestions.median_decision_hours} h`}
          sub={`${s.suggestions.pending} en attente`}
        />
      </View>

      <SectionTitle style={{ marginTop: 22 }}>Invitations</SectionTitle>
      <View style={styles.grid}>
        <Tile label="Envoyées sur 30 jours" value={s.invites.sent_30d} sub={`${s.invites.accepted_30d} acceptées`} />
      </View>
    </Screen>
  );
}

function Delta({ value, label, up }: { value: number; label: string; up?: boolean }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <View style={styles.delta}>
      {value > 0 ? <Icon size={14} color={up ? colors.success : colors.inkMute} /> : null}
      <Text style={styles.deltaTxt}>
        {value > 0 ? (up ? '+' : '−') : ''}
        {value} {value > 1 ? label : label.replace(/s$/, '')}
      </Text>
    </View>
  );
}

function Tile({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
      {sub ? <Text style={styles.tileSub}>{sub}</Text> : null}
    </View>
  );
}

/**
 * Messages texte par semaine (8 semaines). Une seule série : pas de légende,
 * le titre la nomme. Toucher une barre affiche sa valeur ; vue tableau
 * disponible pour les lecteurs d'écran et la lecture exacte.
 */
function WeeklyMessages({ weeks }: { weeks: GroupStats['engagement']['messages_per_week'] }) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<number>(weeks.length - 1);
  const [table, setTable] = useState(false);
  const H = 150;
  const top = 18;
  const bottom = 22;
  const left = 26;
  const plotH = H - top - bottom;
  const max = Math.max(4, ...weeks.map((w) => w.count));
  const step = Math.ceil(max / 4);
  const yMax = step * 4;
  const slot = width ? (width - left) / weeks.length : 0;
  const barW = Math.min(22, slot * 0.55);
  const y = (v: number) => top + plotH - (v / yMax) * plotH;
  const last = weeks.length - 1;

  // Barre aux extrémités arrondies (4 px) côté donnée, ancrée à plat sur la ligne de base.
  const bar = (x: number, v: number) => {
    const h = Math.max(0, (v / yMax) * plotH);
    if (h === 0) return '';
    const r = Math.min(4, h, barW / 2);
    const x0 = x - barW / 2;
    const y0 = top + plotH - h;
    const base = top + plotH;
    return `M${x0} ${base}V${y0 + r}Q${x0} ${y0} ${x0 + r} ${y0}H${x0 + barW - r}Q${x0 + barW} ${y0} ${x0 + barW} ${y0 + r}V${base}Z`;
  };

  return (
    <View style={styles.chart}>
      <View style={styles.chartHead}>
        <Text style={styles.chartTitle}>Messages par semaine</Text>
        <Pressable onPress={() => setTable((t) => !t)} style={styles.toggle} accessibilityLabel={table ? 'Voir le graphique' : 'Voir en tableau'}>
          {table ? <BarChart3 size={14} color={colors.inkDim} /> : <Table2 size={14} color={colors.inkDim} />}
          <Text style={styles.toggleTxt}>{table ? 'Graphique' : 'Tableau'}</Text>
        </Pressable>
      </View>

      {table ? (
        <View>
          {weeks.map((w, i) => (
            <View key={w.week} style={[styles.tr, i > 0 && styles.trSep]}>
              <Text style={styles.td}>Semaine du {weekLabel(w.week)}{i === last ? ' (en cours)' : ''}</Text>
              <Text style={styles.tdNum}>{w.count}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)} accessibilityRole="image" accessibilityLabel={`Messages par semaine : ${weeks.map((w) => `${weekLabel(w.week)} ${w.count}`).join(', ')}`}>
          {width > 0 && (
            <Svg width={width} height={H}>
              {[0, 1, 2, 3, 4].map((k) => (
                <React.Fragment key={k}>
                  <Line x1={left} x2={width} y1={y(k * step)} y2={y(k * step)} stroke={k === 0 ? colors.lineStrong : colors.line} strokeWidth={1} />
                  <SvgText x={left - 6} y={y(k * step) + 3.5} fontSize={10} fill={colors.inkMute} textAnchor="end" fontFamily={fonts.mono}>
                    {k * step}
                  </SvgText>
                </React.Fragment>
              ))}
              {weeks.map((w, i) => {
                const cx = left + slot * (i + 0.5);
                return (
                  <React.Fragment key={w.week}>
                    <Path d={bar(cx, w.count)} fill={colors.neon} opacity={i === selected ? 1 : 0.72} />
                    {i === selected && (
                      <SvgText x={cx} y={y(w.count) - 6} fontSize={11} fill={colors.ink} textAnchor="middle" fontFamily={fonts.bold}>
                        {w.count}
                      </SvgText>
                    )}
                    {/* Une étiquette sur deux, la semaine en cours toujours, calée à droite. */}
                    {i % 2 === last % 2 && (
                      <SvgText
                        x={i === last ? width - 2 : cx}
                        y={H - 6}
                        fontSize={9.5}
                        fill={i === last ? colors.inkDim : colors.inkMute}
                        textAnchor={i === last ? 'end' : 'middle'}
                        fontFamily={fonts.medium}
                      >
                        {i === last ? 'en cours' : weekLabel(w.week)}
                      </SvgText>
                    )}
                    {/* Zone de toucher plus large que la barre */}
                    <Rect x={cx - slot / 2} y={top} width={slot} height={plotH + bottom} fill="transparent" onPress={() => setSelected(i)} />
                  </React.Fragment>
                );
              })}
            </Svg>
          )}
          <Text style={styles.chartFoot}>
            Semaine du {weekLabel(weeks[selected]!.week)} : {weeks[selected]!.count} message{weeks[selected]!.count > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim, marginBottom: 12 },
  hero: { padding: 18, borderRadius: 18, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  heroLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },
  heroValue: { fontFamily: fonts.semibold, fontSize: 52, color: colors.ink, letterSpacing: -1, marginTop: 2 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  deltaTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  deltaPeriod: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { flexGrow: 1, flexBasis: '46%', padding: 14, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  tileLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },
  tileValue: { fontFamily: fonts.semibold, fontSize: 26, color: colors.ink, marginTop: 4 },
  tileSub: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute, marginTop: 2 },
  note: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute, marginTop: 8, paddingHorizontal: 4, lineHeight: 16 },
  chart: { marginTop: 10, padding: 14, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  chartHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  chartTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  toggleTxt: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkDim },
  chartFoot: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim, marginTop: 6 },
  tr: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  trSep: { borderTopWidth: 1, borderTopColor: colors.line },
  td: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },
  tdNum: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
});
