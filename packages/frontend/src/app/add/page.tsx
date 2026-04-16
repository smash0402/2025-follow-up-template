'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group,
  Select,
  Radio,
  Space
} from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addTodo } from '@/lib/apis/addTodo'
import type { AddTodoRequest, Todo } from '@shared/types'
import { DatePickerInput } from '@mantine/dates'

export default function Page() {
  const [title, setTitle] = useState<Todo['title']>('')
  const [content, setContent] = useState<Todo['content']>('')
  const [priority, setPriority] = useState<Todo['priority']>('低')
  const [deadline, setDeadline] = useState<Todo['deadline']>(null)
  const [public_private, setPublicPrivate] =
    useState<Todo['public_private']>('public')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }

    if (!priority.trim()) {
      alert('タスク優先度を選択してください')
      return
    }

    const check: AddTodoRequest = {
      title,
      content,
      priority,
      public_private,
      deadline
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
        <form
          onSubmit={(e) => {
            handleSubmit(e)
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
              if (value) setPriority(value as Todo['priority'])
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
              if (value) setPublicPrivate(value as Todo['public_private'])
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
              追加
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
