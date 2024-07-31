import Form from '../components/Form'
import React from 'react'

function Login({onLogin}) {
    return <Form route="/api/token/" method="login" onLogin={onLogin} />
}

export default Login