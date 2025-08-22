export default function SearchBar({ value, onChange, onSubmit, placeholder='Search...' }) {
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.()}} className="flex gap-2">
      <input className="input" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
  )
}
