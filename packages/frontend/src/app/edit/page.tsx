'use client'

import { Button, Textarea, Title, Container } from '@mantine/core'
import Link from 'next/link'

export default function Page() {
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        編集画面
      </Title>

      <Textarea label='タイトル' placeholder='テキストを入力' />
      <Textarea label='内容' placeholder='テキストを入力' />

      <Link href='/detail'>
        <Button variant='filled'>更新</Button>
      </Link>

      <Link href='/detail'>
        <Button variant='filled'>戻る</Button>
      </Link>
    </Container>
  )
}
