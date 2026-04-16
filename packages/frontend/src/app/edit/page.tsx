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
import type { UpdateTodoRequest, Todo } from '@shared/types'
import { PRIORITY, PUBLICSTATUS } from '@shared/types'
import { useGetEditTodo } from '@/app/hooks/useGetEditTodo'
import { DatePickerInput } from '@mantine/dates'

export default function Page() {
  const searchParams = useSearchParams()
  const id = Number(searchParams.get('id')) || 1
  const { todo, error } = useGetEditTodo(id)
  const [title, setTitle] = useState<Todo['title']>('')
  const [content, setContent] = useState<Todo['content']>('')
  const [priority, setPriority] = useState<Todo['priority']>(PRIORITY.low)
  const [deadline, setDeadline] = useState<Todo['deadline']>(null)
  const [publicStatus, setPublicStatus] = useState<Todo['publicStatus']>(
    PUBLICSTATUS.public
  )
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
    const check: UpdateTodoRequest = {
      id,
      title,
      content,
      priority,
      publicStatus,
      deadline
    }
    try {
      await updateTodo(check)
      router.push('/')
    } catch {
      alert('送信失敗')
    }
  }

  const onChangePriority = (value: string | null) => {
    if (value) setPriority(value as Todo['priority'])
  }

  const onChangePublicStatus = (value: string) => {
    if (value) setPublicStatus(value as Todo['publicStatus'])
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
              onChangePriority(value)
            }}
          />

          <DatePickerInput
            label='タスク締切日を選んでください'
            placeholder='日にち選択'
            value={deadline}
            onChange={setDeadline}
          />

          <Radio.Group
            value={String(publicStatus)}
            label='公開の有無 (他ユーザーから閲覧可能)'
            withAsterisk
            onChange={(value) => {
              onChangePublicStatus(value)
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
