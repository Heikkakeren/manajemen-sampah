--
-- PostgreSQL database dump
--

\restrict PlTGHeBLmKJotXVvpTyoeokERZ2b4xM7JA9lEtoOqjMLsil9EvS5YjTNme97gJR

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: JenisTransaksi; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JenisTransaksi" AS ENUM (
    'DAPAT_POIN',
    'TUKAR_POIN'
);


ALTER TYPE public."JenisTransaksi" OWNER TO postgres;

--
-- Name: MetodePenarikan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MetodePenarikan" AS ENUM (
    'GOPAY',
    'DANA',
    'OVO',
    'SHOPEEPAY'
);


ALTER TYPE public."MetodePenarikan" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: StatusLaporan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusLaporan" AS ENUM (
    'MENUNGGU',
    'DIPROSES',
    'SELESAI'
);


ALTER TYPE public."StatusLaporan" OWNER TO postgres;

--
-- Name: StatusPenarikan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusPenarikan" AS ENUM (
    'PENDING',
    'BERHASIL',
    'GAGAL'
);


ALTER TYPE public."StatusPenarikan" OWNER TO postgres;

--
-- Name: TipeInstitusi; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipeInstitusi" AS ENUM (
    'SEKOLAH',
    'KANTOR',
    'FASILITAS_UMUM',
    'PERUMAHAN'
);


ALTER TYPE public."TipeInstitusi" OWNER TO postgres;

--
-- Name: TipeUser; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipeUser" AS ENUM (
    'RUMAH_TANGGA',
    'SEKOLAH',
    'KANTOR',
    'LAINNYA'
);


ALTER TYPE public."TipeUser" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FotoSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FotoSampah" (
    id text NOT NULL,
    "imageUrl" text NOT NULL,
    "laporanId" text NOT NULL
);


ALTER TABLE public."FotoSampah" OWNER TO postgres;

--
-- Name: Institusi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Institusi" (
    id text NOT NULL,
    nama text NOT NULL,
    tipe public."TipeInstitusi" NOT NULL,
    "wilayahId" text
);


ALTER TABLE public."Institusi" OWNER TO postgres;

--
-- Name: JadwalPenjemputan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JadwalPenjemputan" (
    id text NOT NULL,
    tanggal timestamp(3) without time zone NOT NULL,
    "wilayahId" text NOT NULL
);


ALTER TABLE public."JadwalPenjemputan" OWNER TO postgres;

--
-- Name: JenisSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JenisSampah" (
    id text NOT NULL,
    "namaJenis" text NOT NULL
);


ALTER TABLE public."JenisSampah" OWNER TO postgres;

--
-- Name: Kendaraan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kendaraan" (
    id text NOT NULL,
    "platNomor" text NOT NULL,
    kapasitas double precision NOT NULL,
    "petugasId" text
);


ALTER TABLE public."Kendaraan" OWNER TO postgres;

--
-- Name: LaporanSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LaporanSampah" (
    id text NOT NULL,
    berat double precision NOT NULL,
    "tanggalLapor" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "jenisSampahId" text NOT NULL,
    "wilayahId" text NOT NULL,
    "institusiId" text,
    keterangan text,
    status public."StatusLaporan" DEFAULT 'MENUNGGU'::public."StatusLaporan" NOT NULL
);


ALTER TABLE public."LaporanSampah" OWNER TO postgres;

--
-- Name: Penarikan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Penarikan" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "jumlahPoin" integer NOT NULL,
    nominal integer NOT NULL,
    metode public."MetodePenarikan" NOT NULL,
    "nomorTujuan" text NOT NULL,
    status public."StatusPenarikan" DEFAULT 'PENDING'::public."StatusPenarikan" NOT NULL,
    "nomorReferensi" text NOT NULL,
    tanggal timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tanggalVerif" timestamp(3) without time zone,
    "adminId" text
);


ALTER TABLE public."Penarikan" OWNER TO postgres;

--
-- Name: PetugasPenjemput; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PetugasPenjemput" (
    id text NOT NULL,
    nama text NOT NULL,
    "noHp" text NOT NULL
);


ALTER TABLE public."PetugasPenjemput" OWNER TO postgres;

--
-- Name: PoinReward; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PoinReward" (
    id text NOT NULL,
    jumlah integer DEFAULT 0 NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."PoinReward" OWNER TO postgres;

