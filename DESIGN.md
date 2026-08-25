# KOK BISA? PHYSICS DISCOURSE ANALYTICS
## Design System & Product Experience Specification

---

# 1. PRODUCT OVERVIEW

## Product Name

**KOK BISA? Discourse Analytics**

Alternative internal name:

> **Physics Discourse Intelligence Dashboard**

The application is an interactive research dashboard designed to explore,
analyze, and visualize discourse patterns found in YouTube comments from
the Kok Bisa? physics-related playlist.

The dashboard transforms a large-scale corpus of YouTube comments into an
interactive semantic research environment.

The system allows users to explore:

- 35 publicly accessible videos
- 202,429 YouTube comments
- 8 discourse categories
- Model confidence
- Classification margins
- Video-level discourse patterns
- Audience discussion behavior
- Semantic trends across videos

---

# 2. PRIMARY DESIGN PRINCIPLE

The interface should feel like:

> **Academic Research Platform × Modern Data Product × shadcn/ui**

Avoid:

- overly colorful dashboards
- excessive gradients
- excessive glassmorphism
- dashboard clutter
- too many cards
- neon colors
- excessive animations
- tiny typography
- charts without clear interpretation

The interface should communicate:

- scientific credibility
- modern technology
- data transparency
- ease of exploration
- visual calmness
- analytical depth

---

# 3. DESIGN LANGUAGE

## Core Design Keywords

- Minimal
- Scientific
- Analytical
- Editorial
- Modern
- Structured
- Calm
- High information density
- Accessible
- Professional

Visual inspiration should resemble a combination of:

- modern research platforms
- Vercel dashboard aesthetics
- Linear interface clarity
- Observable-style data exploration
- shadcn/ui component consistency

---

# 4. DESIGN SYSTEM

## Framework

Use:

- Next.js / Vite + React
- TypeScript / Modern JavaScript
- Tailwind CSS / Vanilla CSS tokens
- shadcn/ui Design Language

Recommended shadcn/ui components:

- Button
- Card
- Badge
- Tabs
- Table
- Sheet
- Dialog
- Tooltip
- DropdownMenu
- Select
- Command
- Popover
- Separator
- Skeleton
- Progress
- ScrollArea
- Accordion
- Collapsible
- Toggle
- ToggleGroup

---

# 5. COLOR SYSTEM

The dashboard should primarily use neutral colors.

## Base Colors

### Background

Light mode:

```text
Background: hsl(0 0% 100%)
Secondary: hsl(210 40% 98%)
Muted: hsl(210 40% 96.1%)
```

Dark mode:

```text
Background: hsl(222 47% 11%)
Secondary: hsl(217 33% 17%)
Muted: hsl(217 33% 20%)
```

---

## Primary Accent

Use a restrained scientific blue.

```text
Primary Blue
#2563EB
```

Alternative accent:

```text
Indigo
#4F46E5
```

Do not use both heavily at the same time.

---

# 6. DISCOURSE CATEGORY COLORS

Each discourse category should have a stable color.

Do not use extremely saturated colors.

Suggested palette:

| Label        | Color Role   | Hex Code |
| ------------ | ------------ | :------: |
| Question     | Blue         | `#3B82F6` |
| Opinion      | Violet       | `#8B5CF6` |
| Disagreement | Red          | `#EF4444` |
| Correction   | Orange       | `#F97316` |
| Suggestion   | Teal         | `#14B8A6` |
| Praise       | Yellow/Amber | `#EAB308` |
| Agreement    | Green        | `#22C55E` |
| Experience   | Pink         | `#EC4899` |

Example mapping:

```ts
export const discourseColors = {
  Question: "#3B82F6",
  Opinion: "#8B5CF6",
  Disagreement: "#EF4444",
  Correction: "#F97316",
  Suggestion: "#14B8A6",
  Praise: "#EAB308",
  Agreement: "#22C55E",
  Experience: "#EC4899",
};
```

Colors should primarily appear in:

* charts
* badges
* small indicators
* legends

Avoid filling entire sections with category colors.

---

# 7. TYPOGRAPHY

Recommended:

```text
Inter
Geist
or
IBM Plex Sans / Plus Jakarta Sans
```

Typography hierarchy:

