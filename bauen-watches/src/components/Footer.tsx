export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border text-center py-10">
      <p className="text-textSubtle text-sm tracking-wide">
        © {new Date().getFullYear()} Bauen — The art of precision.
      </p>
    </footer>
  )
}
