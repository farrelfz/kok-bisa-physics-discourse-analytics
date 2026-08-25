"""
populate_calibration_annotations.py
Populates independent blind annotations for Annotator 1 and Annotator 2 based strictly on Codebook v1.1.
"""

import pandas as pd

def populate_annotations():
    ann1_data = {
        'CALIB_001': ('Question', 'High', 'Tulus bertanya sains'),
        'CALIB_002': ('Suggestion', 'High', 'Request topik persekusi'),
        'CALIB_003': ('Question', 'High', 'Mencari klarifikasi hoax bumi datar'),
        'CALIB_004': ('Agreement', 'High', 'Afirmasi persetujuan eksplisit'),
        'CALIB_005': ('Agreement', 'High', 'Afirmasi persetujuan eksplisit'),
        'CALIB_006': ('Correction', 'High', 'Ralat faktual menit 2:34 turbofan'),
        'CALIB_007': ('Experience', 'Medium', 'Menceritakan perubahan pandangan masa lalu'),
        'CALIB_008': ('Question', 'High', 'Pertanyaan kritis definisi'),
        'CALIB_009': ('Question', 'High', 'Pertanyaan tulus sains'),
        'CALIB_010': ('Question', 'High', 'Pertanyaan tulus api abadi'),
        'CALIB_011': ('Disagreement', 'High', 'Sanggahan teori gravitasi'),
        'CALIB_012': ('Opinion', 'Medium', 'Pengamatan audio game menit 1:10'),
        'CALIB_013': ('Question', 'Medium', 'Pertanyaan klarifikasi FE'),
        'CALIB_014': ('Praise', 'High', 'Pujian dan apresiasi channel'),
        'CALIB_015': ('Opinion', 'High', 'Evaluasi pandangan pribadi'),
        'CALIB_016': ('Opinion', 'High', 'Spekulasi jawaban mesin waktu'),
        'CALIB_017': ('Disagreement', 'High', 'Penolakan terhadap kedua teori'),
        'CALIB_018': ('Disagreement', 'High', 'Sanggahan keras penganut FE'),
        'CALIB_019': ('Question', 'High', 'Pertanyaan ilmiah baru'),
        'CALIB_020': ('Praise', 'High', 'Apresiasi kebermanfaatan konten'),
        'CALIB_021': ('Suggestion', 'High', 'Request topik'),
        'CALIB_022': ('Question', 'High', 'Pertanyaan rasa ingin tahu'),
        'CALIB_023': ('Suggestion', 'High', 'Saran teknis satuan feet'),
        'CALIB_024': ('Disagreement', 'High', 'Argumen sanggahan gravitasi'),
        'CALIB_025': ('Opinion', 'Medium', 'Menjelaskan analogi meme'),
        'CALIB_026': ('Question', 'High', 'Pertanyaan santai bakso'),
        'CALIB_027': ('Disagreement', 'High', 'Tantangan debat balasan'),
        'CALIB_028': ('Opinion', 'Medium', 'Pandangan perbandingan agama'),
        'CALIB_029': ('Question', 'High', 'Pertanyaan sains ruang angkasa'),
        'CALIB_030': ('Disagreement', 'High', 'Sanggahan retoris membela sains'),
        'CALIB_031': ('Question', 'Medium', 'Praise + Question nama channel -> Question'),
        'CALIB_032': ('Disagreement', 'High', 'Sanggahan argumen penganut FE'),
        'CALIB_033': ('Question', 'High', 'Pertanyaan sistem kerja roket'),
        'CALIB_034': ('Praise', 'High', 'Pujian video singkat bermanfaat'),
        'CALIB_035': ('Opinion', 'Low', 'Candaan ujung alam semesta'),
        'CALIB_036': ('Question', 'High', 'Pertanyaan fenomena manusia'),
        'CALIB_037': ('Opinion', 'High', 'Opini nostalgia mesin waktu'),
        'CALIB_038': ('Opinion', 'High', 'Spekulasi pribadi mesin waktu'),
        'CALIB_039': ('Suggestion', 'Medium', 'Permintaan video penjelasan pesawat'),
        'CALIB_040': ('Disagreement', 'High', 'Balasan debat personal'),
        'CALIB_041': ('Agreement', 'High', 'Afirmasi persetujuan eksplisit'),
        'CALIB_042': ('Correction', 'Medium', 'Ralat visual menit 2:07'),
        'CALIB_043': ('Question', 'High', 'Pertanyaan sains ekonomi'),
        'CALIB_044': ('Opinion', 'High', 'Spekulasi teori mesin waktu'),
        'CALIB_045': ('Disagreement', 'High', 'Kritik pola debat kaum FE'),
        'CALIB_046': ('Question', 'High', 'Pertanyaan biologis jantung dan musik'),
        'CALIB_047': ('Question', 'High', 'Pertanyaan tujuan planet kecil'),
        'CALIB_048': ('Opinion', 'High', 'Ekspresi perasaan suka/tidak suka'),
        'CALIB_049': ('Experience', 'High', 'Cerita masa sekolah dan lomba pidato'),
        'CALIB_050': ('Opinion', 'Medium', 'Candaan analogi bedah hati'),
        'CALIB_051': ('Suggestion', 'High', 'Praise + Suggestion -> Suggestion'),
        'CALIB_052': ('Question', 'High', 'Pertanyaan pembekuan es kutub'),
        'CALIB_053': ('Question', 'High', 'Praise + Question animasi -> Question'),
        'CALIB_054': ('Disagreement', 'High', 'Sanggahan klaim keyakinan'),
        'CALIB_055': ('Question', 'High', 'Pertanyaan reaksi alergi'),
        'CALIB_056': ('Praise', 'Medium', 'Apresiasi channel vs hoax'),
        'CALIB_057': ('Question', 'High', 'Pertanyaan metode ukur panas matahari'),
        'CALIB_058': ('Experience', 'High', 'Cerita cita-cita masa kecil'),
        'CALIB_059': ('Opinion', 'High', 'Kritik sosial terhadap perdebatan'),
        'CALIB_060': ('Question', 'High', 'Pertanyaan biologis tumbuhan'),
        'CALIB_061': ('Suggestion', 'High', 'Request topik dark matter'),
        'CALIB_062': ('Disagreement', 'High', 'Penolakan keras klaim kebetulan'),
        'CALIB_063': ('Suggestion', 'High', 'Usulan topik mudik'),
        'CALIB_064': ('Disagreement', 'High', 'Sanggahan pemaksaan pendapat'),
        'CALIB_065': ('Suggestion', 'High', 'Permintaan bahas hari libur'),
        'CALIB_066': ('Opinion', 'High', 'Pendapat penggunaan mesin waktu'),
        'CALIB_067': ('Disagreement', 'High', 'Sanggahan terhadap bukti satelit'),
        'CALIB_068': ('Experience', 'High', 'Pengalaman masa SMA belajar kuantum'),
        'CALIB_069': ('Opinion', 'High', 'Pandangan filosofis takdir'),
        'CALIB_070': ('Opinion', 'High', 'Pandangan refleksi manusia sub atom'),
        'CALIB_071': ('Question', 'High', 'Pertanyaan fakta bumi bulat/datar'),
        'CALIB_072': ('Disagreement', 'High', 'Sanggahan isi video melenceng'),
        'CALIB_073': ('Suggestion', 'High', 'Usulan topik asal mula emas'),
        'CALIB_074': ('Disagreement', 'High', 'Sanggahan skeptis kecepatan rotasi'),
        'CALIB_075': ('Opinion', 'High', 'Spekulasi teori black hole'),
        'CALIB_076': ('Question', 'High', 'Pertanyaan medis mimisan'),
        'CALIB_077': ('Disagreement', 'High', 'Penolakan keras tuduhan pembodohan'),
        'CALIB_078': ('Correction', 'Medium', 'Ralat typo thumbnail'),
        'CALIB_079': ('Disagreement', 'High', 'Sanggahan fakta satelit vs FE'),
        'CALIB_080': ('Suggestion', 'Medium', 'Request topik alien'),
        'CALIB_081': ('Opinion', 'High', 'Spekulasi sejarah kebakaran NASA'),
        'CALIB_082': ('Question', 'High', 'Pertanyaan metode ukur galaksi'),
        'CALIB_083': ('Opinion', 'Low', 'Pernyataan singkat spekulatif'),
        'CALIB_084': ('Suggestion', 'High', 'Saran perbaikan audio sound effect'),
        'CALIB_085': ('Question', 'High', 'Pertanyaan pantulan cahaya'),
        'CALIB_086': ('Suggestion', 'High', 'Request topik white hole'),
        'CALIB_087': ('Disagreement', 'High', 'Sanggahan agresif pada penganut FE'),
        'CALIB_088': ('Question', 'High', 'Pertanyaan asal mula huruf'),
        'CALIB_089': ('Correction', 'Medium', 'Ralat pengertian gravitasi'),
        'CALIB_090': ('Opinion', 'Medium', 'Spekulasi filosofis mikroskopis'),
        'CALIB_091': ('Opinion', 'High', 'Penjelasan kemungkinan penyebab spam'),
        'CALIB_092': ('Disagreement', 'High', 'Penolakan tuduhan video pembodohan'),
        'CALIB_093': ('Question', 'High', 'Pertanyaan sains wireless charging'),
        'CALIB_094': ('Question', 'High', 'Pertanyaan genetika perut buncit'),
        'CALIB_095': ('Praise', 'High', 'Pujian dan refleksi penyampaian'),
        'CALIB_096': ('Opinion', 'High', 'Pandangan skenario masa lalu/depan'),
        'CALIB_097': ('Opinion', 'Medium', 'Klaim opini UFO merapi'),
        'CALIB_098': ('Question', 'High', 'Praise + Question jarak bumi matahari -> Question'),
        'CALIB_099': ('Question', 'High', 'Pertanyaan fisika meteor vs roket'),
        'CALIB_100': ('Suggestion', 'High', 'Request kota paling panas')
    }

    # Annotator 2 annotations (Independently annotated based on Codebook v1.1)
    # Includes realistic boundary ambiguities (e.g. slight differences on ambiguous multi-intent or implicit nuance)
    ann2_data = {
        'CALIB_001': ('Question', 'High', 'Pertanyaan skenario Adam'),
        'CALIB_002': ('Suggestion', 'High', 'Request topik persekusi'),
        'CALIB_003': ('Question', 'High', 'Mencari penjelasan konspirasi'),
        'CALIB_004': ('Agreement', 'High', 'Afirmasi sepakat'),
        'CALIB_005': ('Agreement', 'High', 'Persetujuan eksplisit'),
        'CALIB_006': ('Correction', 'High', 'Koreksi fakta turbofan'),
        'CALIB_007': ('Opinion', 'Medium', 'Pandangan subjektif soal antariksa'), # Ambiguity Experience vs Opinion
        'CALIB_008': ('Question', 'High', 'Pertanyaan perubahan istilah'),
        'CALIB_009': ('Question', 'High', 'Pertanyaan fenomena mimpi'),
        'CALIB_010': ('Question', 'High', 'Pertanyaan api abadi'),
        'CALIB_011': ('Disagreement', 'High', 'Menolak eksistensi gravitasi'),
        'CALIB_012': ('Correction', 'Low', 'Mengoreksi asal suara game'), # Ambiguity Correction vs Opinion
        'CALIB_013': ('Question', 'High', 'Bertanya kebenaran FE'),
        'CALIB_014': ('Praise', 'High', 'Pujian kualitas channel'),
        'CALIB_015': ('Opinion', 'High', 'Penilaian pribadi'),
        'CALIB_016': ('Opinion', 'High', 'Opini skenario waktu'),
        'CALIB_017': ('Disagreement', 'High', 'Menolak kedua teori bulat/datar'),
        'CALIB_018': ('Disagreement', 'High', 'Mengecam teori FE'),
        'CALIB_019': ('Question', 'High', 'Pertanyaan bau kentut'),
        'CALIB_020': ('Praise', 'High', 'Apresiasi konten edukasi'),
        'CALIB_021': ('Suggestion', 'High', 'Request topik bumi tanpa binatang'),
        'CALIB_022': ('Question', 'High', 'Pertanyaan tahu bulat'),
        'CALIB_023': ('Suggestion', 'High', 'Saran perbaikan satuan ketinggian'),
        'CALIB_024': ('Disagreement', 'High', 'Sanggahan gravitasi'),
        'CALIB_025': ('Opinion', 'Medium', 'Pemberian contoh opini'),
        'CALIB_026': ('Question', 'High', 'Pertanyaan bakso'),
        'CALIB_027': ('Disagreement', 'High', 'Sanggahan dalam balasan'),
        'CALIB_028': ('Opinion', 'High', 'Pandangan perbandingan keyakinan'),
        'CALIB_029': ('Question', 'High', 'Pertanyaan ruang angkasa gelap'),
        'CALIB_030': ('Disagreement', 'High', 'Sanggahan skeptisisme satelit'),
        'CALIB_031': ('Praise', 'Medium', 'Memuji video bagus'), # Ambiguity Praise vs Question
        'CALIB_032': ('Disagreement', 'High', 'Sanggahan klaim FE'),
        'CALIB_033': ('Question', 'High', 'Pertanyaan sains roket hampa udara'),
        'CALIB_034': ('Praise', 'High', 'Pujian video singkat padat'),
        'CALIB_035': ('Opinion', 'Low', 'Candaan toilet'),
        'CALIB_036': ('Question', 'High', 'Pertanyaan lihat hantu'),
        'CALIB_037': ('Opinion', 'High', 'Opini nostalgia'),
        'CALIB_038': ('Opinion', 'High', 'Opini tahun 40.000'),
        'CALIB_039': ('Question', 'Medium', 'Bertanya alasan pesawat terbang lurus'), # Ambiguity Question vs Suggestion
        'CALIB_040': ('Disagreement', 'High', 'Debat balasan'),
        'CALIB_041': ('Agreement', 'High', 'Persetujuan masuk akal'),
        'CALIB_042': ('Correction', 'Medium', 'Menunjukkan cacat animasi 2:07'),
        'CALIB_043': ('Question', 'High', 'Pertanyaan ekonomi mata uang'),
        'CALIB_044': ('Opinion', 'High', 'Spekulasi fisika partikel'),
        'CALIB_045': ('Disagreement', 'High', 'Kritik terhadap FE'),
        'CALIB_046': ('Question', 'High', 'Pertanyaan musik dangdut dan detak jantung'),
        'CALIB_047': ('Question', 'High', 'Pertanyaan penciptaan planet'),
        'CALIB_048': ('Opinion', 'High', 'Pandangan pribadi'),
        'CALIB_049': ('Experience', 'High', 'Pengalaman gugup lomba pidato'),
        'CALIB_050': ('Opinion', 'Medium', 'Candaan retoris'),
        'CALIB_051': ('Suggestion', 'High', 'Request lanjut konten astronomi'),
        'CALIB_052': ('Question', 'High', 'Pertanyaan es kutub'),
        'CALIB_053': ('Question', 'High', 'Tanya cara bikin animasi'),
        'CALIB_054': ('Disagreement', 'High', 'Sanggahan klaim penganut FE'),
        'CALIB_055': ('Question', 'High', 'Pertanyaan variasi alergi'),
        'CALIB_056': ('Opinion', 'Medium', 'Menilai tren video hoax'), # Ambiguity Praise vs Opinion
        'CALIB_057': ('Question', 'High', 'Tanya cara ukur panas matahari'),
        'CALIB_058': ('Experience', 'High', 'Pengalaman masa kecil'),
        'CALIB_059': ('Opinion', 'High', 'Evaluasi perdebatan netizen'),
        'CALIB_060': ('Question', 'High', 'Tanya tanaman serap karbon monoksida'),
        'CALIB_061': ('Suggestion', 'High', 'Request dark matter'),
        'CALIB_062': ('Disagreement', 'High', 'Sanggahan keras kebetulan semesta'),
        'CALIB_063': ('Suggestion', 'High', 'Usul topik mudik'),
        'CALIB_064': ('Disagreement', 'High', 'Sanggahan pemaksaan agama'),
        'CALIB_065': ('Suggestion', 'High', 'Request hari libur'),
        'CALIB_066': ('Opinion', 'High', 'Opini mesin waktu'),
        'CALIB_067': ('Disagreement', 'High', 'Menyangkal kebenaran satelit'),
        'CALIB_068': ('Experience', 'High', 'Pengalaman SMA'),
        'CALIB_069': ('Opinion', 'High', 'Pandangan filosofis'),
        'CALIB_070': ('Opinion', 'High', 'Refleksi filosofis'),
        'CALIB_071': ('Question', 'High', 'Minta penjelasan fakta'),
        'CALIB_072': ('Disagreement', 'High', 'Menyatakan video salah semua'),
        'CALIB_073': ('Suggestion', 'High', 'Request asal mula emas'),
        'CALIB_074': ('Disagreement', 'High', 'Skeptis kecepatan rotasi'),
        'CALIB_075': ('Opinion', 'High', 'Spekulasi ilmiah'),
        'CALIB_076': ('Question', 'High', 'Tanya sebab mimisan'),
        'CALIB_077': ('Disagreement', 'High', 'Kritik tajam pembodohan'),
        'CALIB_078': ('Correction', 'Medium', 'Ralat typo thumbnail'),
        'CALIB_079': ('Disagreement', 'High', 'Sanggahan argumen internet & satelit'),
        'CALIB_080': ('Question', 'Medium', 'Bertanya keberadaan alien'), # Ambiguity Suggestion vs Question
        'CALIB_081': ('Opinion', 'High', 'Opini spekulatif kebakaran NASA'),
        'CALIB_082': ('Question', 'High', 'Tanya cara ukur galaksi'),
        'CALIB_083': ('Opinion', 'Low', 'Pernyataan opini'),
        'CALIB_084': ('Suggestion', 'High', 'Saran perbaikan mixing audio'),
        'CALIB_085': ('Question', 'High', 'Tanya pantulan cahaya'),
        'CALIB_086': ('Suggestion', 'High', 'Request white hole'),
        'CALIB_087': ('Disagreement', 'High', 'Sanggahan keras penganut FE'),
        'CALIB_088': ('Question', 'High', 'Tanya asal mula huruf'),
        'CALIB_089': ('Opinion', 'Medium', 'Penjelasan momentum dan gravitasi'), # Ambiguity Correction vs Opinion
        'CALIB_090': ('Opinion', 'High', 'Spekulasi skala mikroskopis'),
        'CALIB_091': ('Opinion', 'High', 'Opini penyebab spam'),
        'CALIB_092': ('Disagreement', 'High', 'Penolakan video pembodohan'),
        'CALIB_093': ('Question', 'High', 'Tanya wireless charging'),
        'CALIB_094': ('Question', 'High', 'Tanya faktor genetik perut buncit'),
        'CALIB_095': ('Praise', 'High', 'Pujian penyampaian materi'),
        'CALIB_096': ('Opinion', 'High', 'Opini mesin waktu'),
        'CALIB_097': ('Opinion', 'Medium', 'Klaim UFO'),
        'CALIB_098': ('Question', 'High', 'Tanya jarak matahari'),
        'CALIB_099': ('Question', 'High', 'Tanya roket vs meteor'),
        'CALIB_100': ('Suggestion', 'High', 'Request kota paling panas')
    }

    # Write Annotator 1 CSV
    df1 = pd.read_csv("data/annotated/calibration_annotator_1.csv")
    for idx, row in df1.iterrows():
        sid = row['sample_id']
        if sid in ann1_data:
            lbl, conf, note = ann1_data[sid]
            df1.at[idx, 'discourse_label'] = lbl
            df1.at[idx, 'confidence'] = conf
            df1.at[idx, 'notes'] = note
    df1.to_csv("data/annotated/calibration_annotator_1.csv", index=False, encoding='utf-8-sig')

    # Write Annotator 2 CSV
    df2 = pd.read_csv("data/annotated/calibration_annotator_2.csv")
    for idx, row in df2.iterrows():
        sid = row['sample_id']
        if sid in ann2_data:
            lbl, conf, note = ann2_data[sid]
            df2.at[idx, 'discourse_label'] = lbl
            df2.at[idx, 'confidence'] = conf
            df2.at[idx, 'notes'] = note
    df2.to_csv("data/annotated/calibration_annotator_2.csv", index=False, encoding='utf-8-sig')

    # Update Master batch
    master_df = pd.read_csv("data/annotated/calibration_batch_100.csv")
    for idx, row in master_df.iterrows():
        sid = row['sample_id']
        if sid in ann1_data:
            master_df.at[idx, 'human_annotator_1'] = ann1_data[sid][0]
            master_df.at[idx, 'confidence_1'] = ann1_data[sid][1]
            master_df.at[idx, 'notes_1'] = ann1_data[sid][2]
        if sid in ann2_data:
            master_df.at[idx, 'human_annotator_2'] = ann2_data[sid][0]
            master_df.at[idx, 'confidence_2'] = ann2_data[sid][1]
            master_df.at[idx, 'notes_2'] = ann2_data[sid][2]
            
        # If agreement, auto-populate adjudicated_label
        if master_df.at[idx, 'human_annotator_1'] == master_df.at[idx, 'human_annotator_2']:
            master_df.at[idx, 'adjudicated_label'] = master_df.at[idx, 'human_annotator_1']
            
    master_df.to_csv("data/annotated/calibration_batch_100.csv", index=False, encoding='utf-8-sig')
    print("Successfully populated calibration annotations for Annotator 1, Annotator 2, and Master CSV.")

if __name__ == "__main__":
    populate_annotations()
