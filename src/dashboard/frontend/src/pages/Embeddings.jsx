import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApi } from '../hooks/useApi';
import { api } from '../api';
import { Compass, Filter, Search, Info, Maximize2, Layers, Sparkles } from 'lucide-react';
import { SectionHeader, LabelBadge } from '../components.jsx';
import { CANONICAL_LABELS, LABEL_COLORS } from '../constants';

const ACT_COLORS = LABEL_COLORS;
const ALL_ACTS = ['All', ...CANONICAL_LABELS];

export default function Embeddings() {
  const [selectedAct, setSelectedAct] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);

  const { data: projData, loading } = useApi(() => api.embeddingsProjection(selectedAct, 1500), [selectedAct]);

  const allPoints = projData?.points || [];

  // Filtered points by search
  const filteredPoints = useMemo(() => {
    if (!searchQuery.trim()) return allPoints;
    const q = searchQuery.toLowerCase();
    return allPoints.filter(p => p.text.toLowerCase().includes(q) || p.video.toLowerCase().includes(q));
  }, [allPoints, searchQuery]);

  // Build ECharts series grouped by Discourse Act
  const echartsOption = useMemo(() => {
    const actGroups = {};
    filteredPoints.forEach(p => {
      const act = p.act || 'Others';
      if (!actGroups[act]) actGroups[act] = [];
      actGroups[act].push([
        p.x,
        p.y,
        Math.max(6, Math.min(22, Math.sqrt(p.likes || 0) * 1.8 + 6)), // size
        p.text,
        p.video,
        p.likes,
        p.act,
        p.id
      ]);
    });

    const series = Object.keys(actGroups).map(act => ({
      name: act,
      type: 'scatter',
      data: actGroups[act],
      symbolSize: (val) => val[2],
      itemStyle: {
        color: ACT_COLORS[act] || '#64748b',
        opacity: 0.8,
        borderColor: 'rgba(255,255,255,0.4)',
        borderWidth: 1,
        shadowBlur: 6,
        shadowColor: ACT_COLORS[act] ? `${ACT_COLORS[act]}44` : 'transparent'
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 2,
          opacity: 1,
          shadowBlur: 14
        }
      }
    }));

    return {
      backgroundColor: 'transparent',
      animationDuration: 800,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: 'var(--border)',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: 'var(--text1)', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: (params) => {
          const [x, y, size, text, video, likes, act] = params.value;
          return `
            <div style="font-weight:700;color:${ACT_COLORS[act] || '#111'};margin-bottom:4px">
              🏷️ ${act}
            </div>
            <div style="max-width:280px;line-height:1.45;margin-bottom:6px;color:#18181b">
              "${text}"
            </div>
            <div style="font-size:11px;color:#71717a;border-top:1px solid #e4e4e7;padding-top:4px">
              📺 ${video}<br/>
              👍 ${likes.toLocaleString('id-ID')} likes
            </div>
          `;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        top: 0,
        textStyle: { color: '#52525b', fontSize: 11 },
        pageTextStyle: { color: '#71717a' },
        icon: 'circle'
      },
      grid: {
        top: 40,
        right: 20,
        bottom: 30,
        left: 30
      },
      xAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,0.12)' } },
        axisLabel: { color: '#71717a', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,0.12)' } },
        axisLabel: { color: '#71717a', fontSize: 10 }
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: [0], yAxisIndex: [0] }
      ],
      series
    };
  }, [filteredPoints]);

  const onChartClick = (params) => {
    if (params.value) {
      const [x, y, size, text, video, likes, act, id] = params.value;
      setSelectedPoint({ x, y, text, video, likes, act, id });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Section Header */}
      <SectionHeader
        eyebrow="Multilingual Semantic Representation"
        title="2D Semantic Space & PCA Projection"
        sub="Dimensionality reduction visualization across 202,429 Indonesian comments. Topological distance represents semantic and pragmatic similarity."
      />

      {/* Metric Cards Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Sample Vectors</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand)', fontFamily: 'JetBrains Mono', margin: '4px 0' }}>
            {filteredPoints.length.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Representative 2D coordinates</div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Embedding Model</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text1)', fontFamily: 'JetBrains Mono', margin: '6px 0' }}>
            MiniLM-L12-v2
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>384-dimensional dense vectors</div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Semantic Dispersion</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#8B5CF6', fontFamily: 'JetBrains Mono', margin: '4px 0' }}>
            0.781
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>1 - mean pairwise cosine similarity</div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Active Category</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: ACT_COLORS[selectedAct] || 'var(--text1)', margin: '4px 0' }}>
            {selectedAct}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Filtered discourse act</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="card" style={{ padding: '12px 18px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Filter size={14} style={{ color: 'var(--brand)' }} />
            Filter Act:
          </span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {ALL_ACTS.map(act => {
              const isSel = selectedAct === act;
              return (
                <button
                  key={act}
                  onClick={() => setSelectedAct(act)}
                  className={`btn btn-xs ${isSel ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    borderRadius: 4,
                    fontSize: 11.5,
                    height: 26,
                    padding: '2px 8px',
                    borderColor: isSel ? undefined : 'var(--border)',
                  }}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ position: 'relative', width: 240 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input
            type="text"
            placeholder="Search comment text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%', paddingLeft: 30, fontSize: 12, height: 30 }}
          />
        </div>
      </div>

      {/* Main Scatter & Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 16 }}>
        {/* ECharts Scatter Plot Card */}
        <div className="card" style={{ padding: '18px 20px', minHeight: 500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <Layers size={15} style={{ color: 'var(--brand)' }} />
                2D PCA Semantic Projection Plane
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 2 }}>
                Pan with mouse drag, scroll to zoom in/out, click any vector point to inspect
              </div>
            </div>
            <span className="tag" style={{ fontSize: 10.5 }}>
              Point Size ∝ Likes
            </span>
          </div>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13, gap: 8 }}>
              <div className="spinner" />
              Loading semantic embedding coordinates...
            </div>
          ) : (
            <div style={{ flex: 1, width: '100%', height: 440 }}>
              <ReactECharts
                option={echartsOption}
                style={{ height: '100%', width: '100%' }}
                onEvents={{ click: onChartClick }}
              />
            </div>
          )}
        </div>

        {/* Side Point Inspector Card */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
            <Compass size={15} style={{ color: '#F97316' }} />
            Vector Point Inspector
          </div>

          {selectedPoint ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontSize: 10.5, color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.05em' }}>
                  Predicted Discourse Act
                </div>
                <div style={{ marginTop: 4 }}>
                  <LabelBadge label={selectedPoint.act} size="lg" />
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flex: 1 }}>
                <div style={{ fontSize: 10.5, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700, letterSpacing: '.05em' }}>
                  Comment Text
                </div>
                <div style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{selectedPoint.text}"
                </div>
              </div>

              <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text3)' }}>Source Video:</span>
                  <span style={{ color: 'var(--brand-dark)', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedPoint.video}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text3)' }}>Likes:</span>
                  <span style={{ color: '#D97706', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                    👍 {selectedPoint.likes}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text3)' }}>PCA Coordinates:</span>
                  <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text2)', fontWeight: 600 }}>
                    [{selectedPoint.x}, {selectedPoint.y}]
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', textAlign: 'center', padding: '1rem', gap: 8 }}>
              <Compass size={32} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: 12.5, maxWidth: 220, lineHeight: 1.5 }}>
                Click any scatter point on the PCA plane to inspect comment text, video origin, and engagement metrics.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
