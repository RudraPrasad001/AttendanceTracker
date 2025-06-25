CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    entrytime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_holiday BOOLEAN,
    pay_day BOOLEAN,
    is_present BOOLEAN
);
