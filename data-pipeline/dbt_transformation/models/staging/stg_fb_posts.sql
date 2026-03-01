-- models/staging/stg_fb_posts.sql
with raw_source as (
    select * from {{ source('social_raw', 'posts') }}
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