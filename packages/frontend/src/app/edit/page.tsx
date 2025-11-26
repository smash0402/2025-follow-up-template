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
import { updateSQL } from '@/app/hooks/updateSQL'

type Todo = {
  no: number
  title: string
  content: string
}

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const searchParams = useSearchParams()
  const no = Number(searchParams.get('no'))
  const router = useRouter()

  useEffect(() => {
    if (!no) return
    const fetchTodo = async () => {
      try {
        const res = await fetch(`http://localhost:8000/todo/${no}`)
        if (!res.ok) throw new Error('Failed to fetch todo')
        const todo: Todo = await res.json()
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
    try {
      // console.log(value)
      await updateSQL({ no, title, content })
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
