import { ImageResponse } from "next/og";

export const alt = "余一的 AI 推荐清单";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f7f3ea",
        color: "#171717",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#fffdf7",
          border: "6px solid #171717",
          boxShadow: "18px 18px 0 #171717",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "62px 70px",
          width: "100%",
        }}
      >
        <span style={{ color: "#5f5b52", fontSize: 28, fontWeight: 700 }}>AI PICKS</span>
        <span style={{ fontSize: 76, fontWeight: 900 }}>余一的 AI 推荐清单</span>
        <span style={{ fontSize: 32, lineHeight: 1.45 }}>标注审核状态的工具与工作流资料库</span>
        <span
          style={{
            alignSelf: "flex-start",
            background: "#ffd84d",
            border: "4px solid #171717",
            fontSize: 25,
            fontWeight: 800,
            padding: "14px 22px",
          }}
        >
          不是 AI 工具大全
        </span>
      </div>
    </div>,
    size,
  );
}
