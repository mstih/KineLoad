-- Schema for all the tables in the database

-- Users table
create table users (
    id bigint generated always as identity primary key,
    name text not null,
    email text not null unique,
    password_hash text not null,
    created_at timestampz not null default now()
);
