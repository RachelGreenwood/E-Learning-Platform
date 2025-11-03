-- Drop tables if they exist (cascading dependencies)
DROP TABLE IF EXISTS public.user_courses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS public.courses_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.profiles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.user_courses_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;

-- Create sequences
CREATE SEQUENCE public.courses_id_seq START 1;
CREATE SEQUENCE public.profiles_id_seq START 1;
CREATE SEQUENCE public.user_courses_id_seq START 1;
CREATE SEQUENCE public.users_id_seq START 1;

-- Create tables
CREATE TABLE public.courses (
    id integer NOT NULL DEFAULT nextval('public.courses_id_seq'),
    name text NOT NULL,
    credits integer NOT NULL,
    prereqs text,
    students_allowed integer NOT NULL,
    created_by text NOT NULL,
    enrolled_students integer DEFAULT 0,
    CONSTRAINT courses_pkey PRIMARY KEY (id)
);

CREATE TABLE public.profiles (
    id integer NOT NULL DEFAULT nextval('public.profiles_id_seq'),
    auth0_id character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(50) NOT NULL,
    discipline character varying(100) NOT NULL,
    role character varying(100) NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_auth0_id_key UNIQUE (auth0_id),
    CONSTRAINT profiles_email_key UNIQUE (email),
    CONSTRAINT profiles_username_key UNIQUE (username)
);

CREATE TABLE public.user_courses (
    id integer NOT NULL DEFAULT nextval('public.user_courses_id_seq'),
    user_id text NOT NULL,
    course_id integer NOT NULL,
    course_name text NOT NULL,
    teacher_name text NOT NULL,
    prerequisites text[] DEFAULT '{}'::text[],
    status text DEFAULT 'applied'::text CHECK ((status = ANY (ARRAY['applied','enrolled','completed','dropped']))),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_courses_pkey PRIMARY KEY (id),
    CONSTRAINT user_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

CREATE TABLE public.users (
    id integer NOT NULL DEFAULT nextval('public.users_id_seq'),
    name character varying(100),
    email character varying(100),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Insert data
COPY public.courses (id, name, credits, prereqs, students_allowed, created_by, enrolled_students) FROM stdin;
18	Rachel Greenwood	1		1	auth0|68ffc119fb66734ba492077b	0
14	Knife Fighting I	10		10	auth0|68fd244ac7940ce6252eba09	3
15	Knife Fighting II	10	Knife Fighting I	12	auth0|68fd244ac7940ce6252eba09	5
19	New	5	ngfbdgfs	5	auth0|68fd244ac7940ce6252eba09	0
16	Knife Fighting III	20	Knife Fighting II	20	auth0|68fd244ac7940ce6252eba09	2
13	Kyu To Dan	10	Knife Fighting III	4	auth0|68fd244ac7940ce6252eba09	3
17	ngfbdgfs	3		3	auth0|68fd244ac7940ce6252eba09	2
\.

COPY public.profiles (id, auth0_id, email, username, discipline, role) FROM stdin;
28	auth0|68f9534d93fbd6f5a89b2565	test99@gmail.com	test99@gmail.com	MMA	Student
29	auth0|68fd244ac7940ce6252eba09	instructortest@gmail.com	Instructor Test	MMA	Instructor
30	auth0|68fec05fbd9b8a1be3e570cb	newbie@gmail.com	white belt	Taekwondo	Student
31	auth0|68fd25168850953cbe50a0d0	studenttest@gmail.com	Newbie	MMA	Student
32	auth0|68ffc119fb66734ba492077b	gfqw@gmail.com	fgd	MMA	Instructor
33	auth0|68ffab8cfb66734ba491f7e4	rachelgreenwood3301@gmail.com	rgreenwood	MMA	Student
\.

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

COPY public.users (id, name, email) FROM stdin;
1	Test Name	test@example.com
\.

-- Set sequences to next value
SELECT pg_catalog.setval('public.courses_id_seq', 19, true);
SELECT pg_catalog.setval('public.profiles_id_seq', 33, true);
SELECT pg_catalog.setval('public.user_courses_id_seq', 30, true);
SELECT pg_catalog.setval('public.users_id_seq', 1, true);