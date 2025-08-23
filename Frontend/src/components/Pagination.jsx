export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const numbers = []
  for (let i=1;i<=totalPages;i++) numbers.push(i)
  return (
    <div className="flex gap-2 items-center justify-center mt-6">
      <button className="btn btn-outline" disabled={page===1} onClick={()=>onPageChange(page-1)}>Prev</button>
      {numbers.map(n => (
        <button key={n} onClick={()=>onPageChange(n)}
          className={'px-3 py-2 rounded-lg text-sm ' + (n===page ? 'bg-gray-900 text-white' : 'hover:bg-gray-100')}>
          {n}
        </button>
      ))}
      <button className="btn btn-outline" disabled={page===totalPages} onClick={()=>onPageChange(page+1)}>Next</button>
    </div>
  )
}
