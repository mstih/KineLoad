-- Schema for all the tables in the database

-- Users table
create table users (
    id bigint generated always as identity primary key,
    name text not null,
    email text not null unique,
    password_hash text not null,
    created_at timestamptz not null default now()
);

-- Sessons table
create table sessions (
    id bigint generated always as identity primary key,
    user_id bigint not null references users(id) on delete cascade,
    token text not null unique,
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
);

-- Plans table
create table plans (
    id bigint generated always as identity primary key,
    user_id bigint not null references users(id) on delete cascade,
    name text not null,
    start_date date not null,
    weeks int not null check (weeks >= 1 and weeks <= 52),
    created_at timestamptz not null default now()
);

-- Weeks table
create table weeks (
    id bigint generated always as identity primary key,
    plan_id bigint not null references plans(id) on delete cascade,
    week_number int not null check (week_number >= 1),
    unique (plan_id, week_number)
);

-- Strength entries table
create table strength_entries (
    id bigint generated always as identity primary key,
    week_id bigint not null unique references weeks(id) on delete cascade,
    sessions int not null default 0 check (sessions >= 0),
    intensity numeric(5,2) not null default 0 check (intensity >= 0 and intensity <= 100),
    exercises int not null default 0 check (exercises >= 0),
    reps int not null default 0 check (reps >= 0),
    sets int not null default 0 check (sets >= 0)
);

-- Endurance entries table
create table endurance_entries (
   id bigint generated always as identity primary key,
   week_id bigint not null unique references weeks(id) on delete cascade,
   sessions int not null default 0 check (sessions >= 0),
   intensity numeric(5,2) not null default 0 check (intensity >= 0 and intensity <= 100),
   duration_min numeric(6,2) not null default 0 check (duration_min >= 0)
);

-- Flexibility entries table
create table flexibility_entries (
   id bigint generated always as identity primary key,
   week_id bigint not null unique references weeks(id) on delete cascade,
   sessions int not null default 0 check (sessions >= 0),
   exercises int not null default 0 check (exercises >= 0),
   sets int not null default 0 check (sets >= 0),
   hold_seconds int not null default 0 check (hold_seconds >= 0)
);