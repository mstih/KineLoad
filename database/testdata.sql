-- Sample user (password: password1234)

insert into users (name, email, password_hash)
values (
    'Test user',
    'test@kineload.com',
    'placeholder_for_hash'
)
returning id;

-- Sample plan for sample user
insert into plans(user_id,name,start_date,weeks)
values(
    1, -- assuming
    'Test 20 week plan',
    current_date,
    20
)
returning id;

-- Create all 20 weeks
insert into weeks (plan_id, week_number)
select 1, generate_series(1,20);

-- Enter week 1 data
insert into strength_entries (week_id, sessions, intensity, exercises, reps, sets)
values (1, 2, 60, 10, 8, 3);

insert into endurance_entries (week_id, sessions, intensity, duration_min)
values (1, 1, 70, 9);

insert into flexibility_entries (week_id, sessions, exercises, sets, hold_seconds)
values (1, 3, 8, 3, 8);