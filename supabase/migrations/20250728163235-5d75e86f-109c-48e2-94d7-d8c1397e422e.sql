-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run every day at noon UTC
SELECT cron.schedule(
  'generate-daily-challenges',
  '0 12 * * *', -- Every day at 12:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://glxchmdcgqumleuqjslh.supabase.co/functions/v1/generate-daily-challenges',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseGNobWRjZ3F1bWxldXFqc2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODYxMzcsImV4cCI6MjA2NjE2MjEzN30.7Dyl2NVDAiDy6BhSr199DtMo2XQ2MRwy5Y9EZcKqXX0"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);