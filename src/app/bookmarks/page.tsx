import { BookMarked } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <BookMarked className="w-8 h-8 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Saved Bookmarks</h1>
      <p className="text-slate-500 max-w-md">
        Any topics, formulas, or concepts you highlight or bookmark will appear here for quick access later.
      </p>
      
      <div className="mt-8 px-6 py-4 bg-white border border-slate-200 rounded-xl max-w-sm w-full shadow-sm">
        <p className="text-slate-400 text-sm font-medium">You haven't bookmarked anything yet.</p>
      </div>
    </div>
  );
}