```text
Page Title
36–48px
Bold

Section Title
24–30px
Semibold

Card Title
16–18px
Semibold

Body
14–16px
Regular

Metadata
12–14px
Muted
```

Avoid excessively small text.

Minimum body size:

```text
14px
```

---

# 8. GLOBAL LAYOUT

The application uses a responsive dashboard shell.

```text
┌─────────────────────────────────────────────────────┐
│ TOP NAVIGATION                                     │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│              │                                      │
│ SIDEBAR      │          MAIN CONTENT                │
│              │                                      │
│              │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

Desktop:

```text
Sidebar: 240px
Content max-width: 1600px
```

Large screens:

```text
Content padding: 32–48px
```

Mobile:

```text
Sidebar becomes Sheet / Drawer
```

---

# 9. TOP NAVIGATION

The top navigation should contain:

Left:

```text
[KOK BISA?]
Discourse Analytics
```

Center:

Optional breadcrumb:

```text
Research Dashboard / Overview
```

Right:

```text
Dataset Status
Theme Toggle
GitHub / Documentation
```

Dataset badge example:

```text
● 202,429 Comments
```

Use:

```text
Badge variant="secondary"
```

---

# 10. SIDEBAR NAVIGATION

Use icon + label.

```text
Overview

Dataset Explorer

Discourse Analysis

Video Analysis

Comment Explorer

Model Performance

Methodology

About Research
```

Recommended icons:

```text
LayoutDashboard
Database
MessageSquareText
Youtube
Search
BrainCircuit
BookOpen
Info
```

Use Lucide icons.

The active navigation item should use:

```text
bg-accent
text-accent-foreground
```

Avoid large colored sidebar blocks.

---

# 11. PAGE: OVERVIEW

Route:

```text
/
```

This is the main research dashboard.

---

## 11.1 HERO SECTION

Left:

```text
KOK BISA? PHYSICS
DISCOURSE ANALYTICS
```

Subtitle:

```text
Large-scale semantic analysis of 202,429 YouTube comments
using transformer-based discourse classification.
```

Right:

A compact research summary card.

```text
Dataset

202,429
YouTube Comments

35
Physics Videos

8
Discourse Categories

0.974
Best Macro F1
```

Important:

Do not create a huge marketing hero.

This is a research platform.

Keep it compact.

---

# 12. RESEARCH KPI GRID

Use four cards.

```text
┌────────────┐
│ 202,429    │
│ Comments   │
└────────────┘

┌────────────┐
│ 35         │
│ Videos     │
└────────────┘

┌────────────┐
│ 8          │
│ Categories │
└────────────┘

┌────────────┐
│ 97.40%     │
│ Accuracy   │
└────────────┘
```

Each card should include:

* icon
* value
* description
* optional small trend/metadata

Example:

```text
MessageSquare

202,429

Total Comments

Full corpus analyzed
```

---

# 13. OVERVIEW VISUALIZATION GRID

Below KPI cards:

```text
┌───────────────────────────┬───────────────────────┐
│                           │                       │
│  Discourse Distribution   │  Dataset Composition  │
│                           │                       │
│       Donut Chart         │    Horizontal Bars    │
│                           │                       │
├───────────────────────────┼───────────────────────┤
│                                                   │
│        Discourse Pattern Across Videos            │
│                                                   │
│                Interactive Chart                  │
│                                                   │
└───────────────────────────────────────────────────┘
```

Recommended charts:

### Chart 1

Donut chart:

```text
Distribution of discourse categories
```

### Chart 2

Horizontal bar:

```text
Top discourse categories
```

### Chart 3

Stacked bar chart:

```text
Discourse distribution across videos
```

The user should be able to:

```text
Hover → view exact values

Click category → filter dashboard

Click video → open video detail
```

---

# 14. DISCOURSE ANALYSIS PAGE

Route:

```text
/discourse
```

Header:

```text
Discourse Landscape
```

Subtitle:

```text
Explore how audiences ask, discuss, agree, disagree,
correct, and share experiences.
```

---

## 14.1 CATEGORY FILTER

Use ToggleGroup or Command filter.

```text
All

