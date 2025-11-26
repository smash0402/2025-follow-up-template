'use client'

import { Button, Table, Title, Container } from '@mantine/core'
import { useTodos } from '@/app/hooks/useTodo'
import Link from 'next/link'
import { deleteSQL } from '@/app/hooks/deleteSQL'

export default function Page() {
  const { todos, error, isLoading } = useTodos()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching users: {error.message}</div>

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const HH = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
  }

  const handleDelete = async (no: number) => {
    const ok = confirm(`No.${no} を削除しますか？`)
    if (!ok) return

    await deleteSQL(no)
    window.location.reload()
  }

  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        ToDoリスト
      </Title>

      <div>
        <Link href='/add'>
          <Button variant='filled'>追加</Button>
        </Link>
      </div>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>番号</Table.Th>
            <Table.Th>タイトル</Table.Th>
            <Table.Th>内容</Table.Th>
            <Table.Th>作成日</Table.Th>
            <Table.Th>更新日</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {todos?.map((todo) => (
            <Table.Tr key={todo.no}>
              <Table.Td>{todo.no}</Table.Td>
              <Table.Td>{todo.title}</Table.Td>
              <Table.Td>{todo.content}</Table.Td>
              <Table.Td>{formatDateTime(todo.createdAt)}</Table.Td>
              <Table.Td>{formatDateTime(todo.updatedAt)}</Table.Td>
              <Table.Td>
                <Link href={`/edit?no=${todo.no}`}>
                  <Button variant='filled'>編集</Button>
                </Link>
                <Button variant='filled' onClick={() => handleDelete(todo.no)}>
                  削除
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
