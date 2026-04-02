'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group,
  Select
} from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addTodo } from '@/app/apis/addTodo'
import type { AddTodo } from '@shared/types'

export default function Page() {
  const [title, setTitle] = useState<AddTodo['title']>('')
  const [content, setContent] = useState<AddTodo['content']>('')
  const [priority, setPriority] = useState<AddTodo['priority']>('低')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }

    if (!priority.trim()) {
      alert('タスク優先度を選択してください')
      return
    }

    const check: AddTodo = {
      title,
      content,
      priority
    }

    try {
      await addTodo(check)
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

        <Select
          label='タスク優先度'
          placeholder='優先度を選んでください'
          data={['低', '中', '高']}
          value={priority}
          onChange={(value) => {
            if (value) setPriority(value as AddTodo['priority'])
          }}
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
