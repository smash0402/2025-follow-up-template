'use client'

import {
  Button,
  Table,
  Title,
  Container,
  Space,
  MultiSelect
} from '@mantine/core'
import { useTodos } from '@/app/hooks/useTodos'
import { useUser } from '@/app/hooks/useUser'
import Link from 'next/link'
import { deleteTodo } from '@/lib/apis/deleteTodo'
import { logout } from '@/lib/apis/logout'
import { isCompleteTodo } from '@/lib/apis/isCompleteTodo'
import { useState } from 'react'
import { TODOSTATE, type Priority, type TodoState } from '@shared/types'
import dayjs from 'dayjs'
import { AiFillAlert } from 'react-icons/ai'

export default function Page() {
  type filterTodo = {
    priority: Priority[]
    complete: TodoState[]
  }
  const { user, user_error, isLoading } = useUser()
  const [filter, setFilter] = useState<filterTodo>({
    priority: [],
    complete: []
  })
  const showActionButton = user?.userId ?? ''
  const checkLogin = !!showActionButton

  const { todos, error, mutate } = useTodos()
  if (isLoading) return <div>Loading...</div>
  if (user_error) return <div>Error fetching user: {user_error.message}</div>
  if (error) return <div>Error fetching todos: {error.message}</div>

  const handleDelete = async (id: number) => {
    const ok = confirm(`番号${id}のTodoリストを削除しますか？`)
    if (!ok) return

    await deleteTodo(id)
    mutate()
  }

  const logoutUser = async () => {
    const ok = confirm(`ログアウトしますか？`)
    if (!ok) return
    await logout()
    mutate()
  }

  const getColor = (
    priority: string,
    deadline: string | null,
    todoState: TodoState
  ) => {
    const checkOverdueTask = taskDeadlineComparison(deadline)
    if (checkOverdueTask < 0 || todoState === TODOSTATE.complete) {
      return 'rgb(193, 192, 192)'
    } else if (priority === '高') {
      return 'rgb(244, 164, 169)'
    } else if (priority === '中') {
      return 'rgb(255, 255, 188)'
    } else if (priority === '低') {
      return 'rgb(168, 238, 249)'
    } else {
      return 'rgb(168, 238, 249)'
    }
  }

  const changeTodoState = async (
    CompleteTodoId: number,
    TodoState: TodoState
  ) => {
    if (TodoState === '完了') {
      TodoState = '未完了'
    } else {
      TodoState = '完了'
    }
    await isCompleteTodo(CompleteTodoId, TodoState)
    mutate()
  }

  const truncateContent = (content: string) => {
    if (content.length >= 13) {
      return `${content.slice(0, 13)}...`
    }

    return content
  }

  const truncateTitle = (title: string) => {
    if (title.length >= 10) {
      return `${title.slice(0, 10)}...`
    }

    return title
  }

  const taskDeadlineComparison = (deadline: string | null) => {
    const deadlineDay = dayjs(deadline).startOf('day')
    return deadlineDay.diff(dayjs().startOf('day'), 'day')
  }

  return (
    <Container size='xl' mt='xl'>
      <Title order={2} mb='md'>
        ToDoリスト
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        {checkLogin ? (
          <>
            <Link href='/add'>
              <Button variant='filled'>追加</Button>
            </Link>
            <Link href={`/`}>
              <Button variant='filled' onClick={() => logoutUser()}>
                ログアウト
              </Button>
            </Link>
          </>
        ) : (
          <div style={{ marginLeft: 'auto' }}>
            <Link href={`/loginUser/`}>
              <Button variant='filled'>ログイン</Button>
            </Link>
          </div>
        )}
      </div>

      <Space h='md' />

      <Table striped highlightOnHover withTableBorder style={{ width: '100%' }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '25px', padding: '0px' }}></Table.Th>
            <Table.Th
              style={{
                paddingLeft: '0px'
              }}
            >
              番号
            </Table.Th>
            <Table.Th>タイトル</Table.Th>
            <Table.Th>内容</Table.Th>
            <Table.Th>作成日</Table.Th>
            <Table.Th>更新日</Table.Th>
            <Table.Th>期限日</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>優先度</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>作成者</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>タスク状況</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {todos
            .filter(
              (todo) =>
                (filter.priority.length === 0 ||
                  filter.priority.includes(todo.priority)) &&
                (filter.complete.length === 0 ||
                  filter.complete.includes(todo.todoState))
            )
            .map((todo) => (
              <Table.Tr
                key={todo.id}
                style={{
                  backgroundColor: getColor(
                    todo.priority,
                    todo.deadline,
                    todo.todoState
                  )
                }}
              >
                {0 <= taskDeadlineComparison(todo.deadline) &&
                taskDeadlineComparison(todo.deadline) <= 2 &&
                todo.todoState === TODOSTATE.incomplete ? (
                  <Table.Td
                    style={{
                      width: '10px',
                      paddingLeft: '5px',
                      paddingRight: '0px'
                    }}
                  >
                    <AiFillAlert color='red' size={'20px'} />
                  </Table.Td>
                ) : (
                  <Table.Td
                    style={{ width: '20px', paddingLeft: '5px' }}
                  ></Table.Td>
                )}
                <Table.Td
                  style={{
                    textAlign: 'center',
                    paddingLeft: '0px',
                    height: '51px'
                  }}
                >
                  {todo.id}
                </Table.Td>
                <Table.Td>{truncateTitle(todo.title)}</Table.Td>
                <Table.Td>{truncateContent(todo.content)}</Table.Td>
                <Table.Td>
                  {dayjs(todo.createdAt).format('YYYY月M日D日')}
                </Table.Td>
                <Table.Td>
                  {dayjs(todo.updatedAt).format('YYYY月M日D日')}
                </Table.Td>
                {todo.deadline ? (
                  <Table.Td>
                    {dayjs(todo.deadline).format('YYYY月M日D日')}
                  </Table.Td>
                ) : (
                  <Table.Td style={{ textAlign: 'center' }}>なし</Table.Td>
                )}
                <Table.Td style={{ textAlign: 'center' }}>
                  {todo.priority}
                </Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>{todo.name}</Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                  {todo.todoState}
                </Table.Td>
                {showActionButton === todo.userid ? (
                  <Table.Td
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingLeft: '0px'
                    }}
                  >
                    {todo.todoState === TODOSTATE.incomplete ? (
                      <Button
                        variant='filled'
                        onClick={() => changeTodoState(todo.id, todo.todoState)}
                        style={{ paddingLeft: '13px', paddingRight: '13px' }}
                      >
                        タスク完了　
                      </Button>
                    ) : (
                      <Button
                        variant='filled'
                        onClick={() => changeTodoState(todo.id, todo.todoState)}
                        style={{ paddingLeft: '13px', paddingRight: '13px' }}
                      >
                        タスク未完了
                      </Button>
                    )}
                    <Link href={`/edit?id=${todo.id}`}>
                      <Button variant='filled'>編集</Button>
                    </Link>
                    <Button
                      variant='filled'
                      onClick={() => handleDelete(todo.id)}
                    >
                      削除
                    </Button>
                  </Table.Td>
                ) : (
                  <Table.Td>
                    <Space style={{ width: '200px' }}></Space>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>

      <Space h='md' />

      <MultiSelect
        label='優先度フィルター'
        placeholder='フィルターするものを選んでください'
        data={['低', '中', '高']}
        value={filter.priority}
        hidePickedOptions
        style={{ width: '50%' }}
        onChange={(val) => {
          setFilter((prev) => ({
            ...prev,
            priority: val as filterTodo['priority']
          }))
          mutate()
        }}
      />

      <MultiSelect
        label='完了/未完了フィルター'
        placeholder='フィルターするものを選んでください'
        data={['完了', '未完了']}
        value={filter.complete}
        hidePickedOptions
        style={{ width: '50%' }}
        onChange={(val) => {
          setFilter((prev) => ({
            ...prev,
            complete: val as filterTodo['complete']
          }))
          mutate()
        }}
      />
    </Container>
  )
}
