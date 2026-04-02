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
import { useState, useEffect } from 'react' //状態確認
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { updateTodo } from '@/app/apis/updateTodo'
import type { User, EditTodo } from '@shared/types'

export default function Page() {
  const [title, setTitle] = useState<EditTodo['title']>('')
  const [content, setContent] = useState<EditTodo['content']>('')
  const searchParams = useSearchParams()
  const no = Number(searchParams.get('no'))
  const router = useRouter()

  useEffect(() => {
    if (!no) return
    const fetchTodo = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${API_URL}/todo/${no}`)
        if (!res.ok) throw new Error('Failed to fetch todo')
        const todo: User = await res.json()
        setTitle(todo.title)
        setContent(todo.content)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTodo()
  }, [no])

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }
    const check: EditTodo = {
      no,
      title,
      content
    }
    try {
      await updateTodo(check)
      router.push('/')
    } catch {
      alert('送信失敗')
    }
  }

  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        編集画面
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
            更新
          </Button>

          <Link href='/'>
            <Button variant='filled'>戻る</Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  )
}
