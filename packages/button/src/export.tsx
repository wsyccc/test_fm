import Button from "."
import { ButtonProvider } from "./context"
import { ButtonPropsInterface } from "./type"

const ButtonRenderInPage: React.FC<ButtonPropsInterface> = (props) => {

  return <ButtonProvider><Button {...props} /></ButtonProvider>
}

export default ButtonRenderInPage