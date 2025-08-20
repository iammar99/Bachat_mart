import React from 'react'
import { Link } from 'react-router-dom'

export default function LowerFooter() {

  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col">
            <p className="my-4 text-center fw-medium">
              &copy; {year} | All Rights Reserved by <Link to={"Ch-Ammar.vercel.app"}>Ammar</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
