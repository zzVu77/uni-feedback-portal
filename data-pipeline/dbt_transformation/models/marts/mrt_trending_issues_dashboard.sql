{{
    config(
        materialized='incremental',
        unique_key='post_id',
        on_schema_change='append_new_columns'
    )
}}

with posts as (
    select * from {{ ref('stg_fb_posts') }}
),

ai_analysis as (
    select * from {{ ref('stg_ai_post_analysis') }}
    where is_relevant = TRUE 
),

comments_summary as (
    select
        post_id,
        comments_summary,
        urgency_level,
        negative_comments_ratio,
        analyzed_at as comments_analyzed_at
    from {{ source('ai_raw', 'post_comments_summary') }}
    qualify row_number() over (partition by post_id order by analyzed_at desc) = 1
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
        WHEN a.sentiment_score = -2 THEN 'Stress lo âu' 
        WHEN a.sentiment_score <= -0.5 THEN 'Tiêu cực'
        WHEN a.sentiment_score > -0.5 AND a.sentiment_score < 0.5 THEN 'Trung lập'
        WHEN a.sentiment_score >= 0.5 THEN 'Tích cực'
        ELSE 'Không xác định'
    END as sentiment_label,

    -- Comments synthesis & crisis indicators
    COALESCE(cs.post_id is not null, FALSE) as is_comments_crawled,
    cs.comments_summary as comments_ai_summary,
    COALESCE(cs.negative_comments_ratio, 0.0) as negative_comments_ratio,
    COALESCE(cs.urgency_level, 'NORMAL') as urgency_level,

    a.analyzed_at,
    p.crawled_at

from posts p
inner join ai_analysis a on p.post_id = a.post_id
left join comments_summary cs on p.post_id = cs.post_id

{% if is_incremental() %}

  -- Get only new or updated posts since the last run, based on either the post's crawl time or the AI analysis time.
  -- or based on the most recent analyzed_at time in the target table, to ensure we capture any updates to AI analysis.
  where p.crawled_at > (select coalesce(max(crawled_at), '1970-01-01') from {{ this }})
     or a.analyzed_at > (select coalesce(max(analyzed_at), '1970-01-01') from {{ this }})
     or cs.comments_analyzed_at is not null

{% endif %}

order by p.posted_at DESC