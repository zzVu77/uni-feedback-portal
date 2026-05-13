import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./report-styles";
import {
  FeedbackPost,
  KPIOverviewData,
  TopicDistributionItem,
} from "@/types/social-listening";
export const ReportDoc = ({
  kpiData,
  fromDate,
  toDate,
  sentimentChartImage,
  postCountChartImage,
  postsBySentimentData,
  topicBySentimentData,
}: {
  kpiData: KPIOverviewData | undefined;
  fromDate: string;
  toDate: string;
  sentimentChartImage: string;
  postCountChartImage: string;
  postsBySentimentData: FeedbackPost[] | undefined;
  topicBySentimentData: TopicDistributionItem[] | undefined;
}) => {
  const format = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };
  const getPositiveCount = () => {
    return (
      postsBySentimentData?.filter((p) => p.sentimentLabel === "Tích cực")
        .length || 0
    );
  };
  const getEngagementScore = () => {
    return (
      postsBySentimentData?.reduce((sum, p) => sum + p.engagementScore, 0) || 0
    );
  };
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.cover}>
            <Image src="/logo-hcmute.png" style={styles.logo} />
            <Text style={styles.title}>
              BÁO CÁO PHÂN TÍCH THẢO LUẬN TRÊN MẠNG XÃ HỘI VỀ TRƯỜNG ĐẠI HỌC
              CÔNG NGHỆ KỸ THUẬT TP.HCM
            </Text>
            <Text style={styles.subtitle}>
              Từ ngày {format(fromDate)} đến ngày {format(toDate)}
            </Text>
          </View>
        </Page>

        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.h1}>Tổng quan</Text>
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={[styles.big, { textAlign: "center" }]}>
                  {getPositiveCount()}
                </Text>
                <Text style={[styles.small, { textAlign: "center" }]}>
                  Tích cực
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={[styles.big, { textAlign: "center" }]}>
                  {kpiData?.negativePostsCount || 0}
                </Text>
                <Text style={[styles.small, { textAlign: "center" }]}>
                  Tiêu cực
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={[styles.big, { textAlign: "center" }]}>
                  {getEngagementScore()}
                </Text>
                <Text style={[styles.small, { textAlign: "center" }]}>
                  Tương tác
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.h1}>Phân tích biểu đồ</Text>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Image
                src={sentimentChartImage}
                style={{ width: 200, height: 200 }}
              />
              <Text style={{ fontSize: 8, marginTop: 12, fontStyle: "italic" }}>
                Biểu đồ phân bố cảm xúc của các bài đăng
              </Text>
            </View>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Image
                src={postCountChartImage}
                style={{ width: "100%", height: 300 }}
              />
              <Text style={{ fontSize: 8, marginTop: 12, fontStyle: "italic" }}>
                Biểu đồ số lượng bài viết theo ngày
              </Text>
            </View>
          </View>
        </Page>

        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.h1}>Phân loại theo chủ đề</Text>
            <View style={styles.table}>
              <View style={styles.tr}>
                <Text style={[styles.th, { flex: 0.2, textAlign: "center" }]}>
                  STT
                </Text>
                <Text style={[styles.th, { flex: 0.7, textAlign: "center" }]}>
                  Chủ đề
                </Text>
                <Text style={[styles.th, { flex: 0.2, textAlign: "center" }]}>
                  Tổng số bài viết
                </Text>
              </View>
              {topicBySentimentData?.map((p, i) => (
                <View style={styles.tr} key={i}>
                  <Text style={[styles.td, { flex: 0.2, textAlign: "center" }]}>
                    {i + 1}
                  </Text>
                  <Text style={[styles.td, { flex: 0.7, textAlign: "center" }]}>
                    {p.topic}
                  </Text>
                  <Text style={[styles.td, { flex: 0.2, textAlign: "center" }]}>
                    {p.count}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.h1}>Bảng các vấn đề tiêu biểu</Text>
            <View style={styles.table}>
              <View style={styles.tr}>
                <Text style={[styles.th, { flex: 0.2, textAlign: "center" }]}>
                  STT
                </Text>
                <Text style={[styles.th, { flex: 1.4, textAlign: "center" }]}>
                  Chủ đề
                </Text>
                <Text style={[styles.th, { flex: 2.9, textAlign: "center" }]}>
                  Nội dung
                </Text>
                <Text style={[styles.th, { flex: 0.7, textAlign: "center" }]}>
                  Ngày đăng
                </Text>
                <Text style={[styles.th, { flex: 0.8, textAlign: "center" }]}>
                  Tương tác
                </Text>
                <Text style={[styles.th, { flex: 0.7, textAlign: "center" }]}>
                  Cảm xúc
                </Text>
                <Text style={[styles.th, { flex: 0.7, textAlign: "center" }]}>
                  Trạng thái
                </Text>
              </View>
              {postsBySentimentData?.map((p, i) => (
                <View style={styles.tr} key={i}>
                  <Text style={[styles.td, { flex: 0.2, textAlign: "center" }]}>
                    {i + 1}
                  </Text>
                  <Text style={[styles.td, { flex: 1.4 }]}>{p.topic}</Text>
                  <Text style={[styles.td, { flex: 2.9 }]}>{p.content}</Text>
                  <Text style={[styles.td, { flex: 0.7, textAlign: "center" }]}>
                    {new Date(p.postedAt)
                      .toLocaleDateString("vi-VN")
                      .replace(/\//g, "/")}
                  </Text>
                  <Text style={[styles.td, { flex: 0.8, textAlign: "center" }]}>
                    {p.engagementScore}
                  </Text>
                  <Text style={[styles.td, { flex: 0.7, textAlign: "center" }]}>
                    {p.reactionCount}
                  </Text>
                  <Text style={[styles.td, { flex: 0.7, textAlign: "center" }]}>
                    {p.sentimentLabel}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};
