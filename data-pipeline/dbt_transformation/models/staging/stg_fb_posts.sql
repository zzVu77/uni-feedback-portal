-- models/staging/stg_fb_posts.sql

{{
    config(
        materialized='incremental',
        unique_key='post_id',
        partition_by={
            "field": "crawled_at",
            "data_type": "timestamp",
            "granularity": "day"
        }
    )
}}

with raw_source as (
    select * from {{ source('social_raw', 'posts') }}
    
    -- This block only runs when the model exists and you are running incrementally
    {% if is_incremental() %}
        -- Filter to get only new data rows crawled after the last dbt run
        where SAFE_CAST(crawled_at AS TIMESTAMP) > (select max(crawled_at) from {{ this }})
    {% endif %}
),

cleaned as (
    select
        TO_HEX(MD5(
            COALESCE(NULLIF(post_link, ''), CONCAT(author, content))
        )) as post_id,
        
        author,
        content,
        post_link,
        SAFE_CAST(post_date AS TIMESTAMP) as posted_at,

        SAFE_CAST(stats.reactions AS INT64) as reaction_count,
        SAFE_CAST(stats.comments AS INT64) as comment_count,
        
        SAFE_CAST(crawled_at AS TIMESTAMP) as crawled_at

    from raw_source
),

deduplicated as (
    select 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY post_id 
            ORDER BY crawled_at DESC
        ) as row_num
    from cleaned
)

select 
    post_id,
    author,
    content,
    post_link,
    posted_at,
    reaction_count,
    comment_count,
    crawled_at
from deduplicated
where row_num = 1