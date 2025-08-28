export default function SignCard({ label, media, onClick }) {
  return (
    <button className="card" onClick={onClick}>
      <div className="card-media">
        {/* 占位：将来放 GIF/视频或图片 */}
        <div className="media-placeholder">{label}</div>
      </div>
      <div className="card-title">{label}</div>
    </button>
  );
}
