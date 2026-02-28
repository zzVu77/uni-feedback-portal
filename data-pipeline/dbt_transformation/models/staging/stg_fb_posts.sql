-- models/staging/stg_fb_posts.sql
with raw_source as (
    select * from {{ source('social_raw', 'posts') }}
),

cleaned as (
    select
        -- create id for each post by hashing author and content, since Facebook doesn't provide a unique post ID in the raw data
        FARM_FINGERPRINT(concat(author, content)) as post_id,
        author,
        content,

        CASE 
            WHEN stats.reactions LIKE '%K' THEN
             CAST(REPLACE(stats.reactions, 'K', '') AS FLOAT64) * 1000
        ELSE
             SAFE_CAST(stats.reactions AS INT64)
        END as reaction_count,
        SAFE_CAST(stats.comments as INT64) as comment_count,
        
        crawled_at,
        
        -- mark duplicate posts by the same author with the same content, and keep only the most recent one
        ROW_NUMBER() OVER (
            PARTITION BY author, content 
            ORDER BY crawled_at DESC
        ) as row_num

    from raw_source
)

select * from cleaned
where row_num = 1