--
-- Name: Transaksi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaksi" (
    id text NOT NULL,
    "userId" text NOT NULL,
    jenis public."JenisTransaksi" NOT NULL,
    jumlah integer NOT NULL,
    keterangan text NOT NULL,
    tanggal timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transaksi" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "noHp" text NOT NULL,
    nik text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    tipe public."TipeUser" DEFAULT 'RUMAH_TANGGA'::public."TipeUser" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Wilayah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wilayah" (
    id text NOT NULL,
    "namaWilayah" text NOT NULL
);


ALTER TABLE public."Wilayah" OWNER TO postgres;

--
-- Data for Name: FotoSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FotoSampah" (id, "imageUrl", "laporanId") FROM stdin;
2c14a804-202b-4337-af22-d2b6fa09f4df	/uploads/sampah_1785078070491_4llk8xicxb8.png	34facf6a-48f9-49e9-91ce-71cd949a0bda
638a0a7a-3206-42bc-b138-ee5df2b05a4f	/uploads/sampah_1785078073914_purh09thrh.png	891ad2d0-0b24-43b6-b1a7-e3847c711e06
c7da09ff-66c8-4b19-82b4-fc4f0771b90f	/uploads/sampah_1787546696978_n77e0xqz1kq.jpg	7009bd86-a19c-40a0-8e19-0a5b22116946
\.


--
-- Data for Name: Institusi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Institusi" (id, nama, tipe, "wilayahId") FROM stdin;
c3c2c200-f24b-47cc-a8ad-753413e9eeca	SMAN 1 Jakarta	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
3a05d84c-b2c8-4299-a308-3b61430a97d8	SMAN 6 Jakarta	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
96102447-6840-4cc1-a764-bc866b342210	SMKN 1 Jakarta	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
419348fc-2cc1-4571-8f9c-11084402e103	SMKN 26 Jakarta	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
5dff7851-b864-4995-8dd5-7f2867c1659e	SMPN 1 Jakarta	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
8058373e-e8eb-4401-a260-37ecdc3dfdd5	SDN Menteng 01	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
efa22e32-8c2d-4ad7-9e34-73be484319f3	Universitas Indonesia	SEKOLAH	180ed832-dfac-4a4e-bd1b-81d1e573cda0
b9998b1e-6870-4628-9cc6-c7ed336384a4	Kantor Walikota Jakarta Pusat	KANTOR	180ed832-dfac-4a4e-bd1b-81d1e573cda0
47691c2b-db31-4eb2-a702-2d813bd3bc64	Kantor Gubernur DKI Jakarta	KANTOR	180ed832-dfac-4a4e-bd1b-81d1e573cda0
5bc7406d-a6d2-4187-a869-3019ce9ff4dd	RSUPN Dr. Cipto Mangunkusumo	FASILITAS_UMUM	180ed832-dfac-4a4e-bd1b-81d1e573cda0
e97fd4c5-ce8d-475d-9ccd-727a309efb95	Puskesmas Gambir	FASILITAS_UMUM	180ed832-dfac-4a4e-bd1b-81d1e573cda0
1bfc4542-34e8-4b79-881a-64e3067439a5	Stasiun Gambir	FASILITAS_UMUM	180ed832-dfac-4a4e-bd1b-81d1e573cda0
7c42c398-6bef-4b1b-beab-adcc2b92ca80	Perumahan Taman Sari Indah	PERUMAHAN	180ed832-dfac-4a4e-bd1b-81d1e573cda0
41606123-ae48-4bf9-b5b2-2dd426d4c60d	SMAN 3 Bandung	SEKOLAH	58018b99-28a1-4846-b7dd-7182494d76e3
80a6fe37-5461-4a09-abec-7f9c05c9b44b	SMAN 5 Bandung	SEKOLAH	58018b99-28a1-4846-b7dd-7182494d76e3
bf8f8692-86f0-4fb9-890c-f6adc8c4e660	SMKN 1 Bandung	SEKOLAH	58018b99-28a1-4846-b7dd-7182494d76e3
3c06e4e0-d583-4f7e-8ec4-44093404c217	SMKN 4 Bandung	SEKOLAH	58018b99-28a1-4846-b7dd-7182494d76e3
a52a3dd3-41f0-4993-835c-75839835e788	Institut Teknologi Bandung	SEKOLAH	58018b99-28a1-4846-b7dd-7182494d76e3
5700318d-37b1-440c-bd64-e17fbd449d1c	Universitas Padjadjaran	SEKOLAH	58018b99-28a1-4846-b7dd-7182494d76e3
002f9ced-dacd-4ca2-a936-582d8afc9cce	Kantor Gubernur Jawa Barat	KANTOR	58018b99-28a1-4846-b7dd-7182494d76e3
e7da0399-6084-46a9-8f70-7919123bf106	Kantor Walikota Bandung	KANTOR	58018b99-28a1-4846-b7dd-7182494d76e3
0fcbc0c2-6d9c-46e4-8e77-7e856bc0d547	RS Hasan Sadikin	FASILITAS_UMUM	58018b99-28a1-4846-b7dd-7182494d76e3
485668eb-1439-4903-a8b0-eaf7a226b09c	Pasar Baru Bandung	FASILITAS_UMUM	58018b99-28a1-4846-b7dd-7182494d76e3
b001f032-6331-4d6d-8806-ff420c5dde22	Perumahan Dago Pakar Raya	PERUMAHAN	58018b99-28a1-4846-b7dd-7182494d76e3
15d95fbb-6d12-48c7-8580-eae7bcab74bb	SMAN 5 Surabaya	SEKOLAH	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
7c4a2d46-aa78-4ef5-8188-a97b88f1514b	SMAN 15 Surabaya	SEKOLAH	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
633df20a-e3d8-42e6-a0ae-16079913c563	SMKN 1 Surabaya	SEKOLAH	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
a6cee90f-e2e3-4b71-aa66-a40e61395c84	Institut Teknologi Sepuluh Nopember	SEKOLAH	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
3f42b4ef-ccaf-4b16-ac34-a5f6e43ca686	Universitas Airlangga	SEKOLAH	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
3cd240b8-8279-4791-b21e-eaef943a401e	Kantor Walikota Surabaya	KANTOR	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
7c386e04-1f8a-450b-852e-531edeb55dc5	RSUD Dr. Soetomo	FASILITAS_UMUM	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
b314851d-2976-4e7c-af78-2f1e765d2c45	Tunjungan Plaza	FASILITAS_UMUM	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
3a674816-6051-4d1b-ad9d-72266b1b8f16	Perumahan Pakuwon City	PERUMAHAN	e4b81c99-8525-4c5c-a5bf-1352a3b077c0
\.