Question
Opinion
Disagreement
Correction
Suggestion
Praise
Agreement
Experience
```

The filter should update all charts.

---

## 14.2 MAIN VISUALIZATION

Large stacked area or stacked bar chart.

Title:

```text
Discourse Composition Across Videos
```

X-axis:

```text
Videos
```

Y-axis:

```text
Number of Comments
```

Legend:

```text
Question
Opinion
Disagreement
Correction
Suggestion
Praise
Agreement
Experience
```

---

## 14.3 CATEGORY INSIGHT PANEL

When the user clicks a category:

Example:

```text
QUESTION

Most dominant in:
"Misteri Besar Sepeda yang Belum Terpecahkan"

Percentage:
34.2%

Total comments:
XX,XXX
```

Below:

```text
Representative Comments
```

Display 3–5 example comments.

Each comment card:

```text
Question

"Kenapa kalau..."

Confidence 0.97
Margin 0.84
```

---

# 15. VIDEO ANALYSIS PAGE

Route:

```text
/videos
```

This is one of the most important pages.

---

## 15.1 VIDEO LIBRARY

Grid:

```text
┌───────────────┐
│ Thumbnail     │
│               │
│ ▶             │
├───────────────┤
│ Video Title   │
│               │
│ 12,429        │
│ comments      │
│               │
│ Question 32%  │
└───────────────┘
```

Responsive grid:

```text
Desktop: 3–4 columns
Tablet: 2 columns
Mobile: 1 column
```

---

# 16. PLAYLIST DATA

The dashboard must support the following playlist.

Playlist ID:

```text
PLCnD2jU_siVrn_0fbUVeUX-ZiGNNsiXC4
```

Total discovered videos:

```text
36
```

Accessible public videos:

```text
35
```

Private/deleted:

```text
1
```

The inaccessible private video should:

* not appear in normal analysis
* appear in methodology/dataset notes
* be marked as excluded

---

# 17. VIDEO CATALOG

The following public videos should be available in the application.

```ts
export const playlistVideos = [
  {
    position: 0,
    videoId: "Beod6J0genE",
    title: "Di Sinilah Tempat di Bumi yang ‘Tanpa’ Gravitasi",
  },
  {
    position: 1,
    videoId: "jPyd0Xv5LfY",
    title: "Misteri Besar Sepeda yang Belum Terpecahkan",
  },
  {
    position: 2,
    videoId: "twXOQyxZWxY",
    title: "Benarkah Ngelipat Kertas Bisa Ngebawa Kita Sampai ke Bulan?",
  },
  {
    position: 3,
    videoId: "rha05J96bOM",
    title: "Seberapa Besar Bintang Bisa Terbentuk?",
  },
  {
    position: 4,
    videoId: "AxyPASIXz1k",
    title: "Apakah Ada yang Lebih Kecil dari Atom?",
  },
  {
    position: 5,
    videoId: "T8g_hUpx9VU",
    title: "Apa Benda Paling Panas Sejagat Raya?",
  },
  {
    position: 6,
    videoId: "QK01ROEqJ1A",
    title: "Apakah Ada Ujung Alam Semesta?",
  },
  {
    position: 7,
    videoId: "5Zi4qGpGop4",
    title: "Dari Mana Bulan Kita Berasal?",
  },
  {
    position: 8,
    videoId: "t5SaFgSaM_M",
    title: "Seberapa Perlu Kita Mencari ‘Bumi’ Baru?",
  },
  {
    position: 9,
    videoId: "impJiSfof9E",
    title: "BREAKING NEWS: Foto Black Hole Pertama Dalam Sejarah",
  },
  {
    position: 10,
    videoId: "rloh5wZxFrU",
    title: "Seberapa Jauh Bumi dan Matahari?",
  },
  {
    position: 11,
    videoId: "5_9wU8yJZ8w",
    title: "Apakah Pesawat Sering Menabrak Burung Di Langit?",
  },
  {
    position: 12,
    videoId: "RBFhyVux3IE",
    title: "Apakah Flash Disk Makin Berat Ketika Diisi Data?",
  },
  {
    position: 13,
    videoId: "YxgOhIQJX3Q",
    title: "Bisakah Pesawat Terbang ke Luar Angkasa?",
  },
  {
    position: 14,
    videoId: "qis44fqpuAU",
    title: "Jika Ada Mesin Waktu, Apa Yang Ingin Kalian Lakukan? (Diskusi)",
  },
  {
    position: 15,
    videoId: "T9ttUfGG7EE",
    title: "Benarkah Manusia Pernah Mendarat di Bulan?",
  },
  {
    position: 16,
    videoId: "21seK8tKSYI",
    title: "Apa Jadinya Jika Bumi Datar?",
  },
  {
    position: 17,
    videoId: "0QCq6GPY8kQ",
    title: "Bagaimana Kapal Berat Dapat Terapung?",
  },
  {
    position: 18,
    videoId: "dghOCZmSEUQ",
    title: "Kenapa Luar Angkasa Gelap?",
  },
  {
    position: 19,
    videoId: "FGdLT8UuBZI",
    title: "Apa Itu Gerhana Bulan Raksasa (Supermoon)?",
  },
  {
    position: 20,
    videoId: "zbSe0xE7tg0",
    title: "Apakah Manusia Bisa Hidup di Luar Angkasa?",
  },
  {
    position: 21,
    videoId: "2EVv7dmTFik",
    title: "Bagaimana Matahari Terbakar Tanpa Oksigen di Luar Angkasa?",
  },
  {
    position: 22,
    videoId: "iyJeozHhvJI",
    title: "Apa Yang Terjadi Jika Bulan Lenyap?",
  },
  {
    position: 23,
    videoId: "YljSXjd4lnk",
    title: "Kenapa Pesawat Bisa Terbang?",
  },
  {
    position: 24,
    videoId: "JRJ1ngbUe6A",
    title: "Bagaimana Satelit Bisa Melayang Dan Tak Jatuh Dari Langit?",
  },
  {
    position: 25,
    videoId: "uA3cMFjqfaM",
    title: "Bisakah Kita Membangun Koloni di Mars?",
  },
  {
    position: 26,
    videoId: "iq0yOkj3d28",
    title: "Kenapa Bagi Kita, Bumi Terlihat Datar?",
  },
  {
    position: 27,
    videoId: "NVDIHTGVcLc",
    title: "Seberapa Tinggi Kita Bisa Mendirikan Bangunan?",
  },
  {
    position: 28,
    videoId: "FMNRItiR6ZA",
    title: "Kenapa Pluto Tidak Lagi Dianggap Sebagai Planet?",
  },
  {
    position: 29,
    videoId: "PEbhbW4rgy4",
    title: "Apa Yang Akan Terjadi Jika Matahari Tiba Tiba Lenyap?",
  },
  {
    position: 30,
    videoId: "6ceW7ugIKMs",
    title: "Bagaimana Gerhana Matahari Bisa Terjadi?",
  },
  {
    position: 31,
    videoId: "H_5TPzquRyo",
    title: "Apakah Teori Gravitasi dan Evolusi Hanya Sebuah Teori?",
  },
  {
    position: 32,
    videoId: "FjFsx6iQE3Y",
    title: "Apakah Ada Kehidupan Lain di Luar Bumi?",
  },
  {
    position: 33,
    videoId: "Tx87wEaDtxo",
    title: "Apa Itu Black Hole Sebenarnya?",
  },
  {
    position: 34,
    videoId: "eXml_nlmPoE",
    title: "Kenapa Bumi Bulat, Ngga Kotak?",
  }
];
```

---

# 18. VIDEO DETAIL PAGE

Route:

```text
/videos/[videoId]
```

Layout:

```text
┌───────────────────────────────────────────────────┐
│                                                   │
│                 YOUTUBE VIDEO                     │
│                                                   │
│                  Embedded Player                  │
│                                                   │
└───────────────────────────────────────────────────┘

