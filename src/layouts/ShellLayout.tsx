import { Outlet } from 'react-router-dom'
import { PortfolioMenu } from '../components/PortfolioMenu'

export function ShellLayout() {
  return (
    <>
      <PortfolioMenu />
      <Outlet />
    </>
  )
}