--
-- Data for Name: JadwalPenjemputan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPenjemputan" (id, tanggal, "wilayahId") FROM stdin;
\.


--
-- Data for Name: JenisSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JenisSampah" (id, "namaJenis") FROM stdin;
2492cef6-4dfe-46ab-92c8-1533643904e0	Organik
28b998a3-0e10-47d8-a79c-c1f35185fa4c	Anorganik
6df47e92-bbd1-4cfe-a2a2-a41067333cc2	B3
e698699b-1ea5-4509-b94f-006fd74b0978	Kertas
aba9dd8c-9177-442e-a585-9a80cd7b67a3	Plastik
1a9f079a-a663-42d8-92bb-0acec86a0913	Kaca
41cc7901-ce90-4d06-8c5b-59ffc6b0b941	Logam
e7c8aaad-7b0c-48e1-a9de-40c5be55169d	Elektronik
\.


--
-- Data for Name: Kendaraan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kendaraan" (id, "platNomor", kapasitas, "petugasId") FROM stdin;
\.


--
-- Data for Name: LaporanSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LaporanSampah" (id, berat, "tanggalLapor", "userId", "jenisSampahId", "wilayahId", "institusiId", keterangan, status) FROM stdin;
34facf6a-48f9-49e9-91ce-71cd949a0bda	3	2026-07-26 15:01:10.631	2f638d73-0baf-484b-b82e-c7ad133c53bf	28b998a3-0e10-47d8-a79c-c1f35185fa4c	180ed832-dfac-4a4e-bd1b-81d1e573cda0	47691c2b-db31-4eb2-a702-2d813bd3bc64	depan gerbang	MENUNGGU
891ad2d0-0b24-43b6-b1a7-e3847c711e06	3	2026-07-26 15:01:13.921	2f638d73-0baf-484b-b82e-c7ad133c53bf	28b998a3-0e10-47d8-a79c-c1f35185fa4c	180ed832-dfac-4a4e-bd1b-81d1e573cda0	47691c2b-db31-4eb2-a702-2d813bd3bc64	depan gerbang	SELESAI
7009bd86-a19c-40a0-8e19-0a5b22116946	80.8	2026-08-24 04:44:57.206	b2b2c662-de08-4a03-b615-08b0fed097f1	28b998a3-0e10-47d8-a79c-c1f35185fa4c	58018b99-28a1-4846-b7dd-7182494d76e3	a52a3dd3-41f0-4993-835c-75839835e788	SAMPAH UDA PENUH BANGET	MENUNGGU
\.


