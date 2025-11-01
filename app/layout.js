import './globals.css'

export const metadata = {
  title: 'Genius Hub - Educational Platform',
  description: 'Your complete learning solution with Genius Hub',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
