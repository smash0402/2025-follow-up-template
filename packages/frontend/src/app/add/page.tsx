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

export default function Page() {
  const [value, setValue] = useState({ id: '', title: '' })
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        追加画面
      </Title>

      <Stack gap='md'>
        <TextInput
          label='タイトル'
          placeholder='テキストを入力'
          value={value.id}
          onChange={(event) =>
            setValue({ ...value, id: event.currentTarget.value })
          }
        />
        <TextInput
          label='内容'
          placeholder='テキストを入力'
          value={value.title}
          onChange={(event) =>
            setValue({ ...value, title: event.currentTarget.value })
          }
        />

        <Group gap='sm'>
          <Link href='/detail'>
            <Button variant='filled'>追加</Button>
          </Link>

          <Link href='/detail'>
            <Button variant='filled'>戻る</Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  )
}
