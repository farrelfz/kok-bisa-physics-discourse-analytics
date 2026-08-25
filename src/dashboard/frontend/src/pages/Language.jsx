import { useApi } from '../hooks/useApi';
import { api } from '../api';
import { Globe, Info, BarChart2, ShieldCheck, Languages } from 'lucide-react';
import { SectionHeader } from '../components.jsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend
} from 'recharts';

const COLORS = [
  '#2563EB', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
  '#EAB308', '#22C55E', '#14B8A6', '#6366F1', '#A855F7',
  '#64748B', '#0EA5E9', '#F43F5E', '#84CC16', '#D97706'
];

const LANG_NAMES = {
  id: 'Indonesian 🇮🇩',
  tl: 'Tagalog 🇵🇭',
  en: 'English 🇬🇧',
  so: 'Somali 🌍',
  sw: 'Swahili 🌍',
  de: 'German 🇩🇪',
  unknown: 'Mixed / Code-Switching',
  et: 'Estonian 🇪🇪',
  fi: 'Finnish 🇫🇮',
  it: 'Italian 🇮🇹',
  af: 'Afrikaans 🇿🇦',
  no: 'Norwegian 🇳🇴',
  pl: 'Polish 🇵🇱',
  hr: 'Croatian 🇭🇷',
  sl: 'Slovenian 🇸🇮',
};

const LANG_INFO = {
  id: 'Primary target corpus language — verified by Indonesian syntactic particle filters.',
  tl: 'Tagalog loanwords or shared Austronesian roots (e.g. "ako", "kita", "bata").',
  en: 'English scientific discourse, diaspora comments, and international viewer queries.',
  so: 'Statistical artifact: ultra-short Indonesian slang particles ("ya", "dong") misclassified as Somali.',
  sw: 'Statistical artifact: shared loanwords between Swahili and Indonesian phonetic tokens.',
  de: 'German community comments or European scientific exchange citations.',
  unknown: 'Colloquial code-switching (Indonesian-English slang) or emoji-heavy text strings.',
};

export default function Language() {
  const { data: ld, loading: ll } = useApi(() => api.languages(15));
  const langs = ld?.languages || [];
  const idLang = langs.find(l => l.lang_detected === 'id');
  const nonId = langs.filter(l => l.lang_detected !== 'id').slice(0, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Corpus Linguistic Diagnostics"
        title="Multilingual & Language Distribution"
        sub="Language identification across 202,429 YouTube comments using probabilistic n-gram language detection (langdetect) and Indonesian dialect validation."
      />

      {/* ── Highlight Banner ── */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 44, fontWeight: 900, fontFamily: 'JetBrains Mono', color: 'var(--brand-dark)', lineHeight: 1 }}>
              79.4%
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>
                Indonesian Language Dominance (Primary Corpus)
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
                {idLang ? `${idLang.count.toLocaleString('id-ID')} comments verified as Bahasa Indonesia` : 'Loading corpus count...'}
              </div>
              <div className="progress-bar" style={{ height: 8, background: 'var(--surface3)' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${idLang?.pct || 79.4}%`,
                    background: 'linear-gradient(90deg, var(--brand), #3B82F6)',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, borderLeft: '1px solid var(--border)', paddingLeft: 20, flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Detected Languages</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#8B5CF6', fontFamily: 'JetBrains Mono' }}>41</div>
              <div style={{ fontSize: 10.5, color: 'var(--text4)' }}>Unique language codes</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Corpus Total</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text1)', fontFamily: 'JetBrains Mono' }}>202,429</div>
              <div style={{ fontSize: 10.5, color: 'var(--text4)' }}>Evaluated comments</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two Col Charts ── */}
      <div className="two-col">
        {/* Main Bar Chart */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div className="card-title" style={{ margin: 0 }}>Top 15 Detected Languages</div>
              <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 2 }}>Logarithmic representation across corpus</div>
            </div>
            <span className="tag tag-brand" style={{ fontSize: 10.5 }}>
              41 Total
            </span>
          </div>

          {ll ? (
            <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text3)' }}>
              <div className="spinner" /> Loading languages...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={langs.map(l => ({ name: LANG_NAMES[l.lang_detected] || l.lang_detected, count: l.count, pct: l.pct, code: l.lang_detected }))}
                layout="vertical"
                margin={{ top: 5, right: 30, bottom: 5, left: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" scale="log" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text2)' }} width={75} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: 'var(--shadow-md)'
                  }}
                  formatter={(v, n, p) => [`${v.toLocaleString('id-ID')} comments (${p.payload.pct}%)`, 'Volume']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {langs.map((l, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={l.lang_detected === 'id' ? 1 : 0.75} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Non-ID Zoom & Interpretation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Non-Indonesian Sub-Corpus (Top 10)</div>
            <div style={{ fontSize: 11.5, color: 'var(--text3)', marginBottom: 12 }}>Distribution detail excluding dominant Indonesian comments</div>
            {ll ? (
              <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={nonId.map(l => ({ name: l.lang_detected.toUpperCase(), count: l.count, pct: l.pct }))} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickFormatter={v => v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : v} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: 'var(--shadow-md)'
                    }}
                    formatter={(v, n, p) => [`${v.toLocaleString('id-ID')} (${p.payload.pct}%)`, 'Count']}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card" style={{ padding: '18px 20px', flex: 1 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>Linguistic Interpretation Notes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {langs.slice(0, 7).map(l => (
                <div key={l.lang_detected} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <code style={{ fontSize: 11, background: 'var(--bg-subtle)', padding: '1px 5px', borderRadius: 3, color: 'var(--brand-dark)' }}>
                      {l.lang_detected}
                    </code>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text1)' }}>
                      {LANG_NAMES[l.lang_detected] || l.lang_detected}
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono', marginLeft: 'auto' }}>
                      {l.pct}%
                    </span>
                  </div>
                  {LANG_INFO[l.lang_detected] && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>
                      {LANG_INFO[l.lang_detected]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
