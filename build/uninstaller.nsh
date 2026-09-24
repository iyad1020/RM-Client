; Optional wipe of user data on uninstall (assisted NSIS installer).
; Electron userData for this app is typically %APPDATA%\rm-client
; (package.json "name"). Also clear productName / Local variants just in case.

!macro customUnInstall
  SetShellVarContext current
  MessageBox MB_YESNO|MB_ICONQUESTION \
    "Удалить также настройки и локальный кэш RM Client?$\r$\n$\r$\nБудет очищена папка данных приложения (логин, кэш задач и т.п.).$\r$\nВыберите «Нет», если планируете установить приложение снова и сохранить данные." \
    /SD IDNO IDNO skip_delete_app_data

  RMDir /r "$APPDATA\rm-client"
  RMDir /r "$APPDATA\RM Client"
  RMDir /r "$LOCALAPPDATA\rm-client"
  RMDir /r "$LOCALAPPDATA\RM Client"

  skip_delete_app_data:
!macroend
