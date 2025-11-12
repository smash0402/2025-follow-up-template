'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group
} from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { writeSQL } from '@/app/hooks/writeSQL'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      // console.log(value)
      await writeSQL({ title, content })
      router.push('/')
    } catch {
      alert('送信失敗')
    }
  }
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        追加画面
      </Title>

      <Stack gap='md'>
        <TextInput
          label='タイトル'
          placeholder='テキストを入力'
          value={title}
          maxLength={20}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <TextInput
          label='内容'
          placeholder='テキストを入力'
          value={content}
          maxLength={200}
          onChange={(event) => setContent(event.currentTarget.value)}
        />

        <Group gap='sm'>
          <Button variant='filled' onClick={handleSubmit}>
            追加
          </Button>

          <Link href='/'>
            <Button variant='filled'>戻る</Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  )
}
