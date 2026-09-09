import Link from "next/link"

export function Nav() {
  return (
    <nav>
      <div className="wrap row">
        <Link className="brand" href="/">
          soma<span>@</span>eipl
        </Link>
        <div className="links">
          <Link href="/#about">about</Link>
          <Link href="/#work">work</Link>
          <Link href="/projects">projects</Link>
          <Link href="/#skills">skills</Link>
          <Link href="/#background">background</Link>
          <Link href="/#contact">contact</Link>
        </div>
      </div>
    </nav>
  )
}
