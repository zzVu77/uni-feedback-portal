-- models/staging/stg_ai_comment_analysis.sql

{{
    config(
        materialized='view'
    )
}}

with raw_ai_data as (
    select * from {{ source('ai_raw', 'comment_analysis') }}
),

deduplicated as (
    select
        TRIM(comment_id) as comment_id,
        TRIM(post_id) as post_id,
        TRIM(sentiment_label) as sentiment_label,
        SAFE_CAST(sentiment_score AS FLOAT64) as sentiment_score,
        COALESCE(SAFE_CAST(is_top_concern AS BOOL), FALSE) as is_top_concern,
        SAFE_CAST(analyzed_at AS TIMESTAMP) as analyzed_at,
        
        ROW_NUMBER() OVER (
            PARTITION BY comment_id 
            ORDER BY analyzed_at DESC
        ) as row_num
    from raw_ai_data
)

select
    comment_id,
    post_id,
    sentiment_label,
    sentiment_score,
    is_top_concern,
    analyzed_at
from deduplicated
where row_num = 1
