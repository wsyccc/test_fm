import Barchart from "."
import { BarchartProvider } from "./context"
import { BarchartPropsInterface } from "./type"

const BarchartRenderInPage: React.FC<BarchartPropsInterface> = (props) => {
  
  return <BarchartProvider><Barchart {...props} /></BarchartProvider>
}

export default BarchartRenderInPage