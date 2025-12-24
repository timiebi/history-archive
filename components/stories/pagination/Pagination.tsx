import Link from "next/link";

export function Pagination({ page }: { page: number }) {
  return (
    <div className="flex justify-center gap-4 py-10">
      {page > 1 && (
        <Link
          href={`/?page=${page - 1}`}
          className="rounded-md border px-4 py-2"
        >
          Previous
        </Link>
      )}

      <Link
        href={`/?page=${page + 1}`}
        className="rounded-md border px-4 py-2"
      >
        Next
      </Link>
    </div>
  );
}
