--
-- PostgreSQL database dump
--

\restrict effpBN8zscYmnf9iJ0EBJHKV3EwtEytkdNNLWn8oyWqHO7cziLgiad0F2iQJq2j

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: adoptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adoptions (
    id text NOT NULL,
    user_id text NOT NULL,
    tree_id text NOT NULL,
    order_id text NOT NULL,
    name_on_tag text NOT NULL,
    certificate_url text,
    adopted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    species_id text NOT NULL,
    expires_at timestamp(3) without time zone
);


ALTER TABLE public.adoptions OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    order_id text NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL,
    name_on_tag text NOT NULL,
    species_id text NOT NULL,
    duration_years integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    user_id text NOT NULL,
    order_number text NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    payment_status text DEFAULT 'PENDING'::text NOT NULL,
    payment_method text,
    snap_token text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    expired_at timestamp(3) without time zone
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: tree_species; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tree_species (
    id text NOT NULL,
    name text NOT NULL,
    latin_name text NOT NULL,
    "storyContent" text NOT NULL,
    main_image_url text NOT NULL,
    base_price numeric(10,2) NOT NULL,
    carbon_absorption_rate double precision NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    available_stock integer DEFAULT 0 NOT NULL,
    category text DEFAULT 'umum'::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    reserved_stock integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tree_species OWNER TO postgres;

--
-- Name: tree_updates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tree_updates (
    id text NOT NULL,
    tree_id text NOT NULL,
    photo_url text NOT NULL,
    height_cm double precision NOT NULL,
    diameter_cm double precision NOT NULL,
    co2_absorbed_total double precision NOT NULL,
    admin_notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tree_updates OWNER TO postgres;

--
-- Name: trees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trees (
    id text NOT NULL,
    species_id text NOT NULL,
    serial_number text NOT NULL,
    latitude numeric(9,6),
    longitude numeric(9,6),
    status text DEFAULT 'SOLD'::text NOT NULL,
    planted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.trees OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    password_hash text,
    phone text,
    role text DEFAULT 'USER'::text NOT NULL,
    is_verified_email boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    auth_provider text DEFAULT 'LOCAL'::text,
    avatar_url text,
    google_id text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a26846bd-3b53-4dbe-8b42-e1f0795e8857	2b88e16c0b493641702d86bda07ea7ce3c1cc62f39ea6ae89cfd4d1e94c698c5	2026-02-05 20:20:33.601878+00	20260103155324_init	\N	\N	2026-02-05 20:20:33.531681+00	1
bbfc4b16-8756-40e7-b937-1dcd64dba4e2	8c0e861ae77940740eecc5aaab007a87d411334d5ba52df39123dec6b313bbea	2026-02-05 20:20:33.950801+00	20260205202033_init	\N	\N	2026-02-05 20:20:33.868779+00	1
cbdf4cba-caf3-4830-afc1-199cf39849ea	bd7a2bd010f12a6cfcec591de7da0848f4a2eaa035233aea787c6484e8a6411d	2026-02-11 03:10:28.116914+00	20260211031028_add_description_stock_category	\N	\N	2026-02-11 03:10:28.105699+00	1
3d8aa307-dbdb-47f3-ad23-822de7311c13	356bc3b37ae063814cdc7bb721a809064c08f0d33e04230857a13791fccea13b	2026-02-15 12:03:32.414466+00	20260215120332_add_google_oauth	\N	\N	2026-02-15 12:03:32.395969+00	1
d79307ca-af44-4c8e-ac46-7d5d1e284e0e	e9d8019e45c8f09be5fe1388e00cf469d689840be8f5093f4e77f453489541bd	2026-02-17 18:21:20.933153+00	20260217182120_add_tree_update_relation	\N	\N	2026-02-17 18:21:20.86891+00	1
124db948-6863-4abc-b400-754883b614d3	42b1ad5850b950db1d963a9ec978896b22df98a477e95c96ecb66dd20b800434	2026-03-19 20:30:38.812432+00	20260315070143_add_duration_years_to_order_items	\N	\N	2026-03-19 20:30:38.806077+00	1
\.


--
-- Data for Name: adoptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adoptions (id, user_id, tree_id, order_id, name_on_tag, certificate_url, adopted_at, created_at, updated_at, species_id, expires_at) FROM stdin;
cmmxz25tr0005rci6ktbbdwp9	cmmxau593000mt2i6hmmnqlom	cmmxz25to0004rci6d2y997rm	cmmxz1uf70002rci6povtdib2	testing 2	\N	2026-03-19 21:18:12.735	2026-03-19 21:18:12.735	2026-03-19 21:18:12.735	cmmxasbcj000ht2i6e62xvxr3	2029-03-19 07:18:12.715
cmmyz83jd0005jqi6m46gtq7a	cmmyru86j0000fdi6kc8ufcow	cmmyz83j90004jqi659p3w0gi	cmmyz5ir50000jqi6sp8l2vjb	hendra	\N	2026-03-20 14:10:35.881	2026-03-20 14:10:35.881	2026-03-20 14:10:35.881	cmmxasbci0008t2i6ovbepo1d	2027-03-20 14:10:35.856
cmmyz9kna0007jqi6q8uex6th	cmmyru86j0000fdi6kc8ufcow	cmmyz9kn60006jqi6037cfk3v	cmmyz7zom0002jqi6q5aeeqvd	hendra	\N	2026-03-20 14:11:44.71	2026-03-20 14:11:44.71	2026-03-20 14:11:44.71	cmmxasbci0003t2i6rlq3plii	2029-03-20 14:11:44.681
cmn00t2aq00057ui6culyoom3	cmmxau593000mt2i6hmmnqlom	cmn00t2am00047ui6kal7xzx5	cmn00srha00027ui6wnu8w8lc	testing hari sabtu	\N	2026-03-21 07:42:39.842	2026-03-21 07:42:39.842	2026-03-21 07:42:39.842	cmmx9nq280001joi67f0l2h1y	2029-03-21 07:42:39.815
cmn00tk9100077ui6v67zmg4a	cmmxau593000mt2i6hmmnqlom	cmn00tk8y00067ui6dl8g3s0r	cmn00q3be00007ui691v0i186	jojon	\N	2026-03-21 07:43:03.109	2026-03-21 07:43:03.109	2026-03-21 07:43:03.109	cmmx9nq280001joi67f0l2h1y	2029-03-21 07:43:03.089
cmmyehfqq0009rci6uc4qtamt	cmmxau593000mt2i6hmmnqlom	cmmyehfqn0008rci672rznauc	cmmyefzy30006rci6foic58jp	testing 3	\N	2026-03-20 04:29:59.666	2026-03-20 04:29:59.666	2026-03-20 04:29:59.666	cmmxasbci0004t2i6155z58gw	2026-03-19 21:29:59.633
cmn0b8dj10007qji6bz8bzwdb	cmmxau593000mt2i6hmmnqlom	cmn0b8dix0006qji66906t4qg	cmn0b87h00004qji6f93nq75w	beli bendo 2	\N	2026-03-21 12:34:30.397	2026-03-21 12:34:30.397	2026-03-21 12:34:30.397	cmmxasbci000dt2i6hgasjg4g	2029-03-21 12:34:30.376
cmn0bd0c5000bqji6903cfz8g	cmmxau593000mt2i6hmmnqlom	cmn0bd0c1000aqji6erwaxcg8	cmn0bcsu70008qji694bh1s05	coba	\N	2026-03-21 12:38:06.581	2026-03-21 12:38:06.581	2026-03-21 12:38:06.581	cmmxasbci0008t2i6ovbepo1d	2027-03-21 12:38:06.567
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, price_at_purchase, name_on_tag, species_id, duration_years) FROM stdin;
cmmxxfh8j0001rci6cb8i3oyn	cmmxxfh8f0000rci6344ely7f	300000.00	gada	cmmxasbcj000ht2i6e62xvxr3	3
cmmxz1ufb0003rci6kzphp9no	cmmxz1uf70002rci6povtdib2	300000.00	testing 2	cmmxasbcj000ht2i6e62xvxr3	3
cmmyefzy80007rci6jifgmrpc	cmmyefzy30006rci6foic58jp	200000.00	testing 3	cmmxasbci0004t2i6155z58gw	1
cmmyz5irc0001jqi6gnki5unm	cmmyz5ir50000jqi6sp8l2vjb	200000.00	hendra	cmmxasbci0008t2i6ovbepo1d	1
cmmyz7zop0003jqi6xluxsld8	cmmyz7zom0002jqi6q5aeeqvd	300000.00	hendra	cmmxasbci0003t2i6rlq3plii	3
cmn00q3bl00017ui6a2yri010	cmn00q3be00007ui691v0i186	300000.00	jojon	cmmx9nq280001joi67f0l2h1y	3
cmn00srhd00037ui68m4qqtqn	cmn00srha00027ui6wnu8w8lc	300000.00	testing hari sabtu	cmmx9nq280001joi67f0l2h1y	3
cmn0b87h30005qji6ksglud7t	cmn0b87h00004qji6f93nq75w	300000.00	beli bendo 2	cmmxasbci000dt2i6hgasjg4g	3
cmn0bcsua0009qji6tzqe5ejr	cmn0bcsu70008qji694bh1s05	200000.00	coba	cmmxasbci0008t2i6ovbepo1d	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, order_number, total_amount, payment_status, payment_method, snap_token, created_at, updated_at, expired_at) FROM stdin;
cmn00srha00027ui6wnu8w8lc	cmmxau593000mt2i6hmmnqlom	ORD-20260321-RTDG	300000.00	PAID	bank_transfer	6720c72c-d928-4646-925a-73b5c676f1bc	2026-03-21 07:42:25.821	2026-03-21 07:42:39.817	2026-03-22 07:42:25.818
cmn00q3be00007ui691v0i186	cmmxau593000mt2i6hmmnqlom	ORD-20260321-565H	300000.00	PAID	bank_transfer	1d8540a0-2c8b-4790-93d9-a7ed885b1b9a	2026-03-21 07:40:21.194	2026-03-21 07:43:03.098	2026-03-22 07:40:21.168
cmmxxfh8f0000rci6344ely7f	cmmxau593000mt2i6hmmnqlom	ORD-20260320-WJ80	300000.00	PENDING	\N	fecb792a-c43e-442c-a065-43aa0564f1d6	2026-03-19 20:32:34.815	2026-03-19 20:33:19.522	2026-03-20 20:32:34.782
cmn0b87h00004qji6f93nq75w	cmmxau593000mt2i6hmmnqlom	ORD-20260321-IGVV	300000.00	PAID	bank_transfer	8a08cef3-8cc2-4314-a26c-84ae501291cb	2026-03-21 12:34:22.548	2026-03-21 12:34:30.378	2026-03-22 12:34:22.545
cmmxz1uf70002rci6povtdib2	cmmxau593000mt2i6hmmnqlom	ORD-20260320-7V57	300000.00	PAID	bank_transfer	d1dd349a-3977-478f-b64b-ec228ac842f6	2026-03-19 21:17:57.955	2026-03-19 21:18:12.717	2026-03-20 21:17:57.953
cmmyefzy30006rci6foic58jp	cmmxau593000mt2i6hmmnqlom	ORD-20260320-PTZ5	200000.00	PAID	bank_transfer	d017ba0f-3a20-42ce-9490-0dea985f72cc	2026-03-20 04:28:52.538	2026-03-20 04:29:59.645	2026-03-21 04:28:52.527
cmn0bcsu70008qji694bh1s05	cmmxau593000mt2i6hmmnqlom	ORD-20260321-61H2	200000.00	PAID	bank_transfer	2fd99fb9-a7c3-4fcf-a005-5f136e7ead44	2026-03-21 12:37:56.863	2026-03-21 12:38:06.569	2026-03-22 12:37:56.86
cmmyz5ir50000jqi6sp8l2vjb	cmmyru86j0000fdi6kc8ufcow	ORD-20260320-VIED	200000.00	PAID	bank_transfer	534e97d2-233f-4420-b181-c732789d897a	2026-03-20 14:08:35.632	2026-03-20 14:10:35.859	2026-03-21 14:08:35.508
cmmyz7zom0002jqi6q5aeeqvd	cmmyru86j0000fdi6kc8ufcow	ORD-20260320-CUVD	300000.00	PAID	bank_transfer	4417dbe6-bd68-44da-aac2-c2866e27b5ef	2026-03-20 14:10:30.886	2026-03-20 14:11:44.694	2026-03-21 14:10:30.883
\.


--
-- Data for Name: tree_species; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tree_species (id, name, latin_name, "storyContent", main_image_url, base_price, carbon_absorption_rate, created_at, updated_at, available_stock, category, description, reserved_stock) FROM stdin;
cmmxasbci0001t2i6k4ajlu8p	Laban	Vitex pinnata	Pohon Laban merupakan vegetasi khas wilayah tropis pesisir dan dataran rendah yang sejak lama tumbuh subur di kawasan utara Jawa, termasuk Desa Laban, Kecamatan Kangkung. Dalam tradisi lokal, pohon laban bukan sekadar elemen ekologis, melainkan penanda toponimi dan ruang historis: nama "Laban" diyakini berasal dari keberadaan satu pohon laban besar yang dahulu berdiri kokoh dan menjadi titik berkumpul masyarakat serta pasukan Mataram ketika menyusun strategi perlawanan terhadap VOC pada abad ke-17. Di bawah naungannya, para tumenggung dan adipati beristirahat sebelum melanjutkan perjalanan, sementara sesepuh desa memberikan pasogatan sebagai bentuk dukungan moral dan spiritual. Dengan demikian, pohon laban tidak hanya berfungsi sebagai spesies flora lokal, tetapi juga simbol identitas kolektif, saksi sejarah perjuangan, serta fondasi kultural yang mengakar dalam memori sosial masyarakat.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947090/Laban_1_aw3v2z.jpg	200000.00	35	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	2	Toponimi Gunungkidul	Pohon laban merupakan pohon hutan tropis dengan tinggi mencapai ±30 meter. Batangnya keras dan kuat, dengan daun majemuk dan bunga kecil berwarna keunguan. Laban memiliki potensi sebagai sumber kayu berkualitas serta tanaman rehabilitasi hutan. Secara ekologis, laban berperan dalam penyimpanan karbon dan pemulihan struktur hutan.	0
cmmxasbci0003t2i6rlq3plii	Kepuh	Sterculia foetida	Di masa lalu, pohon kepuh berdiri megah di tepi sungai dan dekat sumber air, sering pula tumbuh di tempat yang dianggap sakral atau "angker". Ia menjulang tinggi hingga 40 meter, dengan batang besar dan daun lebar yang menggugur sebelum masa berbunga, seolah sedang beristirahat sebelum memberi kehidupan baru. Masyarakat dulu mengenal kepuh bukan dari kayunya, tetapi dari khasiatnya. Biji, daun, dan kulit buahnya digunakan dalam ramuan jamu untuk menyembuhkan demam, memperkuat rambut, hingga meredakan nyeri. Pohon ini menjadi bagian dari pengetahuan tradisional yang diwariskan turun-temurun bagi masyarakat Jawa. Dengan mengadopsi pohon Kepuh, kamu ikut menjaga warisan alam dan budaya yang hampir terlupakan.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947167/Kepuh_1_yowpko.jpg	200000.00	42	2026-03-19 09:58:42.49	2026-03-20 14:11:44.699	9	Perspektif Keistimewaan	Pohon kepuh adalah tumbuhan tropis besar dengan tinggi lebih dari 30 m, berdaun majemuk menjari 7–9 helai dan bunga kecil beraroma khas. Buahnya besar dan polongnya berwarna merah matang, berisi biji keras yang menyebar secara alami. Kepuh memiliki beragam potensi manfaat, termasuk sebagai habitat fauna kecil, bahan baku obat herbal, dan biofuel karena kandungan minyak bijinya. Akarnya membantu menahan erosi dan memperbaiki kualitas tanah.	0
cmmxasbci0004t2i6155z58gw	Terbelo Pusuh	Cinchona speciosa	Terbelo pusuh merupakan pohon konservasi yang memiliki nilai medis penting. Genus Cinchona dikenal dunia sebagai sumber bahan obat tradisional dan farmasi, khususnya alkaloid kuinin yang menjadi dasar pengobatan malaria. Keberadaannya sebagai pohon pegunungan yang kini semakin terbatas menjadikan pelestarian spesies ini sangat penting, baik secara ekologis maupun ilmiah, sebagai bagian dari warisan keanekaragaman hayati Indonesia.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	15	2026-03-19 09:58:42.49	2026-03-20 04:29:59.65	1	Native Karst	Terbelo pusuh adalah pohon berukuran sedang dengan kulit batang khas yang mengandung senyawa alkaloid. Daunnya lebar dan bunganya berwarna cerah. Pohon ini memiliki potensi medis penting karena genus Cinchona dikenal sebagai sumber bahan obat tradisional dan farmasi. Secara ekologis, terbelo pusuh berperan sebagai penyimpan karbon dan tanaman konservasi pegunungan.	0
cmmxasbci0005t2i6z69ok3k3	Rempelas	Ficus ampelas	Pohon Rempelas atau Hampelas yang menjadi asal-usul nama kawasan Bandung dikenal dalam kajian botani sebagai Ficus ampelas, sejenis ara liar yang sejak lama tumbuh alami di wilayah Jawa Barat, terutama di area lembap dan dekat sumber mata air. Nama "hampelas" merujuk pada tekstur unik permukaan bawah daunnya yang kasar seperti kertas ampelas, sehingga pada masa lalu daun ini kerap dimanfaatkan masyarakat untuk menghaluskan kayu atau peralatan rumah tangga. Dalam konteks sejarah lokal, keberadaan pohon hampelas yang tumbuh berkelompok di sekitar aliran air menjadikannya penanda ekologis penting bagi pemukiman awal. Dengan demikian, pohon hampelas bukan sekadar vegetasi liar, melainkan bagian dari memori ekologis dan toponimi yang merekam hubungan erat antara alam dan perkembangan kawasan.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	10	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	1	Native Karst	Rempelas merupakan pohon dengan daun kasar dan batang bercabang banyak. Tingginya dapat mencapai ±20 meter dan tumbuh baik di daerah tropis. Pohon ini memiliki potensi budaya dan praktis; daunnya secara tradisional digunakan sebagai alat penghalus alami. Secara ekologis, rempelas berperan sebagai pohon pakan satwa dan penjaga keseimbangan ekosistem hutan.	0
cmmxasbci0002t2i64552023g	Kantil	Magnolia alba	Pohon Kantil atau Cempaka Putih memiliki nilai historis dan kultural yang kuat, khususnya di Jepara sebagai bagian dari jejak kehidupan Raden Ajeng Kartini. Di lingkungan Pendopo Kabupaten Jepara, pohon kantil tua dikenal sebagai saksi bisu masa kecil Kartini dan kerap disebut sebagai tempat beliau bermain, sehingga keberadaannya dipertahankan karena makna sejarahnya. Dalam tradisi Jawa, bunga kantil tidak hanya harum dan indah, tetapi juga sarat simbolisme yang dikaitkan dengan makna "kemantil-kantil" (selalu teringat) serta sering digunakan dalam ritual adat dan pernikahan. Nilai historis, budaya, dan simboliknya menjadikan kanthil tetap dirawat dan dikenang sebagai representasi keharuman nama Kartini sekaligus identitas budaya lokal Jepara.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	18	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	0	Perspektif Keistimewaan	Pohon kantil merupakan pohon berukuran sedang dengan daun hijau mengkilap dan bunga putih kekuningan yang harum. Tingginya dapat mencapai ±20 meter. Kantil memiliki nilai budaya dan spiritual tinggi, sering diasosiasikan dengan kesucian dan ketenangan. Secara ekologis, kantil berfungsi sebagai peneduh dan pendukung keanekaragaman hayati.	0
cmmxasbci000bt2i6rbhnu8gs	Keben	Barringtonia asiatica	Pohon keben memiliki sejarah panjang dalam lanskap budaya dan ekologis Indonesia, terutama di wilayah pesisir tropis tempat ia tumbuh alami. Secara nasional, keben pernah ditetapkan sebagai "Pohon Perdamaian" oleh Soeharto pada peringatan Hari Lingkungan Hidup 5 Juni 1986, menegaskan nilai simboliknya sebagai lambang harmoni dan keteduhan. Dalam tradisi Jawa, keben memiliki makna filosofis; di lingkungan Keraton Yogyakarta, kawasan yang ditanami keben dimaknai sebagai simbol keagungan, kebersihan, dan pelindung kebenaran. Secara ekologis, pohon ini dikenal sebagai salah satu vegetasi awal yang tumbuh di Pulau Anak Krakatau pasca letusan, memperlihatkan perannya dalam proses suksesi alam.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947131/KantilPutih_1_gh0uht.jpg	200000.00	30	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	10	Sumbu Filosofi	Pohon keben adalah pohon pantai tropis yang tumbuh di garis pantai dan hutan pesisir, dengan habitat alami yang luas dari Afrika sampai Asia Tenggara dan Pasifik. Tingginya bisa mencapai puluhan meter dengan daun hijau mengkilap panjang dan buah besar dengan lapisan buah tebal. Keben membantu menjaga keseimbangan ekosistem pantai dan merupakan vegetasi penting dalam proses suksesi alam.	0
cmmxasbci0009t2i6tv4uyya3	Manggis	Garcinia mangostana	Pohon manggis merupakan tanaman buah tropis abadi yang diyakini berasal dari kawasan Asia Tenggara, khususnya Kepulauan Sunda dan Maluku, sebelum kemudian menyebar luas ke wilayah tropis lain sejak abad ke-18 hingga ke-19. Catatan Tiongkok abad ke-15 dalam Yingya Shenglan telah menyebut buah ini, sementara pada 1753 Carl Linnaeus memasukkannya ke dalam Species Plantarum. Di Eropa, manggis memperoleh julukan "Queen of Fruit" yang populer di Inggris, bahkan dikaitkan dengan kisah Queen Victoria. Di Indonesia, manggis berkembang sebagai komoditas penting di Jawa Barat, Sumatera Barat, hingga Kalimantan, dengan beragam sebutan lokal seperti manggu, manggih, dan lopoka, mencerminkan jejak panjang interaksinya dengan budaya dan sejarah Nusantara.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947240/Manggis_1_dtyccm.jpg	200000.00	22	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	5	Perspektif Keistimewaan	Pohon manggis adalah pohon tropis berumur panjang dengan tinggi mencapai ±20–25 meter dan tajuk rapat. Buahnya berbentuk bulat dengan kulit tebal berwarna ungu dan daging buah putih yang manis. Manggis memiliki potensi ekonomi dan kesehatan yang tinggi sebagai sumber antioksidan alami, sementara pohonnya berkontribusi sebagai penyerap karbon dan peneduh.	0
cmmxasbci0006t2i6jblw8np4	Ilat-Ilat	Ficus callosa	Ilat-ilat merupakan pohon ara asli kawasan tropis Asia Tenggara yang tumbuh liar di hutan-hutan dataran rendah. Keberadaannya dalam ekosistem hutan sangat penting sebagai peneduh alami dan penyedia pakan satwa. Meskipun kurang dikenal secara luas dibanding spesies Ficus lainnya, ilat-ilat menyimpan peran ekologis yang tidak tergantikan dalam menjaga keseimbangan keanekaragaman hayati lokal yang kini semakin terancam oleh berkurangnya habitat alaminya.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	14	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	0	Native Karst	Ilat-ilat adalah pohon berukuran sedang hingga besar dengan daun tebal dan panjang. Buahnya kecil dan tumbuh berkelompok. Pohon ini memiliki peran penting sebagai tanaman peneduh alami. Secara ekologis, ilat-ilat berkontribusi dalam menjaga struktur hutan dan keanekaragaman hayati.	0
cmmxasbci0007t2i6hqip1tkd	Asam Jawa	Tamarindus indica	Pohon asem bukan sekadar peneduh jalan atau bahan bumbu dapur. Ia adalah bagian dari napas kehidupan masyarakat Jawa. Dari buahnya yang asam segar, daun mudanya yang jadi ramuan, hingga kayunya yang kuat, semua bagiannya memberi manfaat bagi manusia. Pohon asem sebenarnya bukan tanaman asli Nusantara — ia diperkirakan datang jauh dari Afrika ke India, lalu ke Nusantara, hingga akhirnya begitu lekat dengan tanah Jawa. Di masa lalu, pohon asem berjajar teduh di sepanjang jalan Daendels, memberi keteduhan dan menjadi saksi sejarah masyarakat Jawa. Bagi orang Jawa, biji asem yang disebut klungsu menjadi simbol kerendahan hati. Dengan mengadopsi pohon Asem, kamu ikut menumbuhkan kembali warisan yang menyatukan manusia, alam, dan filosofi hidup sederhana.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	28	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	2	Perspektif Keistimewaan	Pohon asam jawa adalah pohon besar yang selalu hijau dengan tinggi mencapai ±25–30 m, batang berdiameter hingga 2 m, dan tajuk lebat yang membulat. Daunnya majemuk menyirip genap dengan bunga berwarna kuning kekuningan. Buahnya berbentuk polong berkulit keras dengan daging yang asam khas. Secara ekologis, asam jawa berperan dalam menyediakan naungan, memperbaiki kondisi mikroklimat, menahan erosi, dan memberi pakan satwa liar.	0
cmmxasbci000ct2i6mqc38rnb	Sawo Kecik	Manilkara kauki	Pohon sawo kecik memiliki kedudukan historis dan filosofis yang kuat dalam kebudayaan Jawa, terutama di lingkungan keraton dan tradisi Mataram. Secara etimologis, sawo kecik dimaknai sebagai sarwo becik (serba baik), sehingga kerap ditanam di halaman rumah sebagai simbol doa agar pemiliknya senantiasa berada dalam kebaikan. Dalam konteks sejarah, pasca-Perang Jawa (1825–1830), para pengikut Pangeran Diponegoro menggunakan penanaman sawo kecik sebagai penanda simbolik dan kode identitas antar laskar. Pohon ini juga lazim ditanam di lingkungan Keraton Yogyakarta dan Keraton Surakarta bersama beringin dan gayam sebagai representasi moralitas, keteduhan, dan identitas abdi dalem. Kini, keberadaan sawo kecik semakin langka dan lebih banyak dijumpai di kawasan cagar budaya maupun sepanjang sumbu filosofis Yogyakarta.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	17.5	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	5	Sumbu Filosofi	Sawo kecik merupakan pohon berukuran sedang dengan tinggi hingga ±20 meter dan daun hijau mengkilap. Buahnya kecil, bulat, dan manis, sementara kayunya keras dan tahan lama. Pohon ini memiliki nilai budaya tinggi sebagai simbol kesetiaan dan kehalusan budi. Populasinya kini menurun akibat alih fungsi lahan, menjadikan sawo kecik sebagai pohon langka yang penting untuk dikonservasi.	0
cmmxasbcj000ft2i6bm3gafql	Lo	Ficus racemosa	Pohon Lo Jawa atau elo (Ficus racemosa) memiliki jejak sejarah panjang dalam peradaban Asia, khususnya sebagai pohon yang disakralkan dalam tradisi keagamaan dan budaya. Sejak masa kuno, pohon ini telah disebut dalam narasi spiritual India dan Asia Tenggara, serta dikaitkan dengan kisah pencerahan Gautama Buddha dalam tradisi Buddha. Dalam kosmologi Hindu, pohon Lo dikenal sebagai pohon ara yang melambangkan pohon kehidupan dan sumber spiritualitas. Jejak simboliknya juga hadir dalam Al-Qur'an melalui Surah At-Tin serta dalam Alkitab. Di Nusantara, pohon Lo sejak lama tumbuh di sekitar mata air dan sungai, sering dianggap keramat oleh masyarakat lokal sehingga jarang ditebang, menjadikannya bukan hanya bagian dari lanskap alam, tetapi juga saksi hidup perkembangan spiritual, sosial, dan kebudayaan masyarakat dari masa ke masa.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	25	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	10	Toponimi Gunungkidul	Pohon Lo atau elo adalah pohon ara besar yang tumbuh di sekitar mata air dan sungai. Memiliki nilai keramat dalam berbagai tradisi spiritual lintas agama, termasuk Hindu, Buddha, Islam, dan Kristen. Secara ekologis, pohon Lo berperan sebagai penjaga ekosistem riparian dan sumber pakan penting bagi beragam satwa liar.	0
cmmxasbcj000gt2i66cdrjide	Wuni	Antidesma bunius	Pohon wuni atau buni (Antidesma bunius) merupakan tanaman buah tropis yang telah lama tumbuh liar maupun dibudidayakan secara tradisional di pedesaan Jawa dan Nusantara. Secara historis, wuni kerap ditanam di pekarangan sebagai pohon peneduh sekaligus sumber pangan musiman; buahnya yang kecil berwarna merah hingga ungu tua biasa dikonsumsi langsung, dijadikan rujak dengan sambal gula, atau difermentasi menjadi minuman tradisional. Dalam konteks budaya, keberadaan pohon wuni merupakan bagian dari memori kolektif dan simbol kelimpahan desa. Di sejumlah wilayah, nama tempat seperti Karangwuni merekam jejak ekologis keberadaan pohon ini sebagai penanda ruang dan identitas permukiman.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	11	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	2	Toponimi Gunungkidul	Pohon wuni merupakan pohon berukuran sedang dengan tinggi mencapai ±15–20 meter. Daunnya lonjong dan rimbun, sementara buahnya kecil, berwarna merah hingga kehitaman saat masak, dengan rasa asam-manis yang khas. Wuni memiliki potensi sebagai tanaman pangan dan obat tradisional. Buahnya dapat diolah menjadi minuman, selai, maupun fermentasi, serta dikenal mengandung antioksidan alami.	0
cmmxasbcj000lt2i6a9aptl88	Mentaok	Wrightia pubescens	Pohon mentaok bukan sekadar spesies anggota Apocynaceae, melainkan penanda historis lahirnya Kesultanan Mataram Islam yang berawal dari pembukaan Alas Mentaok oleh Ki Ageng Pemanahan setelah memperoleh wilayah itu sebagai hadiah politik dari Sultan Pajang. Dari hutan yang didominasi mentaok inilah kemudian tumbuh Desa Mataram dengan pusat awal di Kotagede. Secara botanis, mentaok dapat mencapai tinggi 10–15 meter, berbatang lurus, berkulit cokelat gelap, berdaun elips meruncing, berbunga putih berbentuk malai, dan berbuah lonjong yang pecah saat masak sehingga bijinya mudah tersebar. Kayunya berserat halus dan lama dimanfaatkan untuk kerajinan, warangka keris, wayang, patung, hingga alat musik.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947091/mojo_1_dyn0en.jpg	200000.00	14	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	0	Toponimi Gunungkidul	Pohon mentaok merupakan pohon berukuran sedang dengan tinggi mencapai ±20 meter. Batangnya lurus, daunnya lonjong dengan permukaan agak berbulu, serta bunganya kecil berwarna putih. Mentaok memiliki potensi sebagai pohon peneduh dan tanaman konservasi lokal. Kayunya dahulu dimanfaatkan secara terbatas untuk kebutuhan rumah tangga. Secara ekologis, mentaok berperan dalam menjaga tutupan vegetasi dan kestabilan tanah.	0
cmmxasbcj000it2i67y0qmjq7	Timoho	Kleinhovia hospita	Pohon timoho (Kleinhovia hospita) memiliki jejak sejarah kultural yang kuat di Jawa, terutama di lingkungan keraton Yogyakarta, karena kayunya sejak lama dipilih sebagai bahan warangka (sarung) keris — sebuah elemen penting dalam sistem simbolik dan busana adat keris. Serat kayunya yang bercorak unik dan membentuk "pelet" menjadikan timoho bukan sekadar material fungsional, melainkan medium estetika dan spiritual. Dalam tradisi tosan aji, motif pelet tertentu diyakini mengandung tuah seperti kewibawaan, perlindungan, kemakmuran, hingga pengasihan. Selain fungsi budaya tersebut, timoho juga dikenal dalam pengobatan tradisional karena daun dan kulit kayunya dimanfaatkan untuk terapi penyakit hati dan radang.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	16.5	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	0	Sumbu Filosofi	Pohon timoho adalah pohon berukuran sedang dengan tinggi sekitar ±15–20 meter. Daunnya lebar berbentuk jantung dan bunganya berwarna merah muda mencolok. Timoho memiliki nilai budaya yang tinggi di Jawa, terutama karena kayunya dahulu digunakan untuk membuat warangka keris. Secara ekologis, timoho berfungsi sebagai peneduh dan penyerap karbon.	0
cmmxasbcj000jt2i69jhh25b5	Tanjung	Mimusops elengi	Pohon tanjung memiliki jejak sejarah kultural yang kuat dalam lanskap Jawa, baik sebagai penanda ruang sosial maupun simbol etika keraton. Di wilayah Prambanan, istilah "Sor Tanjung" (di bawah pohon tanjung) yang merujuk pada lokasi perdagangan berkembang menjadi "Tanjungan", lalu terdokumentasi sebagai "Tandjoengsari" dalam peta kolonial 1931, merekam transformasi toponimi berbasis vegetasi. Dalam kosmologi Jawa, khususnya di lingkungan Keraton Yogyakarta, tanjung ditanam di empat sudut Bangsal Pancaniti dan sepanjang sumbu filosofis Panggung Krapyak hingga Alun-Alun Selatan sebagai simbol tansah disanjung — harapan agar manusia senantiasa dihormati karena kebajikan, ketelitian, dan tanggung jawabnya.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	35	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	0	Sumbu Filosofi	Pohon tanjung adalah pohon tropis berukuran sedang hingga besar dengan tajuk padat dan rimbun, daun tunggal hijau mengkilap, serta bunga kecil berwarna putih-krem yang harum terutama pada malam hari. Akar kuat dan batang kokoh menjadikan pohon ini tahan angin dan ideal sebagai peneduh. Potensi ekologisnya meliputi penyerapan karbon yang signifikan serta berperan sebagai habitat satwa kecil.	0
cmmxasbcj000kt2i6trnyltu5	Beringin	Ficus benjamina	Pohon beringin (Ficus benjamina) memiliki sejarah kultural yang sangat tua di Nusantara sebagai simbol kosmologis, politik, dan spiritual, sejak masa kerajaan Hindu-Buddha hingga Mataram Islam. Di ruang keraton Jawa, terutama di lingkungan Keraton Yogyakarta, beringin ditanam di alun-alun sebagai lambang pengayoman raja terhadap rakyat — akar yang menghujam dan tajuk yang menaungi dimaknai sebagai perlindungan, keseimbangan, serta pusat kekuatan. Sepasang beringin kembar di Alun-Alun Kidul merepresentasikan dualitas dan harmoni kosmis, sementara dalam tradisi Jawa dan Bali pohon ini dianggap suci, menjadi lokasi sesaji dan diyakini sebagai tempat bersemayam roh leluhur.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	45	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	1	Sumbu Filosofi	Pohon beringin merupakan pohon besar berumur panjang dengan tinggi dapat mencapai ±30 meter dan tajuk sangat lebar. Batangnya kokoh dengan akar gantung yang khas, sementara daunnya kecil, mengilap, dan rimbun sepanjang tahun. Beringin memiliki potensi ekologis dan budaya yang tinggi. Secara ekologis, pohon ini berfungsi sebagai penyerap karbon dan peneduh alami. Secara budaya, beringin kerap dimaknai sebagai simbol perlindungan dan keteduhan.	0
cmmxasbci000at2i656fy0txh	Gayam	Inocarpus fagiferus	Dahulu, pohon gayam tumbuh teduh di tepi jalan dan halaman desa, memberi naungan bagi siapa pun yang singgah di bawahnya. Daunnya yang tebal dan rimbun menyaring debu dan polusi, sementara akarnya yang kuat menjaga tanah dari longsor dan menyimpan air kehidupan di dalam bumi. Namun kini, pohon gayam perlahan menghilang karena dianggap kurang memiliki nilai ekonomi — padahal perannya sangat penting bagi keseimbangan lingkungan. Bagi masyarakat Jawa, gayam bukan sekadar pohon peneduh. Ia menyimbolkan ketenangan dan keharmonisan hidup dengan sebutan "gayub ayem", yang berarti kedamaian dan ketentraman. Dengan mengadopsi pohon gayam, kamu ikut menanam keteduhan dan keseimbangan alam.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	20	2026-03-19 09:58:42.49	2026-03-21 13:01:02.188	2	Perspektif Keistimewaan	Gayam adalah pohon besar dengan tajuk rimbun dan daun panjang bertekstur tebal, yang tumbuh di kawasan dataran rendah tropis. Batangnya kuat dan keras. Pohon gayam memiliki potensi ekologis tinggi karena daunnya menyerap lebih banyak polusi udara dan debu, serta sistem akar yang kokoh membantu mencegah erosi dan menstabilkan tanah. Populasinya menurun akibat alih fungsi lahan dan penurunan penanaman tradisional.	0
cmmxasbcj000et2i6hj5n74oi	Dlingsem	Homalium tomentosum	Pohon dlingsem merupakan jenis pohon tropis asli Asia Tenggara yang sejak lama tumbuh liar di tepian sungai, hutan sekunder, dan kawasan pedesaan Jawa, serta memiliki jejak historis-ekologis dalam kehidupan masyarakat agraris. Dalam tradisi Jawa, pohon ini sering diasosiasikan dengan ruang yang "wingit" atau sakral, serupa dengan jenis beringin, sehingga tidak jarang tumbuh di dekat sendang, makam tua, atau petilasan, memperkuat kedudukannya dalam lanskap budaya lokal. Kayunya yang relatif lunak memang jarang dimanfaatkan untuk konstruksi berat, namun keberadaannya lebih dihargai sebagai pohon pelindung dan bagian dari vegetasi tua desa.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	13	2026-03-19 09:58:42.49	2026-03-19 09:58:42.49	0	Perspektif Keistimewaan	Dlingsem merupakan pohon hutan berukuran sedang dengan daun berbulu halus dan batang cukup kuat. Tingginya dapat mencapai ±25 meter. Pohon ini memiliki potensi sebagai tanaman konservasi dan peneduh kawasan hutan. Secara ekologis, dlingsem berperan dalam menjaga keseimbangan ekosistem hutan tropis. Keberadaannya semakin jarang ditemukan akibat degradasi hutan.	0
cmmx9nq280001joi67f0l2h1y	Mojo	Aegle marmelos	Buah Mojo (maja) memiliki jejak historis yang kuat dalam peradaban Jawa, terutama terkait dengan lahirnya Kerajaan Majapahit pada 1293 M di kawasan lembah Sungai Brantas. Dalam kitab Pararaton disebutkan bahwa nama "Majapahit" berasal dari buah maja yang rasanya pahit, merujuk pada banyaknya pohon maja yang tumbuh di wilayah tersebut. Secara botani, tanaman tropis ini tumbuh baik di dataran rendah dan ekosistem daerah aliran sungai, sehingga persebarannya di sepanjang DAS Brantas memengaruhi toponimi berbagai wilayah berawalan "Mojo" seperti Mojokerto dan Mojoagung. Selain menjadi identitas geografis dan politik, buah maja juga memiliki makna simbolik dalam tradisi Hindu sebagai tanaman yang diasosiasikan dengan Dewa Syiwa, menjadikannya bukan sekadar flora lokal, melainkan bagian dari lanskap kultural, spiritual, dan historis Nusantara.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947091/mojo_1_dyn0en.jpg	200000.00	12.5	2026-03-19 09:27:08.719	2026-03-21 07:43:03.101	8	Toponimi Gunungkidul	Pohon mojo merupakan pohon berukuran sedang dengan tinggi mencapai ±15 meter, berdaun majemuk, dan buah berkulit keras dengan aroma khas. Tanaman ini dikenal tahan terhadap kondisi kering. Mojo memiliki potensi sebagai tanaman obat tradisional, terutama buah dan daunnya yang digunakan dalam pengobatan pencernaan dan kesehatan tubuh. Secara ekologis, mojo berperan dalam menjaga ketahanan lahan kering dan memperkaya keanekaragaman hayati.	0
cmmxasbcj000ht2i6e62xvxr3	Awar-Awar	Ficus septica	Secara kultural, pohon awar-awar memiliki kedudukan penting dalam pembentukan identitas ruang dan mitologi lokal, khususnya di Desa Selok Awar-Awar, Kecamatan Pasirian, Kabupaten Lumajang. Dalam tradisi tutur setempat, nama "Selok Awar-Awar" berasal dari gabungan kata selo (batu) dan awar-awar (nama pohon), merujuk pada sebuah batu yang berada di bawah pohon awar-awar besar dan dianggap sakral. Kepercayaan ini menunjukkan pola kosmologi Jawa yang menempatkan pohon besar sebagai pusat ruang spiritual sekaligus penanda batas alam. Tradisi bersih desa setiap 1 Suro di Selok Awar-Awar, yang disertai pertunjukan wayang, semakin memperkuat relasi antara vegetasi, mitos, dan identitas kolektif desa.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	9.5	2026-03-19 09:58:42.49	2026-03-21 12:30:25.581	4	Toponimi Gunungkidul	Awar-awar merupakan pohon kecil hingga sedang dengan daun besar berwarna hijau tua dan batang bercabang banyak. Buahnya kecil dan menjadi pakan alami satwa liar. Pohon ini memiliki potensi sebagai tanaman obat tradisional dan tanaman pionir pada lahan terganggu. Secara ekologis, awar-awar berperan penting sebagai penyedia pakan satwa dan penjaga keseimbangan ekosistem awal.	2
cmmxasbci0008t2i6ovbepo1d	Jambu Dersana	Syzygium malaccense	Pohon jambu dersana atau jambu darsono (Syzygium malaccense) dalam tata ruang filosofis Keraton Yogyakarta bukan sekadar vegetasi peneduh, melainkan simbol moral yang sarat makna. Ditanam di sekitar kawasan Kemagangan yakni ruang yang melambangkan proses pendewasaan manusia, jambu dersana dimaknai sebagai sinudarsana (keteladanan), yakni ajaran bahwa seseorang yang sedang "magang" menuju kedewasaan harus meneladani budi pekerti luhur. Pohon ini berbuah lebat dengan warna merah menyala, merepresentasikan kematangan, keberanian, dan kesiapan menjalani peran sosial. Keberadaannya menegaskan tahap pembentukan karakter—bahwa kecukupan jasmani harus disertai pembinaan akhlak dan keteladanan sebagai fondasi manusia paripurna.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	16	2026-03-19 09:58:42.49	2026-03-21 12:38:06.572	1	Sumbu Filosofi	Jambu dersana merupakan pohon berukuran sedang dengan daun hijau mengilap dan buah kecil yang dapat dikonsumsi. Tingginya mencapai ±15–20 meter. Pohon ini memiliki potensi sebagai tanaman pangan lokal dan tanaman peneduh. Secara ekologis, jambu dersana mendukung keanekaragaman hayati dan menyediakan pakan bagi satwa.	0
cmmxasbci000dt2i6hgasjg4g	Bendo	Artocarpus elasticus	Pohon bendo merupakan tumbuhan asli Nusantara dari famili Moraceae yang berkerabat dekat dengan nangka dan sukun, serta memiliki jejak historis kuat dalam lanskap budaya Jawa. Sejak masa lalu, pohon ini tumbuh besar di tegalan dan pinggir hutan desa, dikenal karena getahnya (pulut) yang sangat lengket dan dimanfaatkan para pemikat burung sebagai perekat alami untuk menjerat burung, menjadikannya bagian dari praktik ekonomi tradisional masyarakat pedesaan. Selain fungsi praktis, bendo juga meninggalkan jejak toponimi; banyak desa di Jawa menggunakan nama "Bendo" sebagai identitas wilayah karena dahulu pohon ini tumbuh dominan di kawasan tersebut. Kini, pohon bendo semakin jarang ditemukan, menjadikannya simbol hubungan lama antara manusia, alam, dan identitas ruang.	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	200000.00	38	2026-03-19 09:58:42.49	2026-03-21 12:34:30.381	3	Toponimi Gunungkidul	Pohon bendo adalah pohon hutan besar yang dapat tumbuh hingga ±30–45 meter dengan batang berdiameter besar. Daun dan buahnya menyerupai keluwih, sementara getahnya berwarna putih kekuningan dan lengket. Bendo memiliki potensi budaya dan ekologis yang khas; getahnya dimanfaatkan dalam tradisi menangkap burung, sementara buah dan bijinya dapat dikonsumsi secara tradisional.	1
\.


--
-- Data for Name: tree_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tree_updates (id, tree_id, photo_url, height_cm, diameter_cm, co2_absorbed_total, admin_notes, created_at, updated_at) FROM stdin;
cmmzzu3l900007vi6re0gf22l	cmmxz25to0004rci6d2y997rm	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947090/Laban_1_aw3v2z.jpg	170	22	19	ga ada	2026-03-21 07:15:28.556	2026-03-21 07:15:28.556
cmmzzv2gh00017vi61lbasugd	cmmxz25to0004rci6d2y997rm	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773947090/Laban_1_aw3v2z.jpg	11	11	1	11	2026-03-21 07:16:13.745	2026-03-21 07:16:13.745
cmmzzvl2q00027vi6xs3fmkh0	cmmxz25to0004rci6d2y997rm	https://res.cloudinary.com/dipxvmlmy/image/upload/v1773948296/beringin_1_i06hzt.jpg	20	12	12	d	2026-03-21 07:16:37.874	2026-03-21 07:16:37.874
cmn2iweeq0000dni6kh30w7v7	cmmyz83j90004jqi659p3w0gi	https://res.cloudinary.com/dipxvmlmy/image/upload/v1774230266/pohonku/tree-updates/ftuzmdevma5kptkj7mku.jpg	112	1212	0	dfafa	2026-03-23 01:44:40.946	2026-03-23 01:44:40.946
cmn2ixdfc0001dni6l8qoew7u	cmmyz9kn60006jqi6037cfk3v	https://res.cloudinary.com/dipxvmlmy/image/upload/v1774230318/pohonku/tree-updates/nv0hsbjx2tiwpn9hovsf.jpg	2222	2	12	afdknahkbf	2026-03-23 01:45:26.328	2026-03-23 01:45:26.328
cmn2iz7yf0002dni64l05nw4u	cmn00t2am00047ui6kal7xzx5	https://res.cloudinary.com/dipxvmlmy/image/upload/v1774230406/pohonku/tree-updates/tc8dhzm69pncvlc1tdrq.jpg	12	2	2	jdnadnfj	2026-03-23 01:46:52.551	2026-03-23 01:46:52.551
\.


--
-- Data for Name: trees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trees (id, species_id, serial_number, latitude, longitude, status, planted_at, created_at, updated_at) FROM stdin;
cmmxz25to0004rci6d2y997rm	cmmxasbcj000ht2i6e62xvxr3	AW-2026-0001	\N	\N	SOLD	\N	2026-03-19 21:18:12.732	2026-03-19 21:18:12.732
cmmyehfqn0008rci672rznauc	cmmxasbci0004t2i6155z58gw	TE-2026-0001	\N	\N	SOLD	\N	2026-03-20 04:29:59.663	2026-03-20 04:29:59.663
cmmyz83j90004jqi659p3w0gi	cmmxasbci0008t2i6ovbepo1d	JA-2026-0001	\N	\N	SOLD	\N	2026-03-20 14:10:35.877	2026-03-20 14:10:35.877
cmmyz9kn60006jqi6037cfk3v	cmmxasbci0003t2i6rlq3plii	KE-2026-0001	\N	\N	SOLD	\N	2026-03-20 14:11:44.706	2026-03-20 14:11:44.706
cmn00t2am00047ui6kal7xzx5	cmmx9nq280001joi67f0l2h1y	MO-2026-0001	\N	\N	SOLD	\N	2026-03-21 07:42:39.838	2026-03-21 07:42:39.838
cmn00tk8y00067ui6dl8g3s0r	cmmx9nq280001joi67f0l2h1y	MO-2026-0002	\N	\N	SOLD	\N	2026-03-21 07:43:03.106	2026-03-21 07:43:03.106
cmn0b8dix0006qji66906t4qg	cmmxasbci000dt2i6hgasjg4g	BE-2026-0001	\N	\N	SOLD	\N	2026-03-21 12:34:30.393	2026-03-21 12:34:30.393
cmn0bd0c1000aqji6erwaxcg8	cmmxasbci0008t2i6ovbepo1d	JA-2026-0002	\N	\N	SOLD	\N	2026-03-21 12:38:06.577	2026-03-21 12:38:06.577
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, full_name, password_hash, phone, role, is_verified_email, created_at, updated_at, auth_provider, avatar_url, google_id) FROM stdin;
cmmx8wmpl0000joi6yvz6wah5	hendrakurniamaliqi@gmail.com	hendra maliqi	\N	\N	ADMIN	t	2026-03-19 09:06:04.665	2026-03-19 09:06:04.665	GOOGLE	https://lh3.googleusercontent.com/a/ACg8ocLbagyRZbpdPT5NYV5dtZVC2ULVK73yA8W-Cg3dJTiZE3i--g=s96-c	113709123986842118142
cmmxau593000mt2i6hmmnqlom	hendrakurnia421@gmail.com	Hendra Kurnia	\N	\N	USER	t	2026-03-19 10:00:07.958	2026-03-19 10:00:07.958	GOOGLE	https://lh3.googleusercontent.com/a/ACg8ocKv49YzIn15eWo1UyFLdq7xaKUMoUznq7b9Wi6I__L_zrEufQ=s96-c	112636946349115772432
cmmyru86j0000fdi6kc8ufcow	pohonkufkt@gmail.com	pohonku fkt	\N	\N	ADMIN	t	2026-03-20 10:43:51.403	2026-03-20 10:43:51.403	GOOGLE	https://lh3.googleusercontent.com/a/ACg8ocLGoa5w48lX3t8qfkRxCJoyNcBrjhV6v_g0rguNyi74xWrPag=s96-c	117945746686973789685
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: adoptions adoptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoptions
    ADD CONSTRAINT adoptions_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: tree_species tree_species_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tree_species
    ADD CONSTRAINT tree_species_pkey PRIMARY KEY (id);


