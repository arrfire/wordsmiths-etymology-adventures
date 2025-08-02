-- Manually trigger challenge generation for today
SELECT
  net.http_post(
      url:='https://glxchmdcgqumleuqjslh.supabase.co/functions/v1/generate-daily-challenges',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseGNobWRjZ3F1bWxldXFqc2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODYxMzcsImV4cCI6MjA2NjE2MjEzN30.7Dyl2NVDAiDy6BhSr199DtMo2XQ2MRwy5Y9EZcKqXX0"}'::jsonb,
      body:='{"manual_trigger": true}'::jsonb
  ) as request_id;