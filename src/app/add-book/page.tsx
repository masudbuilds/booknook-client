import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "BookNook | Add Book",
};

export default function AddBookPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-[#1C3F3A]">Add a New Book</h1>
        <p className="mt-2 text-sm text-stone-600">
          Book contribution form will be implemented in Phase 4.
        </p>
      </div>
    </ProtectedRoute>
  );
}

