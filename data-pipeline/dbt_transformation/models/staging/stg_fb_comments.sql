-- models/staging/stg_fb_comments.sql

{{
    config(
        materialized='incremental',
        unique_key='comment_id',
        partition_by={
            "field": "crawled_at",
            "data_type": "timestamp",
            "granularity": "day"
        }
    )
}}

with raw_source as (
    select * from {{ source('social_raw', 'comments') }}
    
    {% if is_incremental() %}
        -- Get only new comments crawled after the last dbt run
        where SAFE_CAST(crawled_at AS TIMESTAMP) > (select coalesce(max(crawled_at), '1970-01-01') from {{ this }})
    {% endif %}
),

cleaned as (
    select
        TRIM(comment_id) as comment_id,
        TRIM(post_id) as post_id,
        NULLIF(TRIM(parent_comment_id), '') as parent_comment_id,
        COALESCE(NULLIF(TRIM(author), ''), 'Sinh viên ẩn danh') as author,
        TRIM(content) as content,
        COALESCE(SAFE_CAST(reaction_count AS INT64), 0) as reaction_count,
        COALESCE(
            SAFE_CAST(commented_at AS TIMESTAMP),
            SAFE_CAST(crawled_at AS TIMESTAMP)
        ) as commented_at,
        SAFE_CAST(crawled_at AS TIMESTAMP) as crawled_at
    from raw_source
    where content is not null 
      and TRIM(content) != ''
),

deduplicated as (
    select 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY comment_id 
            ORDER BY crawled_at DESC
        ) as row_num
    from cleaned
)

select 
    comment_id,
    post_id,
    parent_comment_id,
    author,
    content,
    reaction_count,
    commented_at,
    crawled_at
from deduplicated
where row_num = 1
