import { useModal } from "~/hooks/organisms/useModal";

describe('useModal', () => {
  test('引数で渡された値がcreateSignalにセットされていること', () => {
    const initialParams = true
    const {isOpen, onOpen} = useModal(initialParams)

    expect(isOpen()).toEqual(true)
  })

  test('onOpenを実行した時、isOpenがtrueになること', () => {
    const {isOpen, onOpen} = useModal(false)
    onOpen()

    expect(isOpen()).toEqual(true)
  })

  test('onCloseを実行した時、isOpenがfalseになること', () => {
    const {isOpen, onClose} = useModal(true)
    onClose()

    expect(isOpen()).toEqual(false)
  })
})
