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
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { idFetchTodo } from '@/app/apis/idFetchTodo'
import { updateTodo } from '@/app/apis/updateTodo'
import type { User, EditTodo } from '@shared/types'

export default function Page() {
  const [title, setTitle] = useState<EditTodo['title']>('')
  const [content, setContent] = useState<EditTodo['content']>('')
  const [priority, setPriority] = useState<EditTodo['priority']>('低')
  const searchParams = useSearchParams()
  const id = Number(searchParams.get('id')) || 1
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    const fetchTodo = async () => {
      try {
        const res = await idFetchTodo(id)
        const todo: User = await res.json()
        setTitle(todo.title)
        setContent(todo.content)
        setPriority(todo.priority)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTodo()
  }, [id])

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }
    const check: EditTodo = {
      id,
      title,
      content,
      priority
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
        <form>
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
              if (value) setPriority(value as EditTodo['priority'])
            }}
          />

          <Group gap='sm'>
            <Button variant='filled' onClick={handleSubmit}>
              更新
            </Button>

            <Link href='/'>
              <Button variant='filled'>戻る</Button>
            </Link>
          </Group>
        </form>
      </Stack>
    </Container>
  )
}