Video Title

───────────────────────────────────────────────────

Comments     Dominant Discourse     Avg Confidence

12,429       Question               0.93

───────────────────────────────────────────────────

[Discourse Distribution Chart]

───────────────────────────────────────────────────

[Top Comments by Category]
```

---

# 19. YOUTUBE EMBEDDING

Use:

```text
https://www.youtube.com/embed/{videoId}
```

Example component:

```tsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}`}
  title={video.title}
  allowFullScreen
/>
```

The player should:

* maintain 16:9 ratio
* have rounded-xl border
* not autoplay
* be responsive

Use AspectRatio from shadcn/ui.

---

# 20. COMMENT EXPLORER

Route:

```text
/comments
```

The user should be able to explore individual comments.

Top filters:

```text
Search comments...

[Video ▼]

[Discourse Type ▼]

[Confidence ▼]

[Sort ▼]
```

Below:

```text
┌──────────────────────────────────────────────┐
│ Question                              0.97   │
│                                              │
│ "Kalau bumi berputar kenapa kita tidak..."  │
│                                              │
│ Video: Kenapa Bumi Bulat, Ngga Kotak?        │
│ Margin: 0.82                                 │
└──────────────────────────────────────────────┘
```

Use virtualized lists or server pagination.

Do not render all 202k comments at once.