--
-- Data for Name: Penarikan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Penarikan" (id, "userId", "jumlahPoin", nominal, metode, "nomorTujuan", status, "nomorReferensi", tanggal, "tanggalVerif", "adminId") FROM stdin;
293c86d8-e593-41aa-ac11-4e5952c4bf78	b2b2c662-de08-4a03-b615-08b0fed097f1	250	25000	GOPAY	0999999999	PENDING	ECO-MUQTFARZ-51UY	2026-10-02 10:23:43.441	\N	\N
\.


--
-- Data for Name: PetugasPenjemput; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PetugasPenjemput" (id, nama, "noHp") FROM stdin;
\.


--
-- Data for Name: PoinReward; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PoinReward" (id, jumlah, "userId") FROM stdin;
123e4567-e89b-12d3-a456-426614174001	1800	b2b2c662-de08-4a03-b615-08b0fed097f1
\.


--
-- Data for Name: Transaksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaksi" (id, "userId", jenis, jumlah, keterangan, tanggal) FROM stdin;
ae6b56f3-6bcb-4ae5-bea1-f65239f46d1d	b2b2c662-de08-4a03-b615-08b0fed097f1	TUKAR_POIN	100	Tukar 100 Poin ke GoPay Rp 10.000	2026-09-07 06:18:59.744
c1a1a245-64a2-4fd1-baae-07ed04286732	b2b2c662-de08-4a03-b615-08b0fed097f1	TUKAR_POIN	250	Tukar 250 Poin ke DANA Rp 25.000	2026-10-02 10:09:53.009
fb1a56b1-5eaf-454f-85b2-43a307610f1d	b2b2c662-de08-4a03-b615-08b0fed097f1	TUKAR_POIN	100	Tukar 100 Poin ke GoPay Rp 10.000	2026-10-02 10:09:53.898
4213a60f-1e97-4c9b-a183-8026b6bfe62b	b2b2c662-de08-4a03-b615-08b0fed097f1	TUKAR_POIN	250	Penarikan ke GOPAY (0999999999) - Rp 25.000	2026-10-02 10:23:43.43
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nama, email, password, "noHp", nik, role, tipe) FROM stdin;
37976b1b-4bce-45a9-8ada-81f10f0a14a8	Administrator	admin@sampah.id	$2b$12$BWq2dC.JOXfgUXWma22WLeLKEhSG.xTZvuGv7ZhNYaYmq3pV6hZ1m	081234567890	3201010101010001	ADMIN	KANTOR
2f638d73-0baf-484b-b82e-c7ad133c53bf	Magfi Adi radza putra	radzaadi@gmail.com	$2b$12$An94YKH30KY42qVanoZfjumgoaWDVT.BZqZsL1k6V8YvqHSdcVFYS	111111111111	1111111111111111	USER	SEKOLAH
b2b2c662-de08-4a03-b615-08b0fed097f1	Pengguna Biasa	user@sampah.id	$2b$12$aKZVoSFTNjrePjVkUY2SEO7Z9xqU4Hps3.wPY54zxp6gGYvCkwUay	081299998888	3201020304050006	USER	RUMAH_TANGGA
\.


--
-- Data for Name: Wilayah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wilayah" (id, "namaWilayah") FROM stdin;
180ed832-dfac-4a4e-bd1b-81d1e573cda0	Jakarta
58018b99-28a1-4846-b7dd-7182494d76e3	Bandung
e4b81c99-8525-4c5c-a5bf-1352a3b077c0	Surabaya
\.


--
-- Name: FotoSampah FotoSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_pkey" PRIMARY KEY (id);


