--
-- PostgreSQL database dump
--

\restrict NiXabKrZmKu0RfUauskdnVqnldtZwwIUxPXMQlPMQMhnNtFIBlgTDhqDa8Uczam

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

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
-- Name: courses; Type: TABLE; Schema: public; Owner: rgreenwood
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name text NOT NULL,
    credits integer NOT NULL,
    prereqs text,
    students_allowed integer NOT NULL,
    created_by text NOT NULL,
    enrolled_students integer DEFAULT 0
);


ALTER TABLE public.courses OWNER TO rgreenwood;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: rgreenwood
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO rgreenwood;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rgreenwood
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: rgreenwood
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    auth0_id character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(50) NOT NULL,
    discipline character varying(100) NOT NULL,
    role character varying(100) NOT NULL
);


ALTER TABLE public.profiles OWNER TO rgreenwood;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: rgreenwood
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profiles_id_seq OWNER TO rgreenwood;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rgreenwood
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: user_courses; Type: TABLE; Schema: public; Owner: rgreenwood
--

CREATE TABLE public.user_courses (
    id integer NOT NULL,
    user_id text NOT NULL,
    course_id integer NOT NULL,
    course_name text NOT NULL,
    teacher_name text NOT NULL,
    prerequisites text[] DEFAULT '{}'::text[],
    status text DEFAULT 'applied'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_courses_status_check CHECK ((status = ANY (ARRAY['applied'::text, 'enrolled'::text, 'completed'::text, 'dropped'::text])))
);


ALTER TABLE public.user_courses OWNER TO rgreenwood;

--
-- Name: user_courses_id_seq; Type: SEQUENCE; Schema: public; Owner: rgreenwood
--

CREATE SEQUENCE public.user_courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_courses_id_seq OWNER TO rgreenwood;

--
-- Name: user_courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rgreenwood
--

ALTER SEQUENCE public.user_courses_id_seq OWNED BY public.user_courses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: rgreenwood
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100)
);


