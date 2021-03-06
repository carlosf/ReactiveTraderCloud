import React, { useState, useRef } from 'react'
import { Application } from 'openfin/_v2/main'
import { appConfigs, ApplicationConfig } from './applicationConfigurations'
import { LaunchButton } from './LaunchButton'
import { open } from './tools'
import { ButtonContainer, IconTitle } from './styles'

export const LauncherApps: React.FC = () => {
  const [openedList, setOpenedList] = useState<string[]>([])
  const appsOpenedListRef = useRef(openedList)

  //We use ref in order to access state inside listeners
  const setAppList = (appList: string[]) => {
    appsOpenedListRef.current = appList
    setOpenedList(appList)
  }

  const isActive = (name: string) => appsOpenedListRef.current.includes(name)
  const addToOpenedList = (name: string) => !isActive(name) && setAppList([...openedList, name])
  const removeFromOpenedList = (name: string) =>
    isActive(name) && setAppList(appsOpenedListRef.current.filter(item => name !== item))

  const handleOpen = (app: ApplicationConfig) => {
    open(app)
      .then(opened => {
        if (!opened) return

        const currentApp = opened as Application
        currentApp.addListener('closed', () => removeFromOpenedList(app.name))
        addToOpenedList(app.name)
      })
      .catch(err => {
        console.warn('Application already opened')
        addToOpenedList(app.name)
      })
  }

  return (
    <>
      {appConfigs.map(app => (
        <ButtonContainer key={app.name}>
          <LaunchButton
            title={app.tooltipName}
            onClick={() => handleOpen(app)}
            fill={app.iconhovercolor}
            active={isActive(app.name)}
          >
            {app.icon}
            <IconTitle>{app.displayName}</IconTitle>
          </LaunchButton>
        </ButtonContainer>
      ))}
    </>
  )
}
