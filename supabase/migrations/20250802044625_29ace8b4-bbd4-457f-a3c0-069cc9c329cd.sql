-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to generate daily challenges at midnight UTC
SELECT cron.schedule(
  'generate-daily-challenges',
  '0 0 * * *', -- Daily at midnight UTC
  $$
  SELECT
    net.http_post(
        url:='https://glxchmdcgqumleuqjslh.supabase.co/functions/v1/generate-daily-challenges',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseGNobWRjZ3F1bWxldXFqc2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODYxMzcsImV4cCI6MjA2NjE2MjEzN30.7Dyl2NVDAiDy6BhSr199DtMo2XQ2MRwy5Y9EZcKqXX0"}'::jsonb,
        body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);