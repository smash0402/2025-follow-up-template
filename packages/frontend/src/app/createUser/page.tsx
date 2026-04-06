'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group,
  Space
} from '@mantine/core'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserInfo } from '@shared/types'
import { addUserInfo } from '@/lib/apis/addUserinfo'

export default function Page() {
  const [userid, setUserId] = useState<UserInfo['userid']>('')
  const [password, setPassword] = useState<UserInfo['password']>('')
  const [name, setName] = useState<UserInfo['name']>('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!userid.trim()) {
      alert('タイトルを入力してください。')
      return
    }

    if (!password.trim()) {
      alert('パスワードを入力してください')
      return
    }

    if (!name.trim()) {
      alert('名前を入力してください')
      return
    }

    const check: UserInfo = {
      userid,
      password,
      name
    }

    try {
      await addUserInfo(check)
      router.push('/')
    } catch {
      alert('送信失敗')
    }
  }
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        ユーザー情報登録画面
      </Title>

      <Stack gap='md'>
        <form>
          <TextInput
            label='ユーザーid'
            placeholder='ユーザーidを入力'
            value={userid}
            maxLength={20}
            onChange={(event) =>
              setUserId(event.currentTarget.value.replace(/[^a-zA-Z0-9_]/g, ''))
            }
          />
          <TextInput
            label='パスワード'
            placeholder='パスワードを入力'
            value={password}
            maxLength={20}
            onChange={(event) =>
              setPassword(
                event.currentTarget.value.replace(/[^a-zA-Z0-9_]/g, '')
              )
            }
          />

          <TextInput
            label='名前'
            placeholder='名前を入力'
            value={name}
            maxLength={20}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <Space h='md' />

          <Group gap='sm'>
            <Button variant='filled' onClick={handleSubmit}>
              確認
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  )
}
