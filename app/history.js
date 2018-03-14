import { useRouterHistory } from 'react-router'
import createHashHistory from 'history/lib/createHashHistory'

// export default useRouterHistory(createHashHistory)()
const history = useRouterHistory(createHashHistory)({})
export default history



/*"start": "webpack-dev-server --config ./scripts/webpack.dev.config.js",
"build": "webpack --config ./scripts/webpack.prod.config.js",
"lint": "eslint ./ --cache --fix --ignore-pattern .gitignore",
"mock": "supervisor -i node_modules mock/http.js",
"chat": "node ./scripts/chatServer.js"*/
