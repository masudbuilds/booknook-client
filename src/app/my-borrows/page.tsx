import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "BookNook | My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-[#1C3F3A]">My Borrowed Books</h1>
        <p className="mt-2 text-sm text-stone-600">
          Your active borrowed books table with return dates will appear here in Phase 5.
        </p>
      </div>
    </ProtectedRoute>
  );
}

