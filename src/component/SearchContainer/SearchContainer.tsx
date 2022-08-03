import React from 'react'

import { Button, Input, Typography } from 'antd'

import styles from './SearchContainer.module.scss'

const SearchContainer = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <Typography.Title>Введите название города</Typography.Title>
        <div className={styles.inputContainer}>
          <Input placeholder="Поиск..." />
        </div>
        <Button size="middle" type="primary">
          Найти
        </Button>
      </div>
    </div>
  )
}

export default SearchContainer