--
-- Name: Institusi Institusi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Institusi"
    ADD CONSTRAINT "Institusi_pkey" PRIMARY KEY (id);


--
-- Name: JadwalPenjemputan JadwalPenjemputan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPenjemputan"
    ADD CONSTRAINT "JadwalPenjemputan_pkey" PRIMARY KEY (id);


--
-- Name: JenisSampah JenisSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisSampah"
    ADD CONSTRAINT "JenisSampah_pkey" PRIMARY KEY (id);


--
-- Name: Kendaraan Kendaraan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kendaraan"
    ADD CONSTRAINT "Kendaraan_pkey" PRIMARY KEY (id);


--
-- Name: LaporanSampah LaporanSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY (id);


--
-- Name: Penarikan Penarikan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Penarikan"
    ADD CONSTRAINT "Penarikan_pkey" PRIMARY KEY (id);


--
-- Name: PetugasPenjemput PetugasPenjemput_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PetugasPenjemput"
    ADD CONSTRAINT "PetugasPenjemput_pkey" PRIMARY KEY (id);


--
-- Name: PoinReward PoinReward_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PoinReward"
    ADD CONSTRAINT "PoinReward_pkey" PRIMARY KEY (id);


--
-- Name: Transaksi Transaksi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaksi"
    ADD CONSTRAINT "Transaksi_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wilayah Wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilayah"
    ADD CONSTRAINT "Wilayah_pkey" PRIMARY KEY (id);


--
-- Name: FotoSampah_laporanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON public."FotoSampah" USING btree ("laporanId");


--
-- Name: Institusi_nama_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Institusi_nama_key" ON public."Institusi" USING btree (nama);


--
-- Name: JenisSampah_namaJenis_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON public."JenisSampah" USING btree ("namaJenis");


--
-- Name: Kendaraan_petugasId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kendaraan_petugasId_key" ON public."Kendaraan" USING btree ("petugasId");


--
-- Name: Kendaraan_platNomor_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kendaraan_platNomor_key" ON public."Kendaraan" USING btree ("platNomor");


--
-- Name: LaporanSampah_userId_jenisSampahId_tanggalLapor_wilayahId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LaporanSampah_userId_jenisSampahId_tanggalLapor_wilayahId_key" ON public."LaporanSampah" USING btree ("userId", "jenisSampahId", "tanggalLapor", "wilayahId");


--
-- Name: Penarikan_nomorReferensi_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Penarikan_nomorReferensi_key" ON public."Penarikan" USING btree ("nomorReferensi");


--
-- Name: PetugasPenjemput_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PetugasPenjemput_noHp_key" ON public."PetugasPenjemput" USING btree ("noHp");


--
-- Name: PoinReward_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PoinReward_userId_key" ON public."PoinReward" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_nik_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_nik_key" ON public."User" USING btree (nik);


--
-- Name: User_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_noHp_key" ON public."User" USING btree ("noHp");


--
-- Name: Wilayah_namaWilayah_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON public."Wilayah" USING btree ("namaWilayah");


--
-- Name: FotoSampah FotoSampah_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."LaporanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Institusi Institusi_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Institusi"
    ADD CONSTRAINT "Institusi_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: JadwalPenjemputan JadwalPenjemputan_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPenjemputan"
    ADD CONSTRAINT "JadwalPenjemputan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Kendaraan Kendaraan_petugasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kendaraan"
    ADD CONSTRAINT "Kendaraan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES public."PetugasPenjemput"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LaporanSampah LaporanSampah_institusiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_institusiId_fkey" FOREIGN KEY ("institusiId") REFERENCES public."Institusi"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LaporanSampah LaporanSampah_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LaporanSampah LaporanSampah_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LaporanSampah LaporanSampah_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Penarikan Penarikan_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Penarikan"
    ADD CONSTRAINT "Penarikan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Penarikan Penarikan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Penarikan"
    ADD CONSTRAINT "Penarikan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PoinReward PoinReward_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PoinReward"
    ADD CONSTRAINT "PoinReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaksi Transaksi_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaksi"
    ADD CONSTRAINT "Transaksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict PlTGHeBLmKJotXVvpTyoeokERZ2b4xM7JA9lEtoOqjMLsil9EvS5YjTNme97gJR

