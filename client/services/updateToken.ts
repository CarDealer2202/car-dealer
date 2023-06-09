export const updateTokens = async () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const expiresInString = localStorage.getItem('expiresIn')
    if (expiresInString) {
        const expiresIn = parseInt(expiresInString)
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (expiresIn < currentTimeInSeconds) {
            const updateTokensRequest = await fetch('http://localhost:8080/me',{method:'POST',body:JSON.stringify({refreshToken})})
            const tokens = await updateTokensRequest.json()
            if (tokens) {
                localStorage.setItem('accessToken', tokens.accessToken)
                localStorage.setItem('refreshToken', tokens.refreshToken)
                localStorage.setItem('expiresIn', tokens.expiresIn)
            }
        }
    }
}