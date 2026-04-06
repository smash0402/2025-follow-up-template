'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group,
  Select,
  Space,
  Radio
} from '@mantine/core'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { updateTodo } from '@/lib/apis/updateTodo'
import type { EditTodo } from '@shared/types'
import { getEditTodo } from '@/app/hooks/getEditTodo'
import { DatePickerInput } from '@mantine/dates'

export default function Page() {
  const searchParams = useSearchParams()
  const id = Number(searchParams.get('id')) || 1
  const { todo, error } = getEditTodo(id)
  const [title, setTitle] = useState<EditTodo['title']>('')
  const [content, setContent] = useState<EditTodo['content']>('')
  const [priority, setPriority] = useState<EditTodo['priority']>('低')
  const [deadline, setDeadline] = useState<EditTodo['deadline']>(null)
  const [public_private, setPublicPrivate] =
    useState<EditTodo['public_private']>('public')
  const router = useRouter()

  useEffect(() => {
    if (!todo) return
    setTitle(todo.title)
    setContent(todo.content)
    setPriority(todo.priority)
    setDeadline(todo.deadline)
  }, [todo])

  if (error) return <div>Error fetching todos: {error.message}</div>

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }
    const check: EditTodo = {
      id,
      title,
      content,
      priority,
      public_private,
      deadline
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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
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

          <DatePickerInput
            label='タスク締切日を選んでください'
            placeholder='日にち選択'
            value={deadline}
            onChange={setDeadline}
          />

          <Radio.Group
            value={String(public_private)}
            label='公開の有無 (他ユーザーから閲覧可能)'
            withAsterisk
            onChange={(value) => {
              if (value) setPublicPrivate(value as EditTodo['public_private'])
            }}
          >
            <Group mt='xs'>
              <Radio value='public' label='public' />
              <Radio value='private' label='private' />
            </Group>
          </Radio.Group>

          <Space h='md' />

          <Group gap='sm'>
            <Button variant='filled' type='submit'>
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