---

# 21. CONFIDENCE EXPLORER

Create an analysis mode.

Route:

```text
/confidence
```

Visualization:

```text
Confidence vs Margin
```

Scatter plot:

```text
X-axis:
Confidence

Y-axis:
Classification Margin
```

Provide:

```text
High Confidence

Medium Confidence

Low Confidence
```

Allow brushing / filtering.

When clicking a point:

Open a Sheet / Modal.

```text
COMMENT DETAIL

Predicted Label
Question

Confidence
0.982

Margin
0.842

Original Comment
...
```

---

# 22. MODEL PERFORMANCE PAGE

Route:

```text
/model
```

Header:

```text
Model Benchmark
```

Display experiment comparison.

Example:

| Experiment | Model    |   LR | Macro F1 | Accuracy |
| ---------- | -------- | ---: | -------: | -------: |
| EXP_01     | IndoBERT | 2e-5 |   0.9693 |   0.9741 |
| EXP_02     | IndoBERT | 3e-5 |   0.9740 |   0.9773 |

Additional experiments should automatically populate if available.

Important:

Do not manually hard-code experimental results.

Read from:

```text
outputs/training/
```

or a structured experiment result JSON/CSV.

---

# 23. MODEL RESULT HIGHLIGHT

Large highlighted card:

```text
BEST MODEL

IndoBERT

Macro F1
0.9740

Accuracy
97.73%

Weighted F1
0.9772
```

Include:

```text
Dataset
7,148 Training Samples

1,850 Validation Samples

8 Classes
```

---

# 24. METHODOLOGY PAGE

Route:

```text
/methodology
```

Use a visual research pipeline.

```text
YouTube Playlist

↓

Data Collection

↓

Corpus Construction

↓

Manual Annotation

↓

Transformer Fine-Tuning

↓

Model Benchmarking

↓

Full Corpus Inference

↓

Discourse Analysis
```

Each stage should be an interactive card.

Click:

```text
Data Collection
```

Opens detailed methodology.

---

# 25. DATASET EXPLORER

Route:

```text
/dataset
```

Show:

```text
Dataset Overview

Total comments
202,429

Total videos
35

Accessible playlist coverage
97.2%
```

Include:

* table
* search
* video filtering
* discourse filtering
* sample preview

Use pagination.

---

# 26. RESEARCH TRANSPARENCY

Include a visible:

```text
Data & Model Transparency
```

Panel.

Example:

```text
Corpus
202,429 comments

Classifier
Fine-tuned Transformer

Labels
8 discourse categories

Best Validation Macro F1
0.9740
```

Do not hide methodology.

This is a research dashboard.

Transparency should be a major design feature.

---

# 27. INTERACTION DESIGN

Interactions should be subtle.

Use:

```text
150–250ms
```

transitions.

Examples:

```text
hover:shadow-sm

hover:bg-muted

transition-colors

transition-transform
```

Avoid:

* bouncing
* spinning decorations
* unnecessary entrance animations
* parallax
* excessive motion

---

# 28. LOADING STATES

Use shadcn/ui Skeleton.

Example:

```text
┌──────────────┐
│ ██████████   │
│ ██████       │
│ ███████████  │
└──────────────┘
```

Never leave a blank page during data loading.

---

# 29. EMPTY STATES

Example:

```text
No comments found.

Try adjusting your filters.
```

Include:

```text
[Reset Filters]
```

Use a subtle icon.

---

# 30. ERROR STATES

