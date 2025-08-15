import LustreTextComponent from '@/components/luster-text'
import ThemeSwitchIcon from '@/components/theme-switch-icon'
import React from 'react'

function Header() {
  return (
    <div className='flex w-full space-between'>
      <LustreTextComponent text='maklati'/>
      <ThemeSwitchIcon/>
    </div>
  )
}

export default Header
