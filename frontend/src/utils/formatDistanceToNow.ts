export function formatDistanceToNow(
  date: string | Date,
  { addSuffix }: { addSuffix: boolean },
): import("react").ReactNode {
  const now = new Date();
  const diffMs =
    now.getTime() -
    (typeof date === "string" ? new Date(date).getTime() : date.getTime());
  const absMs = Math.abs(diffMs);

  const seconds = Math.round(absMs / 1000);
  const minutes = Math.round(absMs / (60 * 1000));
  const hours = Math.round(absMs / (60 * 60 * 1000));
  const days = Math.round(absMs / (24 * 60 * 60 * 1000));
  const months = Math.round(absMs / (30 * 24 * 60 * 60 * 1000));
  const years = Math.round(absMs / (365 * 24 * 60 * 60 * 1000));

  let text: string;
  if (seconds < 45) {
    text = "vừa xong";
  } else if (seconds < 90) {
    text = "1 phút";
  } else if (minutes < 45) {
    text = `${minutes} phút`;
  } else if (minutes < 90) {
    text = "khoảng 1 giờ";
  } else if (hours < 24) {
    text = `${hours} giờ`;
  } else if (hours < 42) {
    text = "khoảng 1 ngày";
  } else if (days < 30) {
    text = `${days} ngày`;
  } else if (days < 45) {
    text = "khoảng 1 tháng";
  } else if (months < 12) {
    text = `${months} tháng`;
  } else if (years < 1.5) {
    text = "khoảng 1 năm";
  } else {
    text = `${years} năm`;
  }

  if (addSuffix) {
    if (text === "vừa xong" || text === "sắp xảy ra") {
      return text;
    }
  }

  return text;
}
