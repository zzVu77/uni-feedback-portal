{{
    config(
        materialized='table' 
    )
}}

with posts as (
    select * from {{ ref('stg_fb_posts') }}
),

ai_analysis as (
    select * from {{ ref('stg_ai_post_analysis') }}
)

select
    p.post_id,
    p.author,
    p.content,
    p.post_link,
    p.posted_at,
    p.reaction_count,
    p.comment_count,
    (p.reaction_count * 1) + (p.comment_count * 2) as engagement_score,
    
    -- If AI analysis exists, use its topic; otherwise, default to 'Chưa phân tích'
    COALESCE(a.topic, 'Chưa phân tích') as topic,
    a.sentiment_score,
    a.ai_summary,
    
    -- Categorize sentiment score into labels
    CASE 
        WHEN a.sentiment_score is null THEN 'Chưa có dữ liệu'
        WHEN a.sentiment_score <= -0.5 THEN 'Tiêu cực'
        WHEN a.sentiment_score > -0.5 AND a.sentiment_score < 0.5 THEN 'Trung lập'
        WHEN a.sentiment_score >= 0.5 THEN 'Tích cực'
    END as sentiment_label,

    a.analyzed_at

from posts p
left join ai_analysis a on p.post_id = a.post_id
order by p.posted_at DESC