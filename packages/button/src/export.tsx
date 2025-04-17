import Button from "."
import { ButtonProvider } from "./context"

const ButtonRenderInPage: React.FC = (props: ButtonPropsInterface | {}) => {

  return <ButtonProvider><Button props={props} /></ButtonProvider>
}

export default ButtonRenderInPage