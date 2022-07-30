import { FC } from 'react'

import { Layout as AntdLayout, Typography } from 'antd'

import styles from './Layout.module.scss'

const { Header, Content, Footer } = AntdLayout

const { Title } = Typography

export interface LayoutProps {
  children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <AntdLayout className={styles.layout}>
      <Header className={styles.header}>
        <Title className={styles.logo} level={3}>
          TRIP POINTS
        </Title>
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Footer</Footer>
    </AntdLayout>
  )
}

export default Layout
