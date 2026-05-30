-- models/marts/mrt_posts_for_ai_feed.sql
with staging_posts as (
    select * from {{ ref('stg_fb_posts') }}
)

select
    post_id,
    posted_at,
    EXTRACT(DATE FROM posted_at) as post_date,
    EXTRACT(WEEK FROM posted_at) as post_week,
    content,
    reaction_count,
    comment_count,
    (reaction_count * 1) + (comment_count * 2) as engagement_score

from staging_posts
where LENGTH(content) > 50
order by engagement_score DESC, posted_at DESC