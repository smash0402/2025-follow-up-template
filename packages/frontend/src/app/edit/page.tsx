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
import { useState } from 'react' //状態確認

export default function Page() {
  const [value, setValue] = useState({ title: '', content: '' })
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        編集画面
      </Title>

      <Stack gap='md'>
        <TextInput
          label='タイトル'
          placeholder='テキストを入力'
          value={value.title}
          maxLength={20}
          onChange={(event) =>
            setValue({ ...value, title: event.currentTarget.value })
          }
        />
        <TextInput
          label='内容'
          placeholder='テキストを入力'
          value={value.content}
          maxLength={200}
          onChange={(event) =>
            setValue({ ...value, content: event.currentTarget.value })
          }
        />

        <Group gap='sm'>
          <Link href='/'>
            <Button variant='filled'>追加</Button>
          </Link>

          <Link href='/'>
            <Button variant='filled'>戻る</Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  )
}
