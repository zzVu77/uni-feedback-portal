import { Font, StyleSheet } from "@react-pdf/renderer";
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/Roboto/static/Roboto-Regular.ttf",
    },
    {
      src: "/Roboto/static/Roboto-Bold.ttf",
      fontWeight: "bold",
    },
    { src: "/Roboto/static/Roboto-Italic.ttf", fontStyle: "italic" },
  ],
});
export const styles = StyleSheet.create({
  page: {
    paddingTop: 80,
    paddingHorizontal: 40,
    paddingBottom: 40,
    fontSize: 10,
    fontFamily: "Roboto",
    position: "relative",
  },

  cover: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -120,
    textAlign: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 12 },
  subtitle: { fontSize: 14, color: "gray", textAlign: "center" },
  section: { marginBottom: 18 },
  h1: { fontSize: 18, marginBottom: 8, fontWeight: "bold" },
  h2: { fontSize: 13, marginBottom: 6 },
  row: { flexDirection: "row", gap: 10 },
  card: { flex: 1, padding: 12, borderRadius: 6, border: "1 solid #d9d9d9" },
  big: { fontSize: 18, fontWeight: "bold" },
  small: { fontSize: 9, color: "gray" },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    objectFit: "contain",
  },
  table: { width: "100%", borderWidth: 1, borderColor: "#ccc" },
  tr: { flexDirection: "row" },
  th: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
    borderRight: "1 solid #ccc",
  },
  td: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    borderTop: "1 solid #ccc",
    borderRight: "1 solid #ccc",
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 28,
    right: 28,
    fontSize: 8,
    color: "gray",
  },
});