ALTER TABLE public.users OWNER TO rgreenwood;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: rgreenwood
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO rgreenwood;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rgreenwood
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: user_courses id; Type: DEFAULT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.user_courses ALTER COLUMN id SET DEFAULT nextval('public.user_courses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: rgreenwood
--

COPY public.courses (id, name, credits, prereqs, students_allowed, created_by, enrolled_students) FROM stdin;
18	Rachel Greenwood	1		1	auth0|68ffc119fb66734ba492077b	0
14	Knife Fighting I	10		10	auth0|68fd244ac7940ce6252eba09	3
15	Knife Fighting II	10	Knife Fighting I	12	auth0|68fd244ac7940ce6252eba09	5
19	New	5	ngfbdgfs	5	auth0|68fd244ac7940ce6252eba09	0
16	Knife Fighting III	20	Knife Fighting II	20	auth0|68fd244ac7940ce6252eba09	2
13	Kyu To Dan	10	Knife Fighting III	4	auth0|68fd244ac7940ce6252eba09	3
17	ngfbdgfs	3		3	auth0|68fd244ac7940ce6252eba09	2
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: rgreenwood
--

COPY public.profiles (id, auth0_id, email, username, discipline, role) FROM stdin;
28	auth0|68f9534d93fbd6f5a89b2565	test99@gmail.com	test99@gmail.com	MMA	Student
29	auth0|68fd244ac7940ce6252eba09	instructortest@gmail.com	Instructor Test	MMA	Instructor
30	auth0|68fec05fbd9b8a1be3e570cb	newbie@gmail.com	white belt	Taekwondo	Student
31	auth0|68fd25168850953cbe50a0d0	studenttest@gmail.com	Newbie	MMA	Student
32	auth0|68ffc119fb66734ba492077b	gfqw@gmail.com	fgd	MMA	Instructor
33	auth0|68ffab8cfb66734ba491f7e4	rachelgreenwood3301@gmail.com	rgreenwood	MMA	Student
\.


--
-- Data for Name: user_courses; Type: TABLE DATA; Schema: public; Owner: rgreenwood
--

COPY public.user_courses (id, user_id, course_id, course_name, teacher_name, prerequisites, status, created_at, updated_at) FROM stdin;
11	auth0|68f9534d93fbd6f5a89b2565	14	Knife Fighting I	Instructor Test	{}	enrolled	2025-10-26 15:09:39.546349	2025-10-26 15:09:39.546349
13	auth0|68fd244ac7940ce6252eba09	14	Knife Fighting I	Instructor Test	{}	enrolled	2025-10-26 17:24:31.527405	2025-10-26 17:24:31.527405
12	auth0|68f9534d93fbd6f5a89b2565	15	Knife Fighting II	Instructor Test	{"Knife Fighting I"}	enrolled	2025-10-26 17:20:21.72231	2025-10-26 17:20:21.72231
14	auth0|68f9534d93fbd6f5a89b2565	15	Knife Fighting II	Instructor Test	{"Knife Fighting I"}	enrolled	2025-10-26 18:38:09.2336	2025-10-26 18:38:09.2336
18	auth0|68fd25168850953cbe50a0d0	14	Knife Fighting I	Instructor Test	{}	applied	2025-10-26 19:53:20.596365	2025-10-26 19:53:20.596365
20	auth0|68fd25168850953cbe50a0d0	16	Knife Fighting III	Instructor Test	{"Knife Fighting II"}	applied	2025-10-26 19:53:34.214082	2025-10-26 19:53:34.214082
17	auth0|68fd25168850953cbe50a0d0	13	Test Course	Instructor Test	{}	enrolled	2025-10-26 19:53:16.336746	2025-10-26 19:53:16.336746
19	auth0|68fd25168850953cbe50a0d0	15	Knife Fighting II	Instructor Test	{"Knife Fighting I"}	enrolled	2025-10-26 19:53:30.835576	2025-10-26 19:53:30.835576
22	auth0|68fd25168850953cbe50a0d0	15	Knife Fighting II	Instructor Test	{"Knife Fighting I"}	enrolled	2025-10-27 14:43:18.483165	2025-10-27 14:43:18.483165
23	auth0|68fd25168850953cbe50a0d0	16	Knife Fighting III	Instructor Test	{"Knife Fighting II"}	applied	2025-10-27 14:44:39.034627	2025-10-27 14:44:39.034627
16	auth0|68f9534d93fbd6f5a89b2565	16	Knife Fighting III	Instructor Test	{"Knife Fighting II"}	enrolled	2025-10-26 19:51:45.737045	2025-10-26 19:51:45.737045
24	auth0|68ffab8cfb66734ba491f7e4	14	Knife Fighting I	Instructor Test	{}	enrolled	2025-10-27 14:51:37.250426	2025-10-27 14:51:37.250426
25	auth0|68ffab8cfb66734ba491f7e4	15	Knife Fighting II	Instructor Test	{"Knife Fighting I"}	enrolled	2025-10-27 14:51:43.664968	2025-10-27 14:51:43.664968
26	auth0|68f9534d93fbd6f5a89b2565	17	ngfbdgfs	Instructor Test	{}	enrolled	2025-10-27 15:10:19.268242	2025-10-27 15:10:19.268242
15	auth0|68f9534d93fbd6f5a89b2565	13	Test Course	Instructor Test	{}	enrolled	2025-10-26 19:30:51.818912	2025-10-26 19:30:51.818912
27	auth0|68ffab8cfb66734ba491f7e4	16	Knife Fighting III	Instructor Test	{"Knife Fighting II"}	enrolled	2025-10-27 15:28:54.3156	2025-10-27 15:28:54.3156
28	auth0|68fec05fbd9b8a1be3e570cb	14	Knife Fighting I	Instructor Test	{}	applied	2025-10-27 15:58:39.525838	2025-10-27 15:58:39.525838
29	auth0|68fec05fbd9b8a1be3e570cb	18	Rachel Greenwood	fgd	{}	applied	2025-10-27 15:59:25.027601	2025-10-27 15:59:25.027601
21	auth0|68fd244ac7940ce6252eba09	13	Test Course	Instructor Test	{}	enrolled	2025-10-27 08:36:46.40237	2025-10-27 08:36:46.40237
30	auth0|68fec05fbd9b8a1be3e570cb	17	ngfbdgfs	Instructor Test	{}	enrolled	2025-10-27 16:00:19.778534	2025-10-27 16:00:19.778534
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: rgreenwood
--

COPY public.users (id, name, email) FROM stdin;
1	Test Name	test@example.com
\.


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rgreenwood
--

SELECT pg_catalog.setval('public.courses_id_seq', 19, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rgreenwood
--

SELECT pg_catalog.setval('public.profiles_id_seq', 33, true);


--
-- Name: user_courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rgreenwood
--

SELECT pg_catalog.setval('public.user_courses_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rgreenwood
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_auth0_id_key; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_auth0_id_key UNIQUE (auth0_id);


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: user_courses user_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.user_courses
    ADD CONSTRAINT user_courses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_courses user_courses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rgreenwood
--

ALTER TABLE ONLY public.user_courses
    ADD CONSTRAINT user_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict NiXabKrZmKu0RfUauskdnVqnldtZwwIUxPXMQlPMQMhnNtFIBlgTDhqDa8Uczam

