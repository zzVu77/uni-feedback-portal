-- models/marts/mrt_post_comments_detail.sql

{{
    config(
        materialized='incremental',
        unique_key='comment_id',
        on_schema_change='append_new_columns'
    )
}}

with comments as (
    select * from {{ ref('stg_fb_comments') }}
),

ai_analysis as (
    select * from {{ ref('stg_ai_comment_analysis') }}
)

select
    c.comment_id,
    c.post_id,
    c.parent_comment_id,
    c.author,
    c.content,
    c.reaction_count,
    c.commented_at,
    
    COALESCE(a.sentiment_label, 'Chưa phân tích') as sentiment_label,
    COALESCE(a.sentiment_score, 0.0) as sentiment_score,
    COALESCE(a.is_top_concern, FALSE) as is_top_concern,
    
    a.analyzed_at,
    c.crawled_at

from comments c
left join ai_analysis a on c.comment_id = a.comment_id

{% if is_incremental() %}

  where c.crawled_at > (select coalesce(max(crawled_at), '1970-01-01') from {{ this }})
     or a.analyzed_at > (select coalesce(max(analyzed_at), '1970-01-01') from {{ this }})

{% endif %}

order by c.commented_at ASC