--
-- Name: tree_updates tree_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tree_updates
    ADD CONSTRAINT tree_updates_pkey PRIMARY KEY (id);


--
-- Name: trees trees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trees
    ADD CONSTRAINT trees_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: adoptions_order_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX adoptions_order_id_key ON public.adoptions USING btree (order_id);


--
-- Name: adoptions_tree_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX adoptions_tree_id_key ON public.adoptions USING btree (tree_id);


--
-- Name: order_items_order_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX order_items_order_id_key ON public.order_items USING btree (order_id);


--
-- Name: orders_order_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);


--
-- Name: tree_species_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tree_species_name_key ON public.tree_species USING btree (name);


--
-- Name: trees_serial_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX trees_serial_number_key ON public.trees USING btree (serial_number);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_google_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_google_id_key ON public.users USING btree (google_id);


--
-- Name: adoptions adoptions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoptions
    ADD CONSTRAINT adoptions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: adoptions adoptions_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoptions
    ADD CONSTRAINT adoptions_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.tree_species(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: adoptions adoptions_tree_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoptions
    ADD CONSTRAINT adoptions_tree_id_fkey FOREIGN KEY (tree_id) REFERENCES public.trees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: adoptions adoptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoptions
    ADD CONSTRAINT adoptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.tree_species(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tree_updates tree_updates_tree_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tree_updates
    ADD CONSTRAINT tree_updates_tree_id_fkey FOREIGN KEY (tree_id) REFERENCES public.trees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: trees trees_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trees
    ADD CONSTRAINT trees_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.tree_species(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict effpBN8zscYmnf9iJ0EBJHKV3EwtEytkdNNLWn8oyWqHO7cziLgiad0F2iQJq2j

