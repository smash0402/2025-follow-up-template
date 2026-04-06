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
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { login } from '@shared/types'
import { Login } from '@/lib/apis/login'

export default function Page() {
  const [userid, setUserId] = useState<login['userid']>('')
  const [password, setPassword] = useState<login['password']>('')
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

    const check: login = {
      userid,
      password
    }

    try {
      const res = await Login(check)
      if (res) router.push('/')
    } catch {}
  }
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        ログイン画面
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

          <Space h='md' />

          <Group gap='sm' style={{ justifyContent: 'space-between' }}>
            <Button variant='filled' onClick={handleSubmit}>
              確認
            </Button>
            <Link href='/createUser/'>
              <Button variant='filled'>ユーザー登録はこちら</Button>
            </Link>
          </Group>
        </form>
      </Stack>
    </Container>
  )
}