Example:

```text
Unable to load dataset.

The requested data source could not be reached.
```

Button:

```text
Retry
```

---

# 31. RESPONSIVE DESIGN

## Desktop

Full sidebar.

Multi-column charts.

## Tablet

Collapsible sidebar.

Two-column grids.

## Mobile

Single-column layout.

Bottom sheet filters.

Charts horizontally scroll if necessary.

YouTube player remains 16:9.

---

# 32. ACCESSIBILITY

Must include:

* keyboard navigation
* focus states
* accessible contrast
* chart legends
* tooltips
* aria labels
* semantic HTML

Never rely only on color to distinguish discourse categories.

Always combine:

```text
Color + Label
```

---

# 33. DATA ARCHITECTURE

Suggested structure:

```text
data/

├── corpus/
│   └── corpus.parquet

├── processed/
│   └── full_corpus_predictions.parquet

├── playlist/
│   └── playlist_metadata.json

├── experiments/
│   └── experiment_results.json

└── analysis/
    ├── video_statistics.json
    ├── discourse_statistics.json
    └── confidence_statistics.json
```

---

# 34. API DESIGN

Suggested endpoints:

```text
/api/overview

/api/videos

/api/videos/[id]

/api/comments

/api/discourse

/api/model

/api/confidence
```

Filtering example:

```text
/api/comments?
videoId=Beod6J0genE&
label=Question&
minConfidence=0.8
```

---

# 35. PERFORMANCE REQUIREMENTS

Because the dataset contains more than 200,000 comments:

Do not:

```text
Load the entire dataset into the client.
```

Use:

```text
Server-side aggregation
Pagination
Virtualization
Lazy loading
Cached statistics
```

Precompute:

```text
Discourse counts

Video-level statistics

Confidence distributions

Top representative comments
```

---

# 36. RECOMMENDED CHART STACK

Use:

```text
Recharts
```

for:

* bar charts
* line charts
* area charts
* pie charts

Use:

```text
Plotly / ECharts
```

for advanced analytical visualization.

---

# 37. KEY DASHBOARD USER FLOW

```text
LANDING

↓

OVERVIEW

↓

SELECT VIDEO

↓

WATCH VIDEO

↓

EXPLORE DISCOURSE

↓

FILTER CATEGORY

↓

READ REPRESENTATIVE COMMENTS

↓

OPEN COMMENT DETAIL

↓

EXPLORE CONFIDENCE

↓

COMPARE VIDEO PATTERNS
```

---

# 38. DESIGN PRIORITY

Priority order:

```text
1. Research clarity

2. Data exploration

3. Interaction

4. Visual quality

5. Animation
```

Never sacrifice research readability for visual effects.

---

# 39. FINAL VISUAL CHARACTER

The final application should feel like:

> A polished, publication-quality research intelligence platform.

It should not feel like:

> A generic admin dashboard.

The visual experience should communicate that this project combines:

* Physics education
* Digital discourse research
* Natural language processing
* Transformer models
* Large-scale YouTube data analysis

The dashboard should make complex research results understandable to:

* researchers
* students
* teachers
* judges
* academic audiences
* general audiences

---

# 40. FINAL IMPLEMENTATION RULES

Always use shadcn/ui components where appropriate.

Do not recreate standard components manually when shadcn/ui already provides them.

Use:

```text
rounded-lg
rounded-xl
border
bg-card
text-muted-foreground
```

Prefer spacing:

```text
gap-4
gap-6
gap-8

p-4
p-6
p-8
```

Avoid arbitrary visual styling.

Follow a consistent spacing system.

The interface must feel:

```text
CALM
STRUCTURED
SCIENTIFIC
MODERN
INTERACTIVE
```

---

# SUCCESS CRITERIA

The dashboard is successful when a user can:

1. Understand the research in under one minute.
2. See the scale of the dataset (202,429 comments).
3. Explore all 35 videos.
4. Watch the original YouTube videos.
5. Understand discourse categories.
6. Compare discourse across videos.
7. Explore individual comments.
8. Filter results interactively.
9. Inspect model confidence.
10. Understand the research methodology.
11. Navigate the dashboard without needing instructions.
12. Experience a professional interface consistent with shadcn/ui.
