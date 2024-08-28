import { useRouteError } from "react-router-dom";
import "./ErrorPage.css"

const ErrorPage = () => {

    const error = useRouteError();
    console.error(error);

  return (
    <div className="ErrorPage">
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.message}</i>
            </p>
        </div>
    </div>
  )
}

export default ErrorPage