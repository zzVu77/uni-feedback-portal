{{
    config(
        materialized='view'
    )
}}

with raw_ai_data as (
    select * from `uni-feedback-data.ai_raw.post_analysis`
),

deduplicated as (
    select
        post_id,
        topic,
        SAFE_CAST(sentiment_score AS FLOAT64) as sentiment_score,
        ai_summary,
        SAFE_CAST(is_relevant AS BOOL) as is_relevant,
        SAFE_CAST(analyzed_at AS TIMESTAMP) as analyzed_at,
        
        -- Filter duplicates by keeping the most recent analysis for each post
        ROW_NUMBER() OVER (
            PARTITION BY post_id 
            ORDER BY analyzed_at DESC
        ) as row_num
    from raw_ai_data
)

select
    post_id,
    topic,
    sentiment_score,
    ai_summary,
    is_relevant,
    analyzed_at
from deduplicated
where row_num = 1