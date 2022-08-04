import React, { ChangeEvent, memo, useState } from 'react'

import { useRouter } from 'next/router'

import { Button, Input, Typography } from 'antd'

import styles from './SearchContainer.module.scss'

const SearchContainer = () => {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  const handleClick = () => {
    router.replace({
      query: {
        name: search
      }
    })
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <Typography.Title>Введите название города</Typography.Title>
        <div className={styles.inputContainer}>
          <Input size="large" placeholder="Поиск..." onChange={handleSearch} />
        </div>
        <Button type="primary" className={styles.button} onClick={handleClick}>
          Найти
        </Button>
      </div>
    </div>
  )
}

export default memo(SearchContainer)
