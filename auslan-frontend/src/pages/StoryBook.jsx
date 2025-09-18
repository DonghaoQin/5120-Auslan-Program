// src/pages/StoryBook.jsx
export default function StoryBook() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-emerald-600 mb-4">
        Story Book
      </h1>
      <p className="text-slate-700 dark:text-slate-200">
        This is the Story Book page. Here you will be able to read short
        stories with highlighted keywords and practice Auslan signs in context.
      </p>

      {/* 占位示例：后期你可以在这里放故事内容 */}
      <div className="mt-6 p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
        <p className="font-medium">
          Example story will be displayed here...
        </p>
      </div>
    </div>
  );
}
