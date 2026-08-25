# KokBisa — Discourse Taxonomy Codebook v1.0
## Phase 1: Formal Linguistic Audit of the 11-Label Taxonomy

**Version:** 1.0 (Pre-Annotation Draft)  
**Date:** 2026-08-16  
**Status:** AWAITING INTER-RATER VALIDATION — DO NOT USE FOR FINAL ANNOTATIONS  
**Corpus:** Indonesian public comments on YouTube physics/science education videos (Kok Bisa? channel)

---

## Part A: Preliminary Theoretical Assessment

### A.1 What is the current taxonomy trying to capture?

The 11-label taxonomy attempts to classify each YouTube comment into one primary **discourse function** — what the comment is *doing* communicatively. However, the current taxonomy mixes at least **four different analytical dimensions**:

| Dimension | Labels Mixed In |
|---|---|
| **Discourse Function** (what the comment does) | Question, Answer, Suggestion, Correction |
| **Stance/Epistemic** (how the writer positions themselves) | Agreement, Disagreement, Opinion |
| **Content/Source Type** (what the content consists of) | Experience |
| **Topical Relevance** (how related to the video) | Off-topic |
| **Social/Interactional** (how the writer relates to the channel/creator) | Praise |
| **Residual** (everything that doesn't fit) | Others |

This mixing of dimensions is the primary theoretical problem with the current taxonomy. A single comment can simultaneously be:
- A **Question** (function) that expresses **Opinion** (stance) that is **Off-topic** (relevance)

This ambiguity will cause high inter-annotator disagreement and reduce classification reliability.

### A.2 Is the taxonomy fundamentally viable?

**YES** — with revision. The taxonomy is workable for a computational linguistics study IF:
1. Each label is precisely operationalized
2. Annotation policy (primary function vs. multi-label) is explicitly chosen
3. Overlapping labels are either merged, separated, or placed in a hierarchy
4. A clear decision tree is provided to annotators

The taxonomy does NOT need to be completely rebuilt from scratch.

---

## Part B: Per-Label Audit

---

### Label 1: QUESTION

#### Theoretical Basis
Speech Act Theory (Austin 1962, Searle 1969): directives — utterances that direct the hearer to perform an action, in this case to provide information. Questions are interrogative speech acts with the illocutionary force of requesting information.

In online science communication, questions are among the most documented and important discourse functions, indicating active epistemic engagement with content (Dahlstrom 2014).

#### Operational Definition
A comment that primarily requests information, clarification, confirmation, or elaboration — whether from the creator, other viewers, or as a rhetorical device.

#### Inclusion Criteria
- Direct information-seeking questions with "?" marker
- Indirect questions without "?" but with clear question syntax ("apakah bisa...", "gimana caranya", "bagaimana kalau...")
- Rhetorical questions where the writer does not expect a literal answer but is making a discursive point through question form
- Multi-question comments where question is the dominant function
- Questions addressed to the creator, another commenter, or to no one in particular

#### Exclusion Criteria
- Comments that are primarily corrections but contain a rhetorical question ("ini salah kan?" → Correction)
- Comments that express frustration through question form where the primary act is expressing opinion ("kenapa channel ini bohong sih?" → Opinion/Disagreement)
- Clarifying questions embedded in a larger suggestion ("Bisa bahas juga ga tentang X? Soalnya aku penasaran" — if suggestion is dominant → Suggestion)

#### Positive Examples (from corpus)
- "Min siapa sih yang memfoto bumi?" ✓ Direct Question
- "kenapa kipas angin kotor kalo dipake?" ✓ Direct Question  
- "Apakah manusia pernah pergi ke bulan?" ✓ Yes/No Question
- "dari mana sumber info ttg semua ini?" ✓ Source-questioning
- "Kok Bisa? Jam berapaaa kakak" ✓ Question about timing

#### Negative Examples (should NOT be classified as Question)
- "WAJIB KUDU HARUS DIJAWAB, Kenapa Nasi Padang kalo dibawa pulang nasinya banyak?" → This is a **Suggestion** (requesting a video topic), not a factual question
- "kenapa channel ini gitu sih" → **Opinion/Disagreement** expressed as pseudo-question

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Question ↔ Suggestion | Question asks for information; Suggestion requests an action (video topic, correction). If "bahas dong" or "tolong bahas" is present → Suggestion |
| Question ↔ Opinion | Opinion expressed as rhetorical question → classify by dominant illocutionary force. If the writer expects an answer → Question. If using question to express a view → Opinion |

#### Annotation Decision Rule
1. Does the comment have a clear question marker ("?", "apakah", "bagaimana", "kenapa", "mengapa", "gimana", "apa itu")?
2. Is the primary communicative intent to request information?
3. If YES to both → **Question**
4. If "?" present but intent is requesting action → **Suggestion**
5. If "?" present but intent is expressing view → **Opinion** or **Disagreement**

#### Current Distribution Warning
The model assigns **39.59%** of all comments to Question. This is almost certainly an artifact of the zero-shot model treating "?" (a very common character in casual Indonesian text) as the dominant signal. Human annotation should be expected to find a significantly lower Question proportion.

#### Recommended Status: **RETAIN** (with precise definition above)

---

### Label 2: ANSWER

#### Theoretical Basis
Speech Act Theory: assertives in response to a previous question. In threaded comment systems, Answers primarily occur as replies to Question comments.

#### Operational Definition
A comment that directly responds to and attempts to answer a specific question — from the video creator, the original commenter, or another viewer.

#### Inclusion Criteria
- Replies to question comments that provide factual information
- Replies to question comments that provide an opinion as answer
- Top-level comments that respond to questions raised in the video ("Oh, untuk yang tadi ditanyain di video, jawabannya adalah...")
- Comments confirming or denying a hypothesis raised by another

#### Exclusion Criteria
- Comments that agree with another comment but don't answer a question → Agreement
- Comments that correct an incorrect answer → Correction
- Comments that provide personal experience as an answer → May be dual-labeled Experience/Answer; use primary function

#### Positive Examples
- "@user1 iya bisa, karena gravitasi itu..." ✓ Factual reply
- "Yang nanya tadi: jawabannya relatif terhadap kecepatan cahaya" ✓ Answering video question

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Answer ↔ Agreement | Answer provides information; Agreement affirms a position without adding information |
| Answer ↔ Correction | Correction explicitly disputes an incorrect answer; Answer does not dispute |
| Answer ↔ Experience | If the answer is entirely from personal experience → Experience takes precedence |

#### Annotation Decision Rule
1. Is this a reply (parent_id is not null)?
2. Does it respond to an identifiable question?
3. Does it primarily provide information or opinion AS an answer?
4. If YES → **Answer**

#### Current Distribution: 1,988 (1.46%) — likely under-represented due to model bias

#### Recommended Status: **RETAIN** (important for capturing reciprocal discourse)

---

### Label 3: OPINION

#### Theoretical Basis
Opinion/Stance coding in discourse analysis (Biber & Finegan 1989): evaluative or interpretive statements expressing the writer's personal view on a topic, where the view is not primarily a correction of fact, not primarily agreement/disagreement with a specific prior statement, and not a personal narrative.

#### Operational Definition
A comment expressing the writer's personal view, evaluation, interpretation, or assessment of the video content, a scientific topic, or a societal issue — without primarily agreeing/disagreeing with a specific statement or narrating a personal experience.

#### Inclusion Criteria
- Personal evaluations of scientific claims ("Menurutku, teori ini masih kurang kuat karena...")
- Interpretive statements about the implications of scientific content ("Berarti manusia memang kecil banget ya di alam semesta")
- Comments expressing emotional/cognitive reactions to content without being pure Praise ("Ini bikin aku mikir tentang...")
- Off-topic opinions about life/society triggered by the video

#### Exclusion Criteria
- Views expressed in direct response to another comment's position → Agreement or Disagreement
- Personal narratives of past experience → Experience
- Evaluations of the video quality/creator → Praise (if positive) or Disagreement/Correction (if negative)

#### Positive Examples (from corpus)
- "Menurut gua bumi itu ibarat ibu yang mengandung kehidupan" ✓ Metaphorical opinion
- "Yang menyebabkan bumi rusak bisa jadi manusianya sendiri" ✓ Causal opinion
- "Kita hanya setitik debu, sangat mudah untuk dimusnahkan" ✓ Philosophical opinion

#### Negative Examples (should NOT be Opinion)
- "@user setuju banget!" → **Agreement** (opinion expressed in agreement with someone)
- "Wahh mantep pengetahuan kalian" → **Praise**
- "saya pernah ngalamin ini" → **Experience**

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Opinion ↔ Agreement | Agreement is a reaction to a specific prior statement; Opinion stands alone |
| Opinion ↔ Experience | Opinion is a view; Experience is a narrative of what happened. "Aku setuju" vs "Aku pernah" |
| Opinion ↔ Disagreement | Disagreement explicitly contests a specific claim; Opinion may be negative but doesn't directly contest |

#### Current Distribution: 2,487 (1.82%) — almost certainly MASSIVELY under-estimated

**CRITICAL NOTE:** Opinion is the default label in the rule-based fallback for all zero-score, non-question comments. The zero-shot model's 1.82% for Opinion suggests the HF model rarely selects it. In reality, a substantial portion of YouTube comments are pure opinions/reactions. Human annotation is expected to find Opinion as a much larger category.

#### Recommended Status: **RETAIN** (critical category; needs sub-type consideration)

---

### Label 4: EXPERIENCE

#### Theoretical Basis
Labov's narrative analysis (1972): personal experience narratives — first-person accounts of past events or ongoing states that the writer relates to the video content. In science communication, personal experience sharing is documented as a key engagement mechanism (Rogers 2003).

#### Operational Definition
A comment that primarily narrates a personal experience, observation, or situation that the writer relates to the video's topic. The defining feature is first-person past-tense or habitual narrative.

#### Inclusion Criteria
- First-person narratives of past events connected to the video topic
- Sharing of personal observations or recurring situations
- Comments beginning with "saya/aku pernah...", "dulu saya...", "pengalaman saya..."
- Anecdotes about family/friends as first-hand narratives

#### Exclusion Criteria
- Generic personal opinions not grounded in past narrative → Opinion
- Future hypothetical ("kalau aku di luar angkasa...") → Opinion
- Testimonials about the video quality ("setelah nonton ini saya jadi paham") → Praise if primarily evaluative

#### Positive Examples (from corpus)
- "Wahh mantep pengetahuan kalian, aku jadi terbantu dan GK gelisah lagi kepikiran pertanyaan adekku" ✓ Personal experience sharing

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Experience ↔ Opinion | Experience has narrative past-tense structure; Opinion is evaluative without personal narrative. "Pernah" keyword suggests Experience |
| Experience ↔ Answer | If personal experience is offered as an answer to a question → Answer takes precedence |

#### Annotation Decision Rule
1. Is there a first-person past narrative structure?
2. Is the primary function sharing what happened to the writer, not evaluating or questioning?
3. If YES → **Experience**

#### Current Distribution: 2,204 (1.61%) — likely under-represented

#### Recommended Status: **RETAIN** (valuable for engagement analysis)

---

### Label 5: AGREEMENT

#### Theoretical Basis
Conversational analysis (Sacks, Schegloff & Jefferson 1974): preference organization — agreement is the preferred response in adjacency pair structures. In online discourse, agreement signals community formation and endorsement.

#### Operational Definition
A comment whose primary function is to explicitly affirm, endorse, or align with a specific statement made by the creator, another commenter, or a position represented in the video.

#### Inclusion Criteria
- Explicit agreement markers: "setuju", "bener", "betul", "iya bener", "sependapat"
- English borrowings in Indonesian context: "agree", "exactly"
- Agreement followed by elaboration (primary act = agreement)
- Agreement with explicit referencing of another comment ("@user, iya itu bener")

#### Exclusion Criteria
- Agreement followed by significant disagreement → **Disagreement** (primary act)
- Agreement that is really Praise for the creator → **Praise**
- Generic affirmative replies that don't express agreement with a proposition → **Others**

#### Positive Examples (from corpus)
- "@athayazahirulhaqi6189 bro, sains selalu berkembang... sependapat" ✓ Agreement with elaboration
- "@rinaldiharitrisatio6244 ya bener juga sih" ✓ Minimal agreement

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Agreement ↔ Praise | Agreement is with a proposition; Praise is directed at the creator/video quality. "Setuju banget!" vs "Keren banget videonya!" |
| Agreement ↔ Answer | Agreement affirms without adding information; Answer provides information |

#### Current Distribution: 1,639 (1.20%) — likely under-represented; model confuses with Praise

#### Recommended Status: **RETAIN** (but may benefit from merger with Praise in a hierarchical taxonomy)

---

### Label 6: DISAGREEMENT

#### Theoretical Basis
Disagreement is the "dispreferred" response in conversational analysis — it requires more face-work (Brown & Levinson 1987) and is therefore particularly marked in online discourse. In science communication, disagreement comments may signal scientific misconceptions or valuable critical engagement.

#### Operational Definition
A comment that explicitly contests, refutes, or rejects a specific claim, position, or statement — from the creator, from science broadly, from another commenter, or implied by the video.

#### Inclusion Criteria
- Direct refutation: "tidak setuju", "salah ini", "itu bukan benar"
- Implicit disagreement signaling counter-evidence ("padahal...", "tapi sebenarnya...", "yang bener itu...")
- Religious or ideological counter-claims ("ini bertentangan dengan agama")
- Conspiracy theory-based disagreement with mainstream science

#### Exclusion Criteria
- Corrections that are factually grounded and specific → **Correction** (Correction is a more specific type that disputes AND provides the correct version)
- Negative opinions about the video without targeting a specific claim → **Opinion**

#### Positive Examples (from corpus)
- "Biisma Aswangga mikir bro pakek logika bro... koplak bngt" ✓ Disagreement (though also Opinion)
- "Valen Rizki bukan gitu bro, maksud si fadhilah..." ✓ Factual disagreement
- "Tapi di channel N.A.S.A katanya Ada suatu struktur raksasa..." ✓ Counter-claim

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Disagreement ↔ Correction | Correction specifically provides the correct version; Disagreement may only negate. "Salah!" alone = Disagreement. "Salah, yang benar adalah X" = Correction |
| Disagreement ↔ Opinion | Disagreement targets a specific claim; Opinion expresses a general view |

#### IMPORTANT OVERLAP NOTE: `"salah"` and `"bukan"` appear in both Disagreement and Correction keyword rules. This creates systematic confusion in the rule-based classifier. Decision rule: Correction requires provision of correct information; Disagreement does not.

#### Current Distribution: 6,713 (4.91%)

#### Recommended Status: **RETAIN** (with sharper distinction from Correction)

---

### Label 7: SUGGESTION

#### Theoretical Basis
Directive speech acts (Searle 1969): commissive-directive — requesting the creator or community to take an action. In YouTube science communication, Suggestion is a highly active discourse function, reflecting parasocial interaction between audience and creator.

#### Operational Definition
A comment that primarily requests the creator or channel to produce a video on a specific topic, change something about how content is presented, or take some other action.

#### Inclusion Criteria
- Video topic requests: "bahas dong", "request [topic]", "next video tentang..."
- Requests for better explanation: "tolong dijelaskan lebih detail"
- Production quality suggestions: "kapan upload lagi?", "seharusnya ada subtitle"
- Requests with hashtag conventions: "#request #KokBisa"

#### Exclusion Criteria
- Suggestions to other viewers (not to the creator)
- Questions asking whether a topic will be covered ("apakah akan ada video tentang X?") → **Question** unless phrased as request
- Corrections framed as suggestions ("sebaiknya diperbaiki X" where X is factually wrong in the video) → **Correction**

#### Positive Examples (from corpus)
- "bang apa yg terjadi jika bom atom di gunakan pada perang dunia #request #KokBisa #SemogaDiTerima" ✓ Topic request
- "WAJIB KUDU HARUS DIJAWAB, Kenapa Nasi Padang kalo dibawa pulang nasinya banyak?" ✓ Topic request (despite question form)

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Suggestion ↔ Question | Both may use question form. "bahas dong" → Suggestion. "apakah bisa dijawab?" → Question |
| Suggestion ↔ Correction | Correction targets an error in the video; Suggestion requests new content or stylistic change |

#### Current Distribution: 38,276 (28.02%) — ALMOST CERTAINLY INFLATED by model bias

**CRITICAL WARNING:** 28% Suggestion is implausibly high for a science channel. The zero-shot model likely categorizes many informal requests, imperatives, and directive-sounding phrases as Suggestion. Human annotation is expected to find a much lower true Suggestion rate (~5-15% is more typical for educational YouTube).

#### Recommended Status: **RETAIN** (but expect massive distribution correction after human annotation)

---

### Label 8: CORRECTION

#### Theoretical Basis
Repair sequences in conversational analysis (Schegloff, Jefferson & Sacks 1977): other-initiated other-repair — where a viewer identifies and corrects an error in the video or another comment. In science communication, Correction is particularly important for tracking scientific accuracy and community knowledge-sharing.

#### Operational Definition
A comment that: (a) identifies a specific error, inaccuracy, or omission in the video or another comment, AND (b) provides or implies the correct version.

**Both conditions must be met.** A comment that only says "itu salah" without providing correction = Disagreement, not Correction.

#### Inclusion Criteria
- "Koreksi:", "ralat:", explicit correction markers
- "Sebenarnya [correct information]..." where an error is implied
- Timestamp-based corrections ("menit ke-X, harusnya bukan...")
- Factual corrections citing scientific sources
- Corrections of mathematical or physical calculation errors

#### Exclusion Criteria
- "Ini salah" without providing correct information → **Disagreement**
- Opinions about scientific accuracy without specific correction → **Opinion**
- Disagreement based on ideology/religion without factual correction → **Disagreement**

#### Positive Examples (from corpus)
- "teori ilmiah adalah tahapan tertinggi... Teori dan hukum memiliki posisi setara. Teori tidak berubah menjadi fakta" ✓ Factual correction with explanation

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Correction ↔ Disagreement | Correction must provide alternative correct information; Disagreement only negates |
| Correction ↔ Suggestion | Suggestion requests new content; Correction targets existing error in video |

#### Current Distribution: 3,596 (2.63%)

#### Recommended Status: **RETAIN** — scientifically most important category for science communication research

---

### Label 9: PRAISE

#### Theoretical Basis
Face Theory (Brown & Levinson 1987): positive politeness strategies — comments that affirm and enhance the creator's positive face. Praise is the dominant "phatic" function in fan-creator interaction and is extensively documented in YouTube comment research.

#### Operational Definition
A comment that primarily expresses positive evaluation of the video, channel, creator, or production quality — directed toward the creator/channel rather than expressing a general view.

#### Inclusion Criteria
- Evaluations of video quality: "videonya bagus banget", "penjelasannya jelas"
- Creator appreciation: "terima kasih kak", "makasih KokBisa"
- Enthusiasm markers: "keren!", "mantap!", "top banget!"
- Gratitude for educational content
- Compliments on animation/presentation style

#### Exclusion Criteria
- Agreement with a factual claim (not praise for the creator) → **Agreement**
- Positive emotional reactions to the content itself (not to the creator) → **Opinion**
- Praise combined with a suggestion → **Suggestion** if suggestion is primary

#### Positive Examples (from corpus)
- "Iya, lucu dan seru animasinya. Makasih, kokbisa." ✓ Clear Praise
- "Wahh mantep pengetahuan kalian, aku jadi terbantu" ✓ Praise + Experience

#### Important Note: Praise ↔ Agreement Distinction
"Setuju banget sama penjelasannya!" = Agreement (with proposition)
"Penjelasannya keren banget!" = Praise (about creator/video)

#### Current Distribution: 12,850 (9.41%)

#### Recommended Status: **RETAIN** (but clarify distinction from Agreement)

---

### Label 10: OFF-TOPIC

#### Theoretical Basis
Topical relevance (Grice 1975, Maxim of Relation): comments that violate the relevance maxim with respect to the video's educational content. Off-topic content is prevalent in high-view Indonesian YouTube videos and reflects the social, rather than purely educational, function of comment sections.

#### Operational Definition
A comment where the content has no discernible connection to the video's educational topic, physics/science content, or the educational channel's broader context.

#### Inclusion Criteria
- Comments about unrelated news/events ("udah tau berita X belum?")
- Self-promotional comments ("cek channel gw juga dong")
- Completely personal/social comments triggered by nothing in the video
- Non-science jokes, memes, or social interactions
- Comments about the commenter's personal life completely unrelated to science

#### Exclusion Criteria
- Comments about other science topics → still **On-topic** (broadly science-adjacent)
- Comments about the video format/production → **Suggestion** or **Praise**
- Religious/philosophical reactions to scientific content → **Opinion** (triggered by video content)
- Short reaction comments ("😂", "hahaha") → needs further policy decision

#### Confusable Labels
| Confusion | Resolution |
|---|---|
| Off-topic ↔ Others | Off-topic has identifiable content unrelated to science; Others = cannot determine function |
| Off-topic ↔ Opinion | Off-topic comments are not reacting to the video content; Opinion is a reaction to the content |

#### IMPORTANT DIMENSION NOTE: Off-topic measures TOPICAL RELEVANCE, while other labels measure DISCOURSE FUNCTION. This dimensional mixing is the primary theoretical weakness of the current taxonomy. A comment can be a Correction that is Off-topic, or a Praise that is On-topic. The current taxonomy forces an either/or choice.

#### Recommended Status: **RETAIN AS SEPARATE DIMENSION** (ideally as a secondary label, not a primary discourse function label)

#### Current Distribution: 8,254 (6.04%)

---

### Label 11: OTHERS

#### Theoretical Basis
Residual category. In coding schemes, "Others" is necessary but should account for <5% of corpus. Current rate (3.30%) is acceptable.

#### Operational Definition
A comment that cannot be reliably classified into any of the above 10 categories, typically because: (a) the content is unintelligible, (b) the language is unrecognized, (c) the comment is too fragmentary, or (d) no dominant discourse function can be identified.

#### Inclusion Criteria
- Unintelligible strings ("Iiiiqi", "*z*")
- Single non-Indonesian characters
- Comments where the intended meaning is completely unclear
- Code-mixed comments where neither language meaning is clear

#### Exclusion Criteria
- Short but clear comments → use appropriate label ("Kasian" = Opinion)
- Emoji-only comments → **Praise** (positive emoji) or **Opinion** (reaction emoji) or **Others** (ambiguous)

#### Annotation Decision Rule
Use Others ONLY as a last resort after exhausting all other labels. If in doubt between two labels, use the primary discourse function. Only use Others if NO function is determinable.

#### Current Distribution: 4,504 (3.30%)

#### Recommended Status: **RETAIN** (as true residual; do not inflate)

---

## Part C: Taxonomy Structural Analysis

### C.1 Label Overlap Map

```
CRITICAL OVERLAPS (>50% likely confusable in practice):

Question ↔ Suggestion     (directive/interrogative boundary)
Opinion ↔ Disagreement    (evaluative stance vs. targeted refusal)
Disagreement ↔ Correction (negation alone vs. negation + correction)
Agreement ↔ Praise        (affirmation of proposition vs. affirmation of creator)
Off-topic ↔ Others        (irrelevant content vs. unclassifiable content)
Experience ↔ Opinion      (narrative vs. evaluative)

MODERATE OVERLAPS (25-50% confusable):
Answer ↔ Agreement        (affirmative information provision)
Suggestion ↔ Correction   (directive framing of factual error)
Praise ↔ Opinion          (positive evaluation direction)
```

### C.2 Dimensional Analysis

The current 11 labels span at least 4 different linguistic dimensions:

| Dimension | Labels |
|---|---|
| Discourse Function | Question, Answer, Suggestion, Correction |
| Stance/Epistemic | Agreement, Disagreement, Opinion |
| Content Type | Experience |
| Topical Relevance | Off-topic |
| Relational/Social | Praise |
| Residual | Others |

### C.3 Should this be single-label or multi-label?

**Recommendation: SINGLE PRIMARY LABEL with optional secondary label for Off-topic**

**Justification:**
- Multi-label requires more annotator training and produces more complex analysis
- The primary research question concerns "dominant discourse function"
- Off-topic is the only dimension that is truly orthogonal and should be tracked separately
- Multi-label annotation with 11 labels from inexperienced annotators will produce noisy data

**Proposed secondary label policy:**
```
Primary label: One of Q/A/Op/Exp/Agr/Dis/Sug/Cor/Pra/Oth
Secondary label (optional): "off-topic" flag
```

### C.4 Is the taxonomy theoretically coherent overall?

**PARTIALLY.** The taxonomy is operationally useful but theoretically mixed. It is acceptable for:
- Computational classification (11 labels are distinct enough for an NLI model)
- Descriptive corpus analysis (dominant function approach)
- Educational research (identifying engagement types)

It is NOT acceptable without revision for:
- Strong theoretical claims about "discourse functions" in a formal linguistics sense
- Multi-dimensional discourse analysis
- Claims about stance or topical engagement as separate constructs

---

## Part D: Alternative Taxonomy Structures

### Option A: Revised Flat Taxonomy (Recommended for this project)

Keep 11 labels but with sharper operational definitions (as in Part B above). Add secondary Off-topic flag. This is the path of least resistance and maintains continuity with existing data.

**Advantages:** Backward compatible, lower annotation burden, existing data can be partially reused after validation
**Disadvantages:** Still theoretically mixed; Off-topic as primary label remains problematic

### Option B: Hierarchical Taxonomy

```
Level 1 (Primary Function)
├── INFORMATION EXCHANGE
│   ├── Question       (requests information)
│   ├── Answer         (provides information in response)
│   └── Correction     (disputes and corrects information)
├── EVALUATION
│   ├── Praise         (positive evaluation of creator/video)
│   ├── Agreement      (alignment with a proposition)
│   └── Disagreement   (rejection of a proposition)
├── CONTRIBUTION
│   ├── Opinion        (personal view on topic)
│   ├── Experience     (personal narrative)
│   └── Suggestion     (request for action)
└── RESIDUAL
    └── Others         (unclassifiable)

Level 2 (Topical Relevance — secondary)
├── On-topic
└── Off-topic
```

**Advantages:** Theoretically principled; solves dimensional mixing; enables both fine-grained and coarse-grained analysis  
**Disadvantages:** Requires complete re-annotation; increases cognitive load; breaks existing predictions

### Option C: Reduced 7-Label Taxonomy

Merge problematic pairs:
- Agreement + Praise → **Positive Reaction**
- Disagreement + Correction → **Critical Response** (with sub-label)
- Off-topic → secondary flag only
- Keep: Question, Answer, Opinion, Experience, Suggestion, Positive Reaction, Critical Response, Others

**Advantages:** Reduces overlap; maintains key distinctions; simpler for annotators  
**Disadvantages:** Loses granularity; "Positive Reaction" may be too coarse for science communication analysis

---

## Part E: Annotation Policy Recommendations

### E.1 Annotation Decision Tree for Pilot

```
START
  │
  ▼
Is the comment unintelligible, fragmentary, or in an unknown language?
  YES → OTHERS
  NO ↓
  │
  ▼
Does the comment primarily REQUEST INFORMATION?
  YES → Does it request a video topic / action? → YES → SUGGESTION
                                                   NO → QUESTION
  NO ↓
  │
  ▼
Does the comment PROVIDE INFORMATION in response to a question?
  YES → Does it correct an error? → YES → CORRECTION
                                    NO → ANSWER
  NO ↓
  │
  ▼
Does the comment EXPRESS EVALUATION OF THE CREATOR/VIDEO QUALITY?
  YES → Is it positive? → YES → PRAISE
                          NO → DISAGREEMENT / OPINION
  NO ↓
  │
  ▼
Does the comment EXPLICITLY AGREE OR DISAGREE with a specific proposition?
  YES → Agreement → AGREEMENT
        Disagreement + provides correction → CORRECTION
        Disagreement only → DISAGREEMENT
  NO ↓
  │
  ▼
Does the comment narrate a PERSONAL EXPERIENCE?
  YES → EXPERIENCE
  NO ↓
  │
  ▼
Does the comment express a PERSONAL VIEW or REACTION to the content?
  YES → OPINION
  NO → OTHERS

AT END: 
Also mark as [OFF-TOPIC] if content is unrelated to the video's educational subject
```

### E.2 Handling Difficult Cases

| Case | Policy |
|---|---|
| Rhetorical question | Classify by dominant illocutionary force |
| Multiple questions in one comment | QUESTION (question dominates) |
| Emoji-only comment | PRAISE (positive), OPINION (reaction), OTHERS (ambiguous) |
| Very short comment (<5 words) | Apply decision tree; use OTHERS only if truly unclassifiable |
| Sarcasm | Annotate the surface form first; note sarcasm in "notes" field |
| Indonesian-English code-mixing | Classify normally; note code-mixing in "notes" field |
| Multiple discourse acts | Identify primary (dominant) function; note secondary in "notes" field |
| Replies to other users | Consider the quoted/referenced content in classification |

### E.3 Annotator Calibration

Before full annotation:
1. Run a 50-comment calibration session with all annotators
2. Discuss disagreements and refine definitions
3. Only begin formal annotation after calibration agreement ≥ 70%

---

## Part F: Empirical Answers to Taxonomy Audit Questions

### F.1 Is the 11-label taxonomy theoretically coherent?
**PARTIALLY.** It is operationally useful but theoretically mixed across 4 dimensions. Coherence can be achieved with sharper operational definitions and an Off-topic secondary flag rather than a primary label.

### F.2 Is it truly a discourse-function taxonomy?
**NOT ENTIRELY.** Labels like Off-topic (topical relevance), Praise (social/relational), and Opinion (stance) are not purely discourse functions in the Speech Act Theory sense. The taxonomy blends discourse function, stance, and relevance.

### F.3 Which labels overlap most?
Critical overlaps (in order of severity):
1. **Disagreement ↔ Correction** — very high confusion; sharp rule needed (correction requires providing correct version)
2. **Agreement ↔ Praise** — high confusion; rule: Praise targets creator, Agreement targets proposition
3. **Question ↔ Suggestion** — high confusion; rule: Suggestion requests action, Question requests information
4. **Off-topic ↔ Others** — medium confusion; rule: Off-topic has identifiable content, Others has none
5. **Opinion ↔ Experience** — medium confusion; rule: Experience has past-tense narrative structure

### F.4 Which labels should potentially be merged?
- **Off-topic** should become a secondary label, not a primary function
- **Others** should be kept as true residual (currently at acceptable 3.3%)
- **Agreement** and **Praise** could be merged into "Positive Reaction" if high confusion is found in pilot
- **Disagreement** and **Correction** could be merged into "Critical Response" if distinction proves unreliable

### F.5 Should the final task be single-label or multi-label?
**SINGLE LABEL** with optional binary OFF-TOPIC flag. This is scientifically defensible and practically manageable.

### F.6 What annotation policy should be used?
Primary function labeling using the decision tree in Part E. Annotators assign ONE primary label and optionally flag as off-topic.

### F.7 What sample size is recommended for the pilot?
**600–800 comments** stratified as follows:
- 100 per high-frequency class (Question, Suggestion, Praise): 300 total
- 50 per medium-frequency class (Off-topic, Disagreement, Others): 150 total
- 50 per low-frequency class (Correction, Opinion, Experience, Answer, Agreement): 150 total
- Plus 100–200 uncertainty-based samples (low mDeBERTa confidence margin)
- Total: 600–800

### F.8 What sample size is recommended for the final gold-standard dataset?
**10,000–12,000 comments** with the following minimum per class: 500 for majority classes, 300 for minority classes. Adjust upward if pilot shows high disagreement.

### F.9 What sampling strategy should be used?
1. **Stratified sampling** based on predicted label (to ensure all classes represented)
2. **Uncertainty sampling** based on mDeBERTa prediction margin (low margin = most informative)
3. **Video stratification** (ensure comments from all 35 videos are represented)
4. **Reply vs. top-level balance** (include both to capture different discourse contexts)
5. **Diversity sampling** (include code-mixed, emoji-heavy, very short, very long comments)

### F.10 What should be done in Google Colab?
- Model fine-tuning (mDeBERTa-v3 sequence classification)
- IndoBERT fine-tuning (Indonesian baseline)
- Model benchmarking and evaluation
- Large-scale inference (full 199,855 comment corpus) using the selected model
- Hyperparameter search

### F.11 Which model(s) should ultimately be fine-tuned?
1. **Primary:** `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` → fine-tuned sequence classifier (not NLI framing)
2. **Baseline:** `indolem/indobert-base-uncased` or `indobenchmark/indobert-base-p1` → IndoBERT fine-tuned
3. **Zero-shot reference:** Keep current mDeBERTa XNLI zero-shot as baseline for comparison
4. **Optional:** `intfloat/multilingual-e5-base` → only if semantic similarity improvement is needed

### F.12 What evaluation protocol should be used?
- Train/validation/test split: 70/15/15 at video level (not comment level) to prevent video-level leakage
- Primary metric: **Macro-F1** (due to class imbalance)
- Secondary metrics: Weighted-F1, per-class F1, confusion matrix
- Additional: Minority class recall (Agreement, Answer, Experience)
- Model selection gate: Fine-tuned macro-F1 must exceed zero-shot macro-F1 by ≥5 points

---

## Part G: Recommended Research Plan

### Phase 0 — Repository Audit
**Status: COMPLETE**  
**Deliverable:** `reports/methodological_audit.md`

---

### Phase 1 — Taxonomy Audit
**Status: COMPLETE (this document)**  
**Deliverable:** `docs/discourse_codebook_v1.md`  
**Go/No-Go:** Taxonomy is theoretically defensible with the definitions in Part B? → YES (proceed)

---

### Phase 2 — Pilot Human Annotation
**Objective:** Validate taxonomy, measure inter-rater reliability  
**Dataset:** 600–800 comments (stratified + uncertainty sampling)  
**Human Involvement:** Minimum 2 independent annotators  
**Model:** Current zero-shot mDeBERTa (predictions already available)  
**Environment:** Local — annotation tool (e.g., Label Studio, Prodigy, or CSV-based)  
**Evaluation:** Cohen's Kappa per class pair, raw agreement, confusion matrix  
**Deliverable:** `reports/annotation_pilot.csv`, `reports/annotation_reliability.md`  
**Go/No-Go:** Cohen's Kappa ≥ 0.60 (moderate agreement) on majority of label pairs

---

### Phase 3 — Taxonomy Freeze or Revision
**Objective:** Finalize taxonomy based on pilot results  
**Trigger:** Revise if any major label pair shows Kappa < 0.40  
**Deliverable:** `docs/discourse_codebook_v2.md` (if revised) or freeze v1  
**Go/No-Go:** Stable taxonomy with documented decision rules

---

### Phase 4 — Full Human Annotation
**Objective:** Create gold-standard training dataset  
**Dataset:** 10,000–12,000 comments (stratified sampling from full corpus)  
**Human Involvement:** Same 2+ annotators + adjudication for disagreements  
**Environment:** Local annotation tool  
**Evaluation:** Inter-annotator agreement tracked throughout  
**Deliverable:** `data/annotated/gold_standard.csv`  
**Go/No-Go:** All classes have minimum 300 examples; overall Kappa ≥ 0.65

---

### Phase 5 — Data Leakage Audit
**Objective:** Verify train/test split integrity  
**Tasks:** Near-duplicate detection, video-level split  
**Deliverable:** `reports/data_leakage_audit.md`  
**Go/No-Go:** Zero exact duplicates in train/test overlap; <1% near-duplicates

---

### Phase 6 — Model Benchmark (Google Colab)
**Objective:** Train and evaluate all models  
**Models:**
  - A: mDeBERTa zero-shot (baseline, already configured)
  - B: IndoBERT fine-tuned (Indonesian baseline)
  - C: mDeBERTa fine-tuned (primary candidate)
**Environment:** Google Colab GPU  
**Notebook:** `notebooks/08_discourse_model_training.ipynb`  
**Evaluation:** Macro-F1, Weighted-F1, per-class metrics, confusion matrices  
**Deliverable:** `reports/model_benchmark.md`, trained model artifacts in `models/discourse/`  
**Go/No-Go:** Best fine-tuned model macro-F1 > zero-shot macro-F1 + 5 points

---

### Phase 7 — Full Corpus Inference
**Objective:** Apply final model to all 199,855 clean comments  
**Condition:** Gate 5 (fine-tuned > zero-shot) must pass  
**Environment:** Local (batched, checkpointed) + Colab if needed  
**Outputs:**
  - `discourse_act_zero_shot` (existing, preserve)
  - `discourse_act_final` (new)
  - `discourse_confidence`
  - `discourse_model`
  - `model_version`  
**Deliverable:** Updated `comments_analyzed.parquet`, schema addition to `corpus.db`  
**Go/No-Go:** All 199,855 comments labeled; no silent overwrites of original labels

---

### Phase 8 — Statistical Analysis + Error Analysis
**Objective:** Answer research questions with validated data  
**Tasks:** Corpus-level discourse distribution, video-level comparison, discourse×alignment, discourse×engagement, qualitative error analysis  
**Deliverable:** `reports/discourse_error_analysis.md`, `reports/semantic_alignment_validation.md`, `reports/topic_model_validation.md`

---

### Phase 9 — Research Report
**Objective:** Produce all tables, figures, and paper sections  
**Deliverable:** Updated `paper/draft.md`, all figures in `figures/`

---

*This codebook is version 1.0 and requires validation through the pilot annotation process before being used as the authoritative annotation guide.*
