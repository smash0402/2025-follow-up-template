import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps
} from '@mantine/core'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <title>Next.js App with Mantine</title>
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  )
}
