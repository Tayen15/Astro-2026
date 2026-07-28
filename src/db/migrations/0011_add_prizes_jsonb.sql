ALTER TABLE "competitions" ADD COLUMN "prizes" jsonb DEFAULT '[]'::jsonb NOT NULL;

-- Backfill: convert existing comma-separated prizes into JSONB array
UPDATE "competitions"
SET "prizes" = (
  SELECT COALESCE(
    jsonb_agg(item) FILTER (WHERE item IS NOT NULL),
    '[]'::jsonb
  )
  FROM (
    SELECT CASE WHEN prizes_first IS NOT NULL AND prizes_first != '' THEN jsonb_build_object('label', 'Juara 1', 'value', prizes_first) ELSE NULL END AS item
    UNION ALL
    SELECT CASE WHEN prizes_second IS NOT NULL AND prizes_second != '' THEN jsonb_build_object('label', 'Juara 2', 'value', prizes_second) ELSE NULL END
    UNION ALL
    SELECT CASE WHEN prizes_third IS NOT NULL AND prizes_third != '' THEN jsonb_build_object('label', 'Juara 3', 'value', prizes_third) ELSE NULL END
  ) sub
);